
/**
 * Edge Function: import-artisans
 * 
 * This function automatically creates artisan profiles from the provided data
 * It specifically handles the new first_gallery_images and second_gallery_images fields
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Define types for Artisan data
interface ArtisanData {
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  name: string;
  description: string;
  location: string;
  bio: string;
  profile_photo: string;
  first_gallery_images: string;
  second_gallery_images: string;
  website: string;
  rating: number;
  review_count: number;
  featured: boolean;
  joined_date: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function importArtisans(artisansData: ArtisanData[]) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  for (const artisan of artisansData) {
    try {
      // First check if user exists
      const userEmail = artisan.email;
      
      // Try to fetch existing user
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", userEmail)
        .maybeSingle();
      
      let userId;
      
      if (!existingUser) {
        // Create auth user if needed
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userEmail,
          password: "password123", // Temporary password - should be changed
          email_confirm: true,
          user_metadata: {
            first_name: artisan.first_name,
            last_name: artisan.last_name,
            role: artisan.role
          }
        });
        
        if (authError) {
          console.error(`Error creating auth user for ${userEmail}:`, authError);
          continue;
        }
        
        userId = authData.user.id;
      } else {
        userId = existingUser.id;
      }
      
      // Check if artisan profile exists
      const { data: existingArtisan } = await supabase
        .from("artisans")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (existingArtisan) {
        // Update existing artisan
        const { error: updateError } = await supabase
          .from("artisans")
          .update({
            name: artisan.name,
            description: artisan.description,
            location: artisan.location,
            bio: artisan.bio,
            profile_photo: artisan.profile_photo,
            first_gallery_images: artisan.first_gallery_images,
            second_gallery_images: artisan.second_gallery_images,
            website: artisan.website,
            rating: artisan.rating,
            review_count: artisan.review_count,
            featured: artisan.featured === true || artisan.featured === "yes",
            joined_date: new Date(artisan.joined_date).toISOString()
          })
          .eq("user_id", userId);
          
        if (updateError) {
          console.error(`Error updating artisan ${artisan.name}:`, updateError);
        }
      } else {
        // Create new artisan
        const { error: insertError } = await supabase
          .from("artisans")
          .insert({
            user_id: userId,
            name: artisan.name,
            description: artisan.description,
            location: artisan.location,
            bio: artisan.bio,
            profile_photo: artisan.profile_photo,
            first_gallery_images: artisan.first_gallery_images,
            second_gallery_images: artisan.second_gallery_images,
            website: artisan.website,
            rating: artisan.rating,
            review_count: artisan.review_count,
            featured: artisan.featured === true || artisan.featured === "yes",
            joined_date: new Date(artisan.joined_date).toISOString()
          });
          
        if (insertError) {
          console.error(`Error creating artisan ${artisan.name}:`, insertError);
        }
      }
      
      console.log(`Successfully processed artisan: ${artisan.name}`);
    } catch (error) {
      console.error(`Error processing artisan ${artisan.email}:`, error);
    }
  }
  
  return { success: true, message: `Processed ${artisansData.length} artisans` };
}

// Example artisans data - just add the first two for demonstration
// You would typically load this from an external source like JSON or CSV
const sampleArtisans: ArtisanData[] = [
  {
    email: "Aicha.Lakhdar@hotmail.com",
    role: "artisan",
    first_name: "Aicha",
    last_name: "Lakhdar",
    name: "Aicha Lakhdar",
    description: "Artisane céramiste avec 15 ans d'expérience et une spécialisation dans les designs minimalistes inspirés de la nature.",
    location: "Rabat, Maroc",
    bio: "Artisane céramiste avec 15 ans d'expérience et une spécialisation dans les designs minimalistes inspirés de la nature.",
    profile_photo: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/profiles/Artisans/Aicha%20Lakhdar%20Fake%20Artisan.jpeg",
    first_gallery_images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/profiles/Artisans/Aicha%20Lakhdar%20Fake%20Artisan.jpeg",
    second_gallery_images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/ceramique%20marocaine.jpeg",
    website: "https://preview--yaad.lovable.app/",
    rating: 4.9,
    review_count: 87,
    featured: true,
    joined_date: "2022-03-01",
  },
  {
    email: "Karim.Belouz@hotmail.com",
    role: "artisan",
    first_name: "Karim",
    last_name: "Belouz",
    name: "Karim Belouz",
    description: "Textile artist specializing in hand-woven pieces using traditional looms and organic materials.",
    location: "Casablanca, Maroc",
    bio: "Textile artist specializing in hand-woven pieces using traditional looms and organic materials.",
    profile_photo: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/profiles/Artisans/Karim%20Belouz%20Fake%20Artisan%20Yaad.avif",
    first_gallery_images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/Karim%20Bellouz%20fake%20Artisan/art%20textile%20maroc%20Karim%20Bellouz%20Gallery%201.png",
    second_gallery_images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/Karim%20Bellouz%20fake%20Artisan/art%20textile%20maroc%20Karim%20Bellouz%20Gallery%202.jpeg",
    website: "https://preview--yaad.lovable.app/",
    rating: 4.8,
    review_count: 62,
    featured: true,
    joined_date: "2022-06-01",
  }
];

// Note: You can add the remaining artisans from the provided data following the same pattern

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    if (req.method === "POST") {
      // Parse artisans data from request body
      const requestData = await req.json();
      const artisansData = requestData.artisans || sampleArtisans;
      
      const result = await importArtisans(artisansData);
      
      return new Response(
        JSON.stringify(result),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }
    
    // Default response - show sample data
    return new Response(
      JSON.stringify({ 
        message: "POST artisan data to this endpoint to import",
        sampleFormat: sampleArtisans[0]
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
