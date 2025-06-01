// src/services/search/filterUtils.ts

import { ProductWithArtisan } from '@/models/types'; // Assurez-vous que ce chemin et ce type sont corrects
import { SearchFilters, SortOption } from './types'; // Assurez-vous que ces types sont corrects

/**
 * Filters an array of products based on the provided filter criteria.
 * This function is intended for client-side filtering if needed after an initial fetch.
 */
export const filterProducts = (
  products: ProductWithArtisan[],
  filters: Partial<SearchFilters> // Partial car tous les filtres ne sont pas forcément actifs
): ProductWithArtisan[] => {
  if (!products || products.length === 0) {
    return [];
  }

  return products.filter(product => {
    // Filter by Category ID
    // filters.category est un tableau d'IDs de catégorie (string[])
    // product.categoryId est l'ID de la catégorie du produit (string)
    if (filters.category && filters.category.length > 0) {
      if (!product.categoryId || !filters.category.includes(product.categoryId)) {
        return false;
      }
    }

    // Filter by Subcategory ID - CORRECTED
    // filters.subcategory est un tableau d'IDs de sous-catégorie (string[])
    // product.subcategoryId est l'ID de la sous-catégorie du produit (string)
    if (filters.subcategory && filters.subcategory.length > 0) {
      if (!product.subcategoryId || !filters.subcategory.includes(product.subcategoryId)) {
        return false;
      }
    }

    // Filter by Artisan ID - CORRECTED
    // filters.artisans est un tableau d'IDs d'artisans (string[])
    // product.artisanId est l'ID de l'artisan du produit (string)
    if (filters.artisans && filters.artisans.length > 0) {
      if (!product.artisanId || !filters.artisans.includes(product.artisanId)) {
        return false;
      }
    }

    // Price range filter (client-side, en EUR si les prix sont stockés en EUR)
    // Assurez-vous que filters.minPrice et filters.maxPrice sont dans la même devise que product.price
    const priceToCompare = product.discountPrice ?? product.price;
    if (filters.minPrice !== undefined && priceToCompare < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && priceToCompare > filters.maxPrice) {
      return false;
    }

    // Rating filter
    if (filters.rating !== undefined && (product.rating === undefined || product.rating < filters.rating)) {
      return false;
    }
    
    // TODO: Ajoutez ici d'autres filtres client si nécessaire (ex: delivery, tags spécifiques si non gérés côté serveur)
    // Exemple pour le filtre 'delivery' (si cela doit être filtré côté client aussi)
    // Ce filtre est déjà géré côté serveur dans databaseSearch pour 'production_time',
    // donc il est peu probable que vous en ayez besoin ici, sauf si edgeSearch ne le fait pas.
    // if (filters.delivery) {
    //   let passesDeliveryFilter = false;
    //   const productionTime = product.productionTime; // Assurez-vous que ProductWithArtisan a ce champ
    //   if (productionTime !== undefined) {
    //       switch (filters.delivery) {
    //           case 'express': passesDeliveryFilter = productionTime <= 3; break;
    //           case 'standard': passesDeliveryFilter = productionTime > 3 && productionTime <= 7; break;
    //           case 'economy': passesDeliveryFilter = productionTime > 7; break;
    //           default: passesDeliveryFilter = true; // ou false si un type inconnu ne passe pas
    //       }
    //   }
    //   if (!passesDeliveryFilter) return false;
    // }


    // If product passes all active filters
    return true;
  });
};

/**
 * Sorts an array of products based on the provided sort option.
 */
export const sortProducts = (
  products: ProductWithArtisan[],
  sort?: SortOption // Ex: 'price_asc', 'price_desc', 'created_desc', 'rating_desc' etc.
): ProductWithArtisan[] => {
  if (!products || products.length === 0 || !sort) {
    return products;
  }

  const sortedProducts = [...products]; // Create a shallow copy to avoid mutating the original array

  switch (sort) {
    case 'price_asc': // Ou 'price-low'
      sortedProducts.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      break;
    case 'price_desc': // Ou 'price-high'
      sortedProducts.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      break;
    case 'created_desc': // Ou 'newest'
      // Assurez-vous que product.createdAt est un objet Date
      sortedProducts.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA; // Plus récent en premier
      });
      break;
    case 'rating_desc': // Ou 'rating'
      sortedProducts.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); // Gérer les undefined ratings
      break;
    case 'alphabetical_asc': // Tri par titre A-Z
       sortedProducts.sort((a,b) => a.title.localeCompare(b.title));
       break;
    case 'alphabetical_desc': // Tri par titre Z-A
       sortedProducts.sort((a,b) => b.title.localeCompare(a.title));
       break;
    // Ajoutez d'autres cas de tri si nécessaire
    // case 'featured_first': // Si vous avez un champ 'featured' et voulez le trier
    //   sortedProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    //   break;
    default:
      // Pas de tri ou option de tri non reconnue, retourne la liste telle quelle
      break;
  }

  return sortedProducts;
};
