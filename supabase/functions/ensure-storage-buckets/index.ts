
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createStoragePolicy } from "./helpers.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // List of buckets to ensure exist
    const bucketsToCreate = [
      {
        id: 'products',
        name: 'Produits',
        public: true
      },
      {
        id: 'artisans',
        name: 'Artisans',
        public: true
      },
      {
        id: 'categories',
        name: 'Catégories',
        public: true
      }
    ];

    // Create each bucket if it doesn't exist
    const results = [];
    for (const bucket of bucketsToCreate) {
      // Check if bucket exists
      const { data: existingBucket, error: getBucketError } = await supabaseAdmin
        .storage
        .getBucket(bucket.id);

      if (getBucketError && !existingBucket) {
        // Create bucket if it doesn't exist
        const { data, error } = await supabaseAdmin
          .storage
          .createBucket(bucket.id, {
            public: bucket.public,
            fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
          });

        if (error) {
          console.error(`Error creating bucket ${bucket.id}:`, error);
          results.push({ bucket: bucket.id, success: false, error: error.message });
        } else {
          console.log(`Created bucket: ${bucket.id}`);
          
          // Create public access policies for this bucket
          if (bucket.public) {
            // Create SELECT policy - anyone can view files
            await createStoragePolicy(
              supabaseAdmin,
              bucket.id,
              `${bucket.id}_public_select`,
              'true',
              'SELECT'
            );
            
            // Create INSERT policy - authenticated users can upload files
            await createStoragePolicy(
              supabaseAdmin,
              bucket.id,
              `${bucket.id}_auth_insert`,
              '(auth.role() = \'authenticated\')',
              'INSERT'
            );
            
            // Create UPDATE policy - authenticated users can update their files
            await createStoragePolicy(
              supabaseAdmin,
              bucket.id,
              `${bucket.id}_auth_update`,
              '(auth.role() = \'authenticated\')',
              'UPDATE'
            );
            
            // Create DELETE policy - authenticated users can delete their files
            await createStoragePolicy(
              supabaseAdmin,
              bucket.id,
              `${bucket.id}_auth_delete`,
              '(auth.role() = \'authenticated\')',
              'DELETE'
            );
          }
          
          results.push({ bucket: bucket.id, success: true });
        }
      } else {
        results.push({ bucket: bucket.id, success: true, existed: true });
      }
    }

    // Return success response with CORS headers
    return new Response(
      JSON.stringify({ success: true, results }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in ensure-storage-buckets function:', error);
    
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Une erreur est survenue lors de la création des buckets de stockage',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});
