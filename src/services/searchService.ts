import { supabase } from '@/integrations/supabase/client';
import { debounce } from '@/lib/utils';
import { Product, Artisan } from '@/models/types';
import { mapDatabaseProductsToProducts } from '@/utils/productMappers';

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
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const debouncedSearch = debounce(async (filters: SearchFilters) => {
  return await searchProducts(filters);
}, 300);

export const searchProducts = async (filters: SearchFilters): Promise<{ products: Product[], total: number }> => {
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

const searchProductsWithEdgeFunction = async (filters: SearchFilters): Promise<{ products: Product[], total: number }> => {
  try {
    const { q, category, subcategory, minPrice, maxPrice, rating, delivery, artisans, sort, page = 1, limit = 20 } = filters;
    
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
    
    products = filterProductsClientSide(products, filters);
    
    products = sortProducts(products, sort);
    
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

const searchProductsWithDatabase = async (filters: SearchFilters): Promise<{ products: Product[], total: number }> => {
  try {
    const { category, subcategory, minPrice, maxPrice, rating, delivery, artisans, sort, page = 1, limit = 20 } = filters;
    
    let query = supabase.from('products').select(`
      *,
      artisan:artisan_id(*),
      category:category_id(*)
    `, { count: 'exact' });
    
    if (category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('id', category)
        .single();
        
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }
    
    if (subcategory) {
      const { data: subcategoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('id', subcategory)
        .single();
        
      if (subcategoryData) {
        query = query.eq('category_id', subcategoryData.id);
      }
    }
    
    if (artisans && artisans.length > 0) {
      query = query.in('artisan_id', artisans);
    }
    
    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }
    
    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }
    
    if (rating !== undefined) {
      query = query.gte('rating', rating);
    }

    if (delivery) {
      switch (delivery) {
        case 'express':
          query = query.lte('production_time', 3);
          break;
        case 'standard':
          query = query.lte('production_time', 7).gt('production_time', 3);
          break;
        case 'economy':
          query = query.gt('production_time', 7);
          break;
      }
    }
    
    if (sort) {
      switch (sort) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          query = query.order('featured', { ascending: false });
      }
    } else {
      query = query.order('featured', { ascending: false });
    }
    
    query = query.range((page - 1) * limit, (page * limit) - 1);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return { 
      products: data ? mapDatabaseProductsToProducts(data) : [], 
      total: count || 0 
    };
  } catch (error) {
    console.error("Error in database search:", error);
    throw error;
  }
};

const filterProductsClientSide = (products: any[], filters: SearchFilters) => {
  const { category, subcategory, minPrice, maxPrice, rating, delivery, artisans } = filters;
  
  return products.filter(product => {
    if (category && product.category_id !== category) {
      return false;
    }
    
    if (subcategory && product.category_id !== subcategory) {
      return false;
    }
    
    if (minPrice !== undefined && product.price < minPrice) {
      return false;
    }
    
    if (maxPrice !== undefined && product.price > maxPrice) {
      return false;
    }
    
    if (rating !== undefined && product.rating < rating) {
      return false;
    }
    
    if (delivery) {
      if (delivery === 'express' && product.production_time > 3) {
        return false;
      } else if (delivery === 'standard' && (product.production_time <= 3 || product.production_time > 7)) {
        return false;
      } else if (delivery === 'economy' && product.production_time <= 7) {
        return false;
      }
    }
    
    if (artisans && artisans.length > 0 && !artisans.includes(product.artisan_id)) {
      return false;
    }
    
    return true;
  });
};

const sortProducts = (products: any[], sort?: string) => {
  if (!sort) return products;
  
  const sortedProducts = [...products];
  
  switch (sort) {
    case 'price-low':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'newest':
      return sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'rating':
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    default:
      return sortedProducts;
  }
};

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
