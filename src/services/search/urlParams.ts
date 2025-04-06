
import { SearchFilters } from './types';

export const getFiltersFromURL = (searchParams: URLSearchParams): SearchFilters => {
  return {
    q: searchParams.get('q') || undefined,
    category: searchParams.get('category') ? [searchParams.get('category') as string] : undefined,
    subcategory: searchParams.get('subcategory') ? [searchParams.get('subcategory') as string] : undefined,
    artisans: searchParams.get('artisan') ? [searchParams.get('artisan') as string] : undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') as string) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') as string) : undefined,
    rating: searchParams.get('rating') ? parseInt(searchParams.get('rating') as string) : undefined,
    delivery: searchParams.get('delivery') || undefined,
    sort: searchParams.get('sort') || undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1,
  };
};

export const filtersToURLParams = (filters: SearchFilters): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.q) params.set('q', filters.q);
  if (filters.category && filters.category.length > 0) params.set('category', filters.category[0]);
  if (filters.subcategory && filters.subcategory.length > 0) params.set('subcategory', filters.subcategory[0]);
  if (filters.artisans && filters.artisans.length > 0) params.set('artisan', filters.artisans[0]);
  if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
  if (filters.rating !== undefined) params.set('rating', filters.rating.toString());
  if (filters.delivery) params.set('delivery', filters.delivery);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
  
  return params;
};
