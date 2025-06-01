
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

  if (filters.artisan && filters.artisan.length > 0) {
    conditions.push(`artisan_id = ANY($${paramIndex})`);
    params.push(filters.artisan);
    paramIndex++;
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    if (filters.priceMin !== undefined) {
      const minPriceInEur = convertPriceToEuros(filters.priceMin, currentCurrency, exchangeRates);
      conditions.push(`price >= $${paramIndex}`);
      params.push(minPriceInEur);
      paramIndex++;
    }
    
    if (filters.priceMax !== undefined) {
      const maxPriceInEur = convertPriceToEuros(filters.priceMax, currentCurrency, exchangeRates);
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
