
import { SearchFilters } from './types';

export const convertPriceToEuros = (price: number, fromCurrency: string, exchangeRates: any[]): number => {
  if (fromCurrency === 'EUR') return price;
  
  const rate = exchangeRates.find(r => r.currency_code === fromCurrency);
  if (!rate) return price;
  
  // Convert from target currency back to EUR
  return price / rate.rate_against_eur;
};

export const buildWhereClause = (filters: SearchFilters, exchangeRates: any[], currentCurrency: string = 'EUR') => {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.q) {
    conditions.push(`search_vector @@ plainto_tsquery('english', $${paramIndex})`);
    params.push(filters.q);
    paramIndex++;
  }

  if (filters.category && filters.category.length > 0) {
    conditions.push(`category_id = ANY($${paramIndex})`);
    params.push(filters.category);
    paramIndex++;
  }

  if (filters.subcategory && filters.subcategory.length > 0) {
    conditions.push(`subcategory_id = ANY($${paramIndex})`);
    params.push(filters.subcategory);
    paramIndex++;
  }

  if (filters.artisans && filters.artisans.length > 0) {
    conditions.push(`artisan_id = ANY($${paramIndex})`);
    params.push(filters.artisans);
    paramIndex++;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    if (filters.minPrice !== undefined) {
      const minPriceInEur = convertPriceToEuros(filters.minPrice, currentCurrency, exchangeRates);
      conditions.push(`price >= $${paramIndex}`);
      params.push(minPriceInEur);
      paramIndex++;
    }
    
    if (filters.maxPrice !== undefined) {
      const maxPriceInEur = convertPriceToEuros(filters.maxPrice, currentCurrency, exchangeRates);
      conditions.push(`price <= $${paramIndex}`);
      params.push(maxPriceInEur);
      paramIndex++;
    }
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
};

// Client-side filtering functions for products
export const filterProducts = (products: any[], filters: SearchFilters) => {
  return products.filter(product => {
    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(product.category_id)) {
        return false;
      }
    }

    // Subcategory filter
    if (filters.subcategory && filters.subcategory.length > 0) {
      if (!filters.subcategory.includes(product.subcategory_id)) {
        return false;
      }
    }

    // Artisan filter
    if (filters.artisans && filters.artisans.length > 0) {
      if (!filters.artisans.includes(product.artisan_id)) {
        return false;
      }
    }

    // Price filter (assuming prices are in EUR in database)
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    return true;
  });
};

// Client-side sorting function for products
export const sortProducts = (products: any[], sort?: string) => {
  if (!sort) return products;

  const sortedProducts = [...products];

  switch (sort) {
    case 'price_asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name_asc':
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    case 'name_desc':
      return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    case 'rating_desc':
      return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'created_desc':
    default:
      return sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
};
