// src/services/search/databaseSearch.ts
import { supabase } from '@/integrations/supabase/client';
import { SearchFilters, SearchResults } from './types';
import { ProductWithArtisan, Artisan, Category, ProductImage } from '@/models/types'; // Assurez-vous que ces types sont correctement définis

// Map the result from database to a properly structured product object
// Note: J'ai un peu typé les 'any' pour plus de clarté, mais adaptez selon vos définitions exactes.
interface DatabaseProductItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  discount_price?: number;
  category_id: string;
  subcategory_id?: string; // Le champ de la DB est subcategory_id
  tags?: string[];
  images?: ProductImage[] | string[]; // Adaptez selon la structure réelle
  stock: number;
  artisan_id: string;
  rating?: number;
  review_count?: number;
  featured?: boolean;
  created_at: string; // ou Date
  material?: string;
  origin?: string;
  artisan?: { // Structure de l'objet artisan joint
    id: string;
    name: string;
    bio?: string;
    description?: string;
    location?: string;
    profile_photo?: string;
    first_gallery_images?: string[];
    rating?: number;
    review_count?: number;
    featured?: boolean;
    created_at: string; // ou Date
    website?: string;
  };
  category?: { // Structure de l'objet catégorie joint
    id: string;
    name: string;
  };
  // Ajoutez d'autres champs si nécessaire, comme production_time
  production_time?: number;
}

const mapDatabaseProductsToProducts = (data: DatabaseProductItem[]): ProductWithArtisan[] => {
  return data.map(item => {
    // Create the base product object as a ProductWithArtisan type
    const product: ProductWithArtisan = {
      id: item.id,
      title: item.title,
      description: item.description || '',
      price: item.price,
      discountPrice: item.discount_price,
      category: item.category?.name || '', // Nom de la catégorie via la jointure
      categoryId: item.category_id,       // ID de la catégorie du produit
      subcategory: '', // Ce champ pourrait être rempli si vous joignez aussi les infos de la sous-catégorie (nom, etc.)
      subcategoryId: item.subcategory_id, // ID de la sous-catégorie du produit (avec I majuscule dans le modèle JS)
      tags: item.tags || [],
      images: (item.images as ProductImage[]) || [], // Assurez-vous du bon type ici
      stock: item.stock,
      artisanId: item.artisan_id,         // ID de l'artisan du produit (avec I majuscule dans le modèle JS)
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      featured: item.featured || false,
      createdAt: new Date(item.created_at),
      material: item.material,
      origin: item.origin,
      // productionTime: item.production_time, // Si vous avez ce champ sur ProductWithArtisan
    };

    // Add artisan details if available from the join
    if (item.artisan) {
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
        productCount: 0, // Ce champ n'est pas dans la query, à calculer autrement si besoin
        featured: item.artisan.featured || false,
        joinedDate: new Date(item.artisan.created_at), // Assurez-vous que c'est bien created_at ou 'joined_date'
        website: item.artisan.website || ''
      };
    }

    return product;
  });
};

export const searchProductsWithDatabase = async (filters: SearchFilters): Promise<SearchResults> => {
  try {
    const { q, category, subcategory, minPrice, maxPrice, rating, delivery, artisans, sort, page = 1, limit = 20 } = filters;

    // For products, get only specific fields from artisans to avoid recursion
    // J'ai ajouté 'subcategory_id' explicitement dans le select principal pour être sûr,
    // même si '*' devrait le prendre. Également 'production_time' si utilisé pour 'delivery'.
    let query = supabase.from('products').select(`
      id, title, description, price, discount_price, category_id, subcategory_id, 
      tags, images, stock, artisan_id, rating, review_count, featured, created_at, 
      material, origin, production_time,
      artisan:artisan_id (
        id, name, profile_photo, location, rating, bio, created_at, description,
        featured, first_gallery_images, website, review_count 
      ),
      category:category_id (
        id, name
      )
    `, { count: 'exact' });

    // Filter by search query (q) - recherche textuelle simple sur title et description
    // Adaptez ceci si vous avez une recherche plein texte plus avancée configurée dans Supabase
    if (q && q.trim() !== '') {
        // Vous pouvez utiliser .or() pour chercher dans plusieurs champs
        // Exemple: .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        // Pour une recherche textuelle plus avancée, considérez `to_tsvector` et `to_tsquery` (nécessite une configuration DB)
        query = query.ilike('title', `%${q}%`); // Simple ILIKE pour l'exemple
    }

    if (category && category.length > 0) {
      // Supabase .in() attend un tableau de valeurs.
      // Si 'category' peut être une string unique ou un tableau, assurez-vous de passer un tableau.
      // Pour le moment, on suppose que category est string[] comme les autres.
      query = query.in('category_id', category);
    }

    // ------------ FIX ICI ------------
    if (subcategory && Array.isArray(subcategory) && subcategory.length > 0) {
      query = query.in('subcategory_id', subcategory);
    }
    // -------------------------------

    if (artisans && Array.isArray(artisans) && artisans.length > 0) {
      query = query.in('artisan_id', artisans);
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    if (rating !== undefined && rating > 0) { // souvent on filtre pour des ratings > X
      query = query.gte('rating', rating);
    }

    if (delivery) { // Assurez-vous que votre table 'products' a un champ 'production_time' (ou similaire)
      switch (delivery) {
        case 'express': // Moins de 3 jours (exemple)
          query = query.lte('production_time', 3);
          break;
        case 'standard': // Entre 3 et 7 jours (exemple)
          query = query.gt('production_time', 3).lte('production_time', 7);
          break;
        case 'economy': // Plus de 7 jours (exemple)
          query = query.gt('production_time', 7);
          break;
      }
    }

    if (sort) {
      switch (sort) {
        case 'price_asc': // Renommé pour clarté par rapport à l'UI
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc': // Renommé pour clarté
          query = query.order('price', { ascending: false });
          break;
        case 'created_desc': // Renommé pour clarté
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating_desc': // Renommé pour clarté
          query = query.order('rating', { ascending: false, nullsFirst: false }); // nullsFirst peut être utile
          break;
        default: // Par défaut, peut-être par 'featured' puis 'created_at' ou un score de pertinence
          query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
      }
    } else {
      // Tri par défaut si 'sort' n'est pas fourni
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
    }

    // Pagination
    query = query.range((page - 1) * limit, (page * limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    return {
      products: data ? mapDatabaseProductsToProducts(data as DatabaseProductItem[]) : [],
      total: count || 0
    };
  } catch (error) {
    console.error("Error in database search:", error);
    // Pour éviter de crasher l'app, on peut retourner un résultat vide en cas d'erreur
    // ou laisser l'erreur remonter pour être gérée plus haut.
    // throw error; // Laisse remonter l'erreur
    return { products: [], total: 0 }; // Retourne un résultat vide
  }
};
