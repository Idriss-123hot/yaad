
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6'
import { corsHeaders } from '../_shared/cors.ts'
import { Database } from '../_shared/types.ts'

/**
 * Variables d'environnement pour la connexion à Supabase
 */
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

/**
 * Fonction Edge pour la recherche de produits et d'artisans
 * 
 * Permet de rechercher des produits et artisans dans la base de données
 * en fonction d'un terme de recherche et d'un type de contenu.
 */
Deno.serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Création du client Supabase
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
    const url = new URL(req.url)
    
    // Récupération des paramètres de recherche depuis l'URL
    const searchQuery = url.searchParams.get('q') || ''
    const type = url.searchParams.get('type') || 'all'
    
    // Vérification de la validité du terme de recherche avec limites de sécurité
    if (!searchQuery || searchQuery.length < 2 || searchQuery.length > 100) {
      return new Response(
        JSON.stringify({ products: [], artisans: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }
    
    // Sanitize search query to prevent injection
    const sanitizedQuery = searchQuery.replace(/[%_\\]/g, '\\$&').trim();

    const results: { products?: any[], artisans?: any[] } = {}
    
    // Recherche de produits
    if (type === 'all' || type === 'products') {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_variations(*),
          artisan:artisans(*),
          category:categories(*)
        `)
        .textSearch('search_vector', searchQuery)  // Recherche textuelle
        .limit(type === 'all' ? 4 : 20)  // Limite de résultats selon le type de recherche
      
      if (productsError) throw productsError
      results.products = products
    }
    
    // Recherche d'artisans avec requête sécurisée
    if (type === 'all' || type === 'artisans') {
      const { data: artisans, error: artisansError } = await supabase
        .from('artisans')
        .select('*')
        .or(`name.ilike.%${sanitizedQuery}%,bio.ilike.%${sanitizedQuery}%,location.ilike.%${sanitizedQuery}%`)
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
