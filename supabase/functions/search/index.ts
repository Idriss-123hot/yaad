
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../_shared/cors.ts';

// Create a Supabase client with the auth key for public access
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get search term from URL search params
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || 'all'; // 'all', 'products', 'artisans'
    
    if (!searchTerm) {
      return new Response(JSON.stringify({ error: 'Search term is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Searching for: ${searchTerm}, type: ${type}`);
    
    const results: { products?: any[], artisans?: any[] } = {};

    // Search products if requested
    if (type === 'all' || type === 'products') {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          artisan:artisans(name, profile_photo),
          category:categories(name, slug)
        `)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,material.ilike.%${searchTerm}%,origin.ilike.%${searchTerm}%`)
        .limit(10);
      
      if (productsError) {
        console.error('Error searching products:', productsError);
      } else {
        results.products = products;
      }
    }

    // Search artisans if requested
    if (type === 'all' || type === 'artisans') {
      const { data: artisans, error: artisansError } = await supabase
        .from('artisans')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .limit(10);
      
      if (artisansError) {
        console.error('Error searching artisans:', artisansError);
      } else {
        results.artisans = artisans;
      }
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error during search:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
