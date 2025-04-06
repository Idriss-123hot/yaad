
import { SearchFilters, SearchResults } from './types';
import { Product } from '@/models/types';
import { mapDatabaseProductsToProducts } from '@/utils/productMappers';
import { filterProducts, sortProducts } from './filterUtils';

export const searchProductsWithEdgeFunction = async (filters: SearchFilters): Promise<SearchResults> => {
  try {
    const { q, page = 1, limit = 20 } = filters;
    
    const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search`);
    
    if (q) url.searchParams.append('q', q);
    url.searchParams.append('type', 'products');
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();
    let products = data.products || [];
    
    // Apply client-side filtering and sorting
    products = filterProducts(products, filters);
    products = sortProducts(products, filters.sort);
    
    // Handle pagination
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);
    
    return { 
      products: paginatedProducts.map(p => mapDatabaseProductsToProducts([p])[0]), 
      total: products.length 
    };
  } catch (error) {
    console.error("Error in edge function search:", error);
    throw error;
  }
};
