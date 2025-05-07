
import { debounce } from '@/lib/utils';
import { SearchFilters, SearchResults } from './types';
import { searchProductsWithEdgeFunction } from './edgeSearch';
import { searchProductsWithDatabase } from './databaseSearch';
import { filterProducts, sortProducts } from './filterUtils';
export { getFiltersFromURL, filtersToURLParams } from './urlParams';
export type { SearchFilters, SearchResults };

/**
 * Debounced search function to prevent rapid consecutive API calls
 */
export const debouncedSearch = debounce(async (filters: SearchFilters) => {
  return await searchProducts(filters);
}, 300);

/**
 * Main search function that decides whether to use the edge function
 * or direct database query based on the search query
 */
export const searchProducts = async (filters: SearchFilters): Promise<SearchResults> => {
  try {
    console.log('Search filters received:', filters);
    
    // Select search method based on query presence and length
    let results;
    if (filters.q && filters.q.length >= 2) {
      results = await searchProductsWithEdgeFunction(filters);
    } else {
      results = await searchProductsWithDatabase(filters);
    }
    
    console.log('Initial search results count:', results.products.length);
    
    // Apply additional client-side filtering and sorting
    let filteredProducts = filterProducts(results.products, filters);
    console.log('After filtering - products count:', filteredProducts.length);
    
    let sortedProducts = sortProducts(filteredProducts, filters.sort);
    console.log('After sorting - final products count:', sortedProducts.length);
    
    return {
      products: sortedProducts,
      total: sortedProducts.length
    };
  } catch (error) {
    console.error("Error in search:", error);
    throw error;
  }
};
