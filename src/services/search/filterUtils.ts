
import { SearchFilters } from './types';

export const filterProducts = (products: any[], filters: SearchFilters) => {
  if (!products || products.length === 0) return [];
  
  const { category, subcategory, minPrice, maxPrice, rating, delivery, artisans, priceRange } = filters;
  
  return products.filter(product => {
    // Filter by category (if array is provided)
    if (category && category.length > 0) {
      const categoryMatches = category.some(cat => 
        product.category_id === cat || 
        (product.category && product.category.id === cat)
      );
      if (!categoryMatches) return false;
    }
    
    // Filter by subcategory (if array is provided)
    if (subcategory && subcategory.length > 0) {
      const subcategoryMatches = subcategory.some(subcat => 
        product.subcategory_id === subcat
      );
      if (!subcategoryMatches) return false;
    }
    
    // Filter by artisan (if array is provided)
    if (artisans && artisans.length > 0) {
      const artisanMatches = artisans.some(artisanId => 
        product.artisan_id === artisanId ||
        (product.artisan && product.artisan.id === artisanId)
      );
      if (!artisanMatches) return false;
    }
    
    // Filter by price range
    const productPrice = product.discountPrice || product.price;
    if (minPrice !== undefined && productPrice < minPrice) {
      return false;
    }
    
    if (maxPrice !== undefined && productPrice > maxPrice) {
      return false;
    }
    
    // Filter by price range array if provided
    if (priceRange && priceRange.length === 2) {
      const [minPriceRange, maxPriceRange] = priceRange;
      if (productPrice < minPriceRange || productPrice > maxPriceRange) {
        return false;
      }
    }
    
    // Filter by rating
    if (rating !== undefined && product.rating < rating) {
      return false;
    }
    
    // Filter by delivery time
    if (delivery) {
      if (delivery === 'express' && product.production_time > 3) {
        return false;
      } else if (delivery === 'standard' && (product.production_time <= 3 || product.production_time > 7)) {
        return false;
      } else if (delivery === 'economy' && product.production_time <= 7) {
        return false;
      }
    }
    
    return true;
  });
};

export const sortProducts = (products: any[], sort?: string) => {
  if (!sort || !products || products.length === 0) return products;
  
  const sortedProducts = [...products];
  
  console.log(`Sorting products by: ${sort}`);
  
  switch (sort) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      });
      
    case 'price-desc':
      return sortedProducts.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      });
      
    case 'newest':
      return sortedProducts.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      
    case 'rating':
      return sortedProducts.sort((a, b) => b.rating - a.rating);
      
    case 'featured':
      return sortedProducts.sort((a, b) => {
        // Sort by featured flag first (true comes first)
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        // Then by rating as secondary sort
        return b.rating - a.rating;
      });
      
    default:
      // Default sorting (featured)
      return sortedProducts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }
};
