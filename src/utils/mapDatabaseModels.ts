
import { Artisan, Product, ProductWithArtisan } from "@/models/types";
import { Database } from "@/integrations/supabase/types";

// Type for products as they come from the database
export type DatabaseProduct = Database['public']['Tables']['products']['Row'] & {
  product_variations?: Database['public']['Tables']['product_variations']['Row'][];
  artisan?: Database['public']['Tables']['artisans']['Row'];
  category?: Database['public']['Tables']['categories']['Row'];
};

// Map database artisan to our app's Artisan model
export function mapDatabaseArtisanToArtisan(dbArtisan: Database['public']['Tables']['artisans']['Row']): Artisan {
  return {
    id: dbArtisan.id,
    name: dbArtisan.name,
    bio: dbArtisan.bio || '',
    location: dbArtisan.location || '',
    profileImage: dbArtisan.profile_photo || '',
    galleryImages: dbArtisan.gallery_images || [],
    rating: dbArtisan.rating || 0,
    reviewCount: dbArtisan.review_count || 0,
    productCount: 0, // Not directly available from DB, would need separate query
    featured: dbArtisan.featured || false,
    joinedDate: new Date(dbArtisan.joined_date)
  };
}

// Map database product to our app's Product model
export function mapDatabaseProductToProduct(dbProduct: DatabaseProduct): ProductWithArtisan {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description || '',
    price: dbProduct.price,
    discountPrice: dbProduct.discount_price || undefined,
    category: dbProduct.category?.name || '',
    mainCategory: '', // These will be populated if available
    subcategory: '',
    tags: dbProduct.tags || [],
    images: dbProduct.images || [],
    stock: dbProduct.stock,
    artisanId: dbProduct.artisan_id,
    rating: dbProduct.rating || 0,
    reviewCount: dbProduct.review_count || 0,
    featured: dbProduct.featured || false,
    artisan: dbProduct.artisan ? mapDatabaseArtisanToArtisan(dbProduct.artisan) : undefined,
    createdAt: new Date(dbProduct.created_at)
  };
}
