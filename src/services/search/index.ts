
import { debounce } from '@/lib/utils';
import { SearchFilters, SearchResults } from './types';
import { searchProductsWithEdgeFunction } from './edgeSearch';
import { searchProductsWithDatabase } from './databaseSearch';
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
    if (filters.q && filters.q.length >= 2) {
      return await searchProductsWithEdgeFunction(filters);
    } else {
      return await searchProductsWithDatabase(filters);
    }
  } catch (error) {
    console.error("Error in search:", error);
    throw error;
  }
};
