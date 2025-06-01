
import { Product, Artisan } from '@/models/types';

export type SortOption = 
  | 'price_asc' 
  | 'price_desc' 
  | 'created_desc' 
  | 'rating_desc' 
  | 'alphabetical_asc' 
  | 'alphabetical_desc' 
  | 'featured';

export interface SearchFilters {
  q?: string;
  category?: string[];
  subcategory?: string[];
  artisans?: string[];
  minPrice?: number;
  maxPrice?: number;
  priceRange?: [number, number];
  rating?: number;
  delivery?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface SearchResults {
  products: Product[];
  total: number;
}
