
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Initializing ensure-storage-buckets function");

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not set');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Define storage buckets to ensure
    const requiredBuckets = [
      { id: 'products', public: true },
      { id: 'avatars', public: true },
      { id: 'categories', public: true },
    ];

    const results = [];

    // Check and create buckets if they don't exist
    for (const bucket of requiredBuckets) {
      // Check if bucket exists
      const { data: existingBucket, error: getBucketError } = await supabase
        .storage
        .getBucket(bucket.id);

      if (getBucketError && getBucketError.message.includes('not found')) {
        // Create the bucket if it doesn't exist
        console.log(`Creating storage bucket: ${bucket.id}`);
        const { data: newBucket, error: createError } = await supabase
          .storage
          .createBucket(bucket.id, { public: bucket.public });

        if (createError) {
          throw createError;
        }

        // Create RLS policy to allow public read access if bucket is public
        if (bucket.public) {
          const { error: policyError } = await supabase.rpc('create_storage_policy', {
            bucket_id: bucket.id,
            policy_name: `${bucket.id}_public_read`,
            definition: `bucket_id = '${bucket.id}'`,
            policy_action: 'SELECT'
          });

          if (policyError) {
            console.error(`Error creating read policy for ${bucket.id}:`, policyError);
            // Continue even if policy creation fails as we may need to handle it differently
          }
          
          // Allow authenticated users to upload
          const { error: uploadPolicyError } = await supabase.rpc('create_storage_policy', {
            bucket_id: bucket.id,
            policy_name: `${bucket.id}_auth_insert`,
            definition: `bucket_id = '${bucket.id}' AND auth.role() = 'authenticated'`,
            policy_action: 'INSERT'
          });
          
          if (uploadPolicyError) {
            console.error(`Error creating upload policy for ${bucket.id}:`, uploadPolicyError);
          }
        }
        
        results.push({ bucket: bucket.id, action: 'created', public: bucket.public });
      } else if (!getBucketError) {
        results.push({ bucket: bucket.id, action: 'exists', public: existingBucket.public });
      } else {
        throw getBucketError;
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in ensure-storage-buckets function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
