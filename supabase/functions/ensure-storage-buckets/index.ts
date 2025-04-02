
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createStandardPolicies } from "./helpers.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin API key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting ensure-storage-buckets function");

    // List of buckets to ensure exist
    const bucketsToCreate = [
      { name: 'avatars', isPublic: true },
      { name: 'products', isPublic: true },
      { name: 'categories', isPublic: true },
    ];

    const results = [];

    // Check and create each bucket
    for (const bucket of bucketsToCreate) {
      // Check if bucket exists
      const { data: bucketExists, error: checkError } = await supabase
        .storage
        .getBucket(bucket.name);

      if (checkError && checkError.code !== 'PGRST116') {
        // An error occurred other than "not found"
        results.push({
          bucket: bucket.name,
          status: 'error',
          error: checkError
        });
        continue;
      }

      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        const { data, error: createError } = await supabase.storage.createBucket(
          bucket.name,
          { public: bucket.isPublic }
        );

        if (createError) {
          results.push({
            bucket: bucket.name,
            status: 'error',
            error: createError
          });
        } else {
          console.log(`Bucket ${bucket.name} created successfully`);
          
          // Create policies for the new bucket
          await createStandardPolicies(supabase, bucket.name, bucket.isPublic);
          
          results.push({
            bucket: bucket.name,
            status: 'created',
            public: bucket.isPublic
          });
        }
      } else {
        // Bucket already exists
        results.push({
          bucket: bucket.name,
          status: 'exists'
        });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in ensure-storage-buckets function:", error);

    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
