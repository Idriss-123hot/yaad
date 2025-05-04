
import { supabase } from '@/integrations/supabase/client';
import { SearchFilters, SearchResults } from './types';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';

export async function searchProductsWithDatabase(filters: SearchFilters): Promise<SearchResults> {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        artisan:artisans(*),
        category:categories(*),
        subcategory:subcategories(*),
        product_variations(*)
      `);
    
    // Apply category filter
    if (filters.category && filters.category.length > 0) {
      query = query.in('category_id', filters.category);
    }
    
    // Apply subcategory filter
    if (filters.subcategory && filters.subcategory.length > 0) {
      query = query.in('subcategory_id', filters.subcategory);
    }
    
    // Apply price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
      }
      if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
      }
    }
    
    // Apply artisan filter
    if (filters.artisans && filters.artisans.length > 0) {
      query = query.in('artisan_id', filters.artisans);
    }

    // Apply rating filter
    if (filters.rating && filters.rating > 0) {
      query = query.gte('rating', filters.rating);
    }
    
    // Apply stock filter
    if (filters.stock === 'in-stock') {
      query = query.gt('stock', 0);
    }
    
    // Apply limit
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    // Apply page offset
    if (filters.page && filters.limit) {
      const offset = (filters.page - 1) * filters.limit;
      query = query.range(offset, offset + filters.limit - 1);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Transform results to match expected format
    const products = data.map(mapDatabaseProductToProduct);
    
    return {
      products,
      total: products.length // This is approximate; for exact count, use a count() query
    };
  } catch (error) {
    console.error('Database search error:', error);
    throw error;
  }
}
