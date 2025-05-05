import { supabase } from '@/integrations/supabase/client';
import { SearchFilters, SearchResults } from './types';

// Map the result from database to a properly structured product object
const mapDatabaseProductsToProducts = (data: any[]) => {
  return data.map(item => {
    const product = {
      id: item.id,
      title: item.title,
      description: item.description || '',
      price: item.price,
      discountPrice: item.discount_price,
      category: item.category?.name || '',
      categoryId: item.category_id,
      subcategory: '',
      subcategoryId: item.subcategory_id,
      tags: item.tags || [],
      images: item.images || [],
      stock: item.stock,
      artisanId: item.artisan_id,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      featured: item.featured || false,
      createdAt: new Date(item.created_at),
      material: item.material,
      origin: item.origin
    };

    // Add artisan if available
    if (item.artisan) {
      // Create an artisan property on the product object before trying to access it
      product.artisan = {
        id: item.artisan.id,
        name: item.artisan.name,
        bio: item.artisan.bio || '',
        description: item.artisan.description || '',
        location: item.artisan.location || '',
        profileImage: item.artisan.profile_photo || '',
        galleryImages: Array.isArray(item.artisan.first_gallery_images) 
          ? item.artisan.first_gallery_images 
          : [],
        rating: item.artisan.rating || 0,
        reviewCount: item.artisan.review_count || 0,
        productCount: 0,
        featured: item.artisan.featured || false,
        joinedDate: new Date(item.artisan.created_at),
        website: item.artisan.website || ''
      };
    }

    return product;
  });
};

export const searchProductsWithDatabase = async (filters: SearchFilters): Promise<SearchResults> => {
  try {
    const { category, subcategory, minPrice, maxPrice, rating, delivery, artisans, sort, page = 1, limit = 20 } = filters;
    
    // For products, get only specific fields from artisans to avoid recursion
    let query = supabase.from('products').select(`
      *,
      artisan:artisan_id (
        id, name, profile_photo, location, rating, bio, created_at, description, 
        featured, first_gallery_images, joined_date, review_count, website
      ),
      category:category_id (
        id, name
      )
    `, { count: 'exact' });
    
    if (category && category.length > 0) {
      // Use the first category from the array for now
      query = query.eq('category_id', category[0]);
    }
    
    if (subcategory && subcategory.length > 0) {
      // Use the first subcategory from the array
      query = query.eq('category_id', subcategory[0]);
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
