
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get request body
    const body = await req.json();
    const { artisans } = body;

    if (!artisans || !Array.isArray(artisans) || artisans.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or empty artisans array" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Process each artisan
    const results = await Promise.all(
      artisans.map(async (artisan) => {
        try {
          // First, create a profile for the artisan
          const { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .insert({
              id: artisan.id || crypto.randomUUID(),
              email: artisan.email,
              role: 'artisan',
              first_name: artisan.first_name,
              last_name: artisan.last_name
            })
            .select('id')
            .single();

          if (profileError) {
            console.error('Error creating profile:', profileError);
            return { 
              success: false, 
              email: artisan.email, 
              error: profileError.message 
            };
          }

          // Next, create the artisan record
          const { data: artisanData, error: artisanError } = await supabaseClient
            .from('artisans')
            .insert({
              user_id: profileData.id,
              name: artisan.name,
              bio: artisan.bio,
              description: artisan.description,
              location: artisan.location,
              profile_photo: artisan.profile_photo,
              first_gallery_images: artisan.first_gallery_images ? [artisan.first_gallery_images] : null,
              second_gallery_images: artisan.second_gallery_images,
              website: artisan.website,
              rating: artisan.rating,
              review_count: artisan.review_count,
              featured: artisan.featured === 'yes' || artisan.featured === true,
              joined_date: artisan.joined_date
            });

          if (artisanError) {
            console.error('Error creating artisan:', artisanError);
            return { 
              success: false, 
              email: artisan.email, 
              error: artisanError.message 
            };
          }

          return { 
            success: true, 
            email: artisan.email 
          };
        } catch (error) {
          console.error('Error processing artisan:', error);
          return { 
            success: false, 
            email: artisan.email, 
            error: error.message 
          };
        }
      })
    );

    return new Response(
      JSON.stringify({ results }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
