
import { Product, Artisan } from '@/models/types';

export interface SearchFilters {
  q?: string;
  category?: string[];
  subcategory?: string[];
  artisans?: string[];
  minPrice?: number;
  maxPrice?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  delivery?: string;
  stock?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SearchResults {
  products: Product[];
  total: number;
}
