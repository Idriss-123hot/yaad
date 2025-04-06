
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Default image URL for product images
const TEST_IMAGE_URL = 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg'

// Function to create a new product with test data
async function createProduct(
  subcategoryId: string,
  subcategoryName: string,
  categoryId: string,
  artisanId: string
) {
  // Generate a product title based on subcategory
  const title = `Produit artisanal - ${subcategoryName}`
  
  // Create product with default test data
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      title: title,
      description: `Magnifique produit artisanal dans la catégorie ${subcategoryName}. Fabriqué à la main avec des techniques traditionnelles marocaines.`,
      price: Math.floor(Math.random() * 900) + 100, // Random price between 100 and 1000
      stock: Math.floor(Math.random() * 50) + 5, // Random stock between 5 and 55
      artisan_id: artisanId,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      featured: Math.random() > 0.8, // ~20% chance of being featured
      rating: (Math.random() * 2) + 3, // Random rating between 3 and 5
      review_count: Math.floor(Math.random() * 50), // Random number of reviews
      material: 'Matériau traditionnel',
      origin: 'Maroc',
      tags: ['artisanal', 'traditionnel', 'fait main', subcategoryName.toLowerCase()],
      images: [TEST_IMAGE_URL, TEST_IMAGE_URL, TEST_IMAGE_URL, TEST_IMAGE_URL], // Use test image for all four slots
      production_time: Math.floor(Math.random() * 10) + 1 // Random production time between 1 and 10 days
    })
    .select()
    .single()
  
  if (error) {
    console.error(`Error creating product for subcategory ${subcategoryId}:`, error)
    return null
  }
  
  console.log(`Created product ${product.id} for subcategory ${subcategoryName}`)
  return product
}

// Main handler function
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Get available artisans to distribute products among them
    const { data: artisans, error: artisansError } = await supabase
      .from('artisans')
      .select('id')
    
    if (artisansError || !artisans || artisans.length === 0) {
      throw new Error('No artisans found: ' + artisansError?.message)
    }
    
    // Get all subcategories with their parent categories
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('subcategories')
      .select(`
        id,
        name,
        parent_id,
        categories:parent_id (id, name)
      `)
    
    if (subcategoriesError || !subcategories) {
      throw new Error('Failed to fetch subcategories: ' + subcategoriesError?.message)
    }
    
    console.log(`Found ${subcategories.length} subcategories`)
    
    // Create one product for each subcategory
    const results = []
    
    for (const subcategory of subcategories) {
      // Get a random artisan for this product
      const randomArtisanIndex = Math.floor(Math.random() * artisans.length)
      const artisanId = artisans[randomArtisanIndex].id
      
      // Create a product for this subcategory
      const product = await createProduct(
        subcategory.id, 
        subcategory.name, 
        subcategory.parent_id,
        artisanId
      )
      
      if (product) {
        results.push({
          subcategory: subcategory.name,
          productId: product.id,
          title: product.title
        })
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Created ${results.length} products, one for each subcategory`,
        products: results
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in populate-products function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
