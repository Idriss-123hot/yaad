
import { SearchFilters, SortOption } from './types';

const isValidSortOption = (value: string): value is SortOption => {
  const validOptions: SortOption[] = [
    'price_asc', 
    'price_desc', 
    'created_desc', 
    'rating_desc', 
    'alphabetical_asc', 
    'alphabetical_desc', 
    'featured'
  ];
  return validOptions.includes(value as SortOption);
};

export const getFiltersFromURL = (searchParams: URLSearchParams): SearchFilters => {
  // Get query parameter
  const q = searchParams.get('q') || undefined;
  
  // Get category parameters (can be multiple)
  const category = searchParams.getAll('category');
  
  // Get subcategory parameters (can be multiple)
  const subcategory = searchParams.getAll('subcategory');
  
  // Get artisan parameters (can be multiple)
  const artisans = searchParams.getAll('artisan');
  
  // Get price range
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') as string) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') as string) : undefined;
  
  // Get rating filter
  const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating') as string) : undefined;
  
  // Get delivery option
  const delivery = searchParams.get('delivery') || undefined;
  
  // Get sorting option with validation
  const sortParam = searchParams.get('sort');
  const sort = sortParam && isValidSortOption(sortParam) ? sortParam : undefined;
  
  // Get page number
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  
  return {
    q,
    category: category.length > 0 ? category : undefined,
    subcategory: subcategory.length > 0 ? subcategory : undefined,
    artisans: artisans.length > 0 ? artisans : undefined,
    minPrice,
    maxPrice,
    rating,
    delivery,
    sort,
    page,
  };
};

export const filtersToURLParams = (filters: SearchFilters): URLSearchParams => {
  const params = new URLSearchParams();
  
  // Add query parameter
  if (filters.q) params.set('q', filters.q);
  
  // Add category parameters (multiple values)
  if (filters.category && filters.category.length > 0) {
    filters.category.forEach(cat => params.append('category', cat));
  }
  
  // Add subcategory parameters (multiple values)
  if (filters.subcategory && filters.subcategory.length > 0) {
    filters.subcategory.forEach(subcat => params.append('subcategory', subcat));
  }
  
  // Add artisan parameters (multiple values)
  if (filters.artisans && filters.artisans.length > 0) {
    filters.artisans.forEach(artisan => params.append('artisan', artisan));
  }
  
  // Add price range parameters
  if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
  
  // Add rating filter
  if (filters.rating !== undefined) params.set('rating', filters.rating.toString());
  
  // Add delivery option
  if (filters.delivery) params.set('delivery', filters.delivery);
  
  // Add sorting option
  if (filters.sort) params.set('sort', filters.sort);
  
  // Add page number
  if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
  
  return params;
};
