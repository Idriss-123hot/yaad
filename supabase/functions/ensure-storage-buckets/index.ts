
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createStandardPolicies } from "./helpers.ts";

/**
 * En-têtes CORS pour permettre les requêtes cross-origin
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Fonction Edge pour créer et configurer des buckets de stockage
 * 
 * Cette fonction s'assure que tous les buckets nécessaires existent
 * et ont les bonnes politiques d'accès configurées.
 */
serve(async (req: Request) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Création d'un client Supabase avec la clé API Admin
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting ensure-storage-buckets function");

    // Liste des buckets à créer
    const bucketsToCreate = [
      { name: 'avatars', isPublic: true },  // Stockage d'avatars utilisateurs (public)
      { name: 'products', isPublic: true },  // Stockage d'images de produits (public)
      { name: 'categories', isPublic: true },  // Stockage d'images de catégories (public)
    ];

    const results = [];

    // Vérification et création de chaque bucket
    for (const bucket of bucketsToCreate) {
      // Vérifier si le bucket existe
      const { data: bucketExists, error: checkError } = await supabase
        .storage
        .getBucket(bucket.name);

      if (checkError && checkError.code !== 'PGRST116') {
        // Une erreur s'est produite autre que "not found"
        results.push({
          bucket: bucket.name,
          status: 'error',
          error: checkError
        });
        continue;
      }

      if (!bucketExists) {
        // Créer le bucket s'il n'existe pas
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
          
          // Créer des politiques pour le nouveau bucket
          await createStandardPolicies(supabase, bucket.name, bucket.isPublic);
          
          results.push({
            bucket: bucket.name,
            status: 'created',
            public: bucket.isPublic
          });
        }
      } else {
        // Le bucket existe déjà
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
