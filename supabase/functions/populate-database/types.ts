
/**
 * Type pour les produits
 * 
 * Définit la structure d'un produit avec ses attributs
 */
export interface Product {
  id: string;
  title: string;  // Titre du produit
  description: string;  // Description du produit
  price: number;  // Prix normal
  discountPrice?: number;  // Prix réduit (optionnel)
  category: string;  // Catégorie du produit
  tags: string[];  // Tags associés au produit
  images: string[];  // Chemins vers les images du produit
  variations?: ProductVariation[];  // Variations du produit (optionnel)
  stock: number;  // Quantité en stock
  artisanId: string;  // ID de l'artisan qui a créé le produit
  rating: number;  // Évaluation moyenne (sur 5)
  reviewCount: number;  // Nombre d'évaluations
  featured?: boolean;  // Produit mis en avant (optionnel)
  createdAt: Date;  // Date de création
  material?: string;  // Matériau principal (optionnel)
  origin?: string;  // Origine du produit (optionnel)
}

/**
 * Type pour les variations de produit
 * 
 * Définit la structure d'une variation de produit (taille, couleur, etc.)
 */
export interface ProductVariation {
  id: string;
  name: string;  // Nom de la variation (ex: "Couleur", "Taille")
  options: string[];  // Options disponibles (ex: ["Rouge", "Bleu"] ou ["S", "M", "L"])
}

/**
 * Type pour les artisans
 * 
 * Définit la structure d'un profil d'artisan
 */
export interface Artisan {
  id: string;
  name: string;  // Nom complet de l'artisan
  bio: string;  // Biographie / description
  location: string;  // Localisation géographique
  profileImage: string;  // Chemin vers la photo de profil
  galleryImages: string[];  // Chemins vers les images de la galerie
  rating: number;  // Évaluation moyenne (sur 5)
  reviewCount: number;  // Nombre d'évaluations
  productCount: number;  // Nombre de produits créés
  featured?: boolean;  // Artisan mis en avant (optionnel)
  joinedDate: Date;  // Date d'inscription
}

/**
 * Type pour les catégories
 * 
 * Définit la structure d'une catégorie de produits
 */
export interface Category {
  id: string;
  name: string;  // Nom de la catégorie
  slug: string;  // Slug pour les URLs
  description?: string;  // Description (optionnel)
  image: string;  // Chemin vers l'image représentant la catégorie
  productCount: number;  // Nombre de produits dans cette catégorie
}
