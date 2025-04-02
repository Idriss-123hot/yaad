
import { Product, ProductWithArtisan, Artisan } from '@/models/types';
import { SAMPLE_ARTISANS } from '@/models/types';

/**
 * Enrichit un produit avec les informations de l'artisan associé
 * @param product - Le produit à enrichir
 * @returns Le produit avec les informations de l'artisan
 */
export const enrichProductWithArtisan = (product: Product): ProductWithArtisan => {
  if (!product.artisanId) {
    return { ...product };
  }

  const artisan = SAMPLE_ARTISANS.find(a => a.id === product.artisanId);
  return {
    ...product,
    artisan: artisan
  };
};

/**
 * Enrichit plusieurs produits avec les informations des artisans
 * @param products - Les produits à enrichir
 * @returns Les produits avec les informations des artisans
 */
export const enrichProductsWithArtisans = (products: Product[]): ProductWithArtisan[] => {
  return products.map(product => enrichProductWithArtisan(product));
};

/**
 * Récupère les produits d'un artisan spécifique
 * @param artisanId - L'identifiant de l'artisan
 * @param products - La liste de tous les produits
 * @returns Les produits de l'artisan
 */
export const getArtisanProducts = (artisanId: string, products: Product[]): ProductWithArtisan[] => {
  const artisanProducts = products.filter(product => product.artisanId === artisanId);
  return enrichProductsWithArtisans(artisanProducts);
};

/**
 * Récupère un artisan par son identifiant
 * @param artisanId - L'identifiant de l'artisan
 * @returns L'artisan ou undefined s'il n'existe pas
 */
export const getArtisanById = (artisanId: string): Artisan | undefined => {
  return SAMPLE_ARTISANS.find(artisan => artisan.id === artisanId);
};
