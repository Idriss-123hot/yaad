
import { SearchFilters } from './types';

export const filterProducts = (products: any[], filters: SearchFilters) => {
  const { category, subcategory, minPrice, maxPrice, rating, delivery, artisans } = filters;
  
  return products.filter(product => {
    if (category && category.length > 0 && product.category_id !== category[0]) {
      return false;
    }
    
    if (subcategory && subcategory.length > 0 && product.category_id !== subcategory[0]) {
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

export const sortProducts = (products: any[], sort?: string) => {
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
