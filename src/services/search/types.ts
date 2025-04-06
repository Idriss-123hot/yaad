
import { Product, Artisan } from '@/models/types';

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
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SearchResults {
  products: Product[];
  total: number;
}
