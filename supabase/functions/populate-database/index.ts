
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { SAMPLE_ARTISANS, SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from './sample-data.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Admin check would go here in production

    console.log('Starting database population');
    
    // Insert categories
    for (const category of SAMPLE_CATEGORIES) {
      const { error: categoryError } = await supabase
        .from('categories')
        .upsert({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || null,
          image: category.image
        }, { onConflict: 'id' });
      
      if (categoryError) {
        console.error('Error inserting category:', categoryError);
      }
    }
    
    // Insert artisans
    for (const artisan of SAMPLE_ARTISANS) {
      // First check if the user exists or create a dummy user
      const { data: existingUser, error: userQueryError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', artisan.id)
        .maybeSingle();
      
      if (userQueryError) {
        console.error('Error querying user:', userQueryError);
        continue;
      }
      
      if (!existingUser) {
        // Create a dummy user profile
        const { error: userError } = await supabase
          .from('profiles')
          .insert({
            id: artisan.id,
            email: `artisan_${artisan.id}@example.com`,
            first_name: artisan.name.split(' ')[0],
            last_name: artisan.name.split(' ').slice(1).join(' '),
            role: 'artisan'
          });
        
        if (userError) {
          console.error('Error inserting user:', userError);
          continue;
        }
      }
      
      // Insert the artisan
      const { error: artisanError } = await supabase
        .from('artisans')
        .upsert({
          id: artisan.id,
          name: artisan.name,
          bio: artisan.bio,
          location: artisan.location,
          profile_photo: artisan.profileImage,
          gallery_images: artisan.galleryImages,
          rating: artisan.rating,
          review_count: artisan.reviewCount,
          featured: artisan.featured || false,
          joined_date: artisan.joinedDate.toISOString(),
          user_id: artisan.id  // Using the same ID as user_id for simplicity
        }, { onConflict: 'id' });
      
      if (artisanError) {
        console.error('Error inserting artisan:', artisanError);
      }
    }
    
    // Insert products
    for (const product of SAMPLE_PRODUCTS) {
      const { error: productError } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          discount_price: product.discountPrice,
          category_id: (await supabase
            .from('categories')
            .select('id')
            .eq('name', product.category)
            .maybeSingle()).data?.id,
          tags: product.tags,
          images: product.images,
          stock: product.stock,
          artisan_id: product.artisanId,
          rating: product.rating,
          review_count: product.reviewCount,
          featured: product.featured || false,
          material: product.material,
          origin: product.origin
        }, { onConflict: 'id' });
      
      if (productError) {
        console.error('Error inserting product:', productError);
        continue;
      }
      
      // Insert product variations if they exist
      if (product.variations && product.variations.length > 0) {
        for (const variation of product.variations) {
          const { error: variationError } = await supabase
            .from('product_variations')
            .upsert({
              id: variation.id,
              product_id: product.id,
              name: variation.name,
              options: variation.options
            }, { onConflict: 'id' });
          
          if (variationError) {
            console.error('Error inserting product variation:', variationError);
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Database populated successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error populating database:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
