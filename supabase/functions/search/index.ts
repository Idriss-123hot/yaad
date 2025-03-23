
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6'
import { corsHeaders } from '../_shared/cors.ts'
import { Database } from '../_shared/types.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
    const url = new URL(req.url)
    
    // Get search parameters from URL
    const searchQuery = url.searchParams.get('q') || ''
    const type = url.searchParams.get('type') || 'all'
    
    if (!searchQuery || searchQuery.length < 2) {
      return new Response(
        JSON.stringify({ products: [], artisans: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const results: { products?: any[], artisans?: any[] } = {}
    
    // Search for products
    if (type === 'all' || type === 'products') {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_variations(*),
          artisan:artisans(*),
          category:categories(*)
        `)
        .textSearch('search_vector', searchQuery)
        .limit(type === 'all' ? 4 : 20)
      
      if (productsError) throw productsError
      results.products = products
    }
    
    // Search for artisans
    if (type === 'all' || type === 'artisans') {
      const { data: artisans, error: artisansError } = await supabase
        .from('artisans')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .limit(type === 'all' ? 4 : 20)
      
      if (artisansError) throw artisansError
      results.artisans = artisans
    }

    return new Response(
      JSON.stringify(results),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
