
import { Product, ProductVariation } from "@/models/types";
import { Database } from "@/integrations/supabase/types";

// Type for products as they come from the database
export type DatabaseProduct = Database['public']['Tables']['products']['Row'] & {
  product_variations?: Database['public']['Tables']['product_variations']['Row'][];
  artisan?: Database['public']['Tables']['artisans']['Row'];
  category?: Database['public']['Tables']['categories']['Row'];
};

// Convert a database product to our application Product interface
export function mapDatabaseProductToProduct(dbProduct: DatabaseProduct): Product {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description || '',
    price: dbProduct.price,
    discountPrice: dbProduct.discount_price || undefined,
    category: dbProduct.category?.name || '',
    tags: dbProduct.tags || [],
    images: dbProduct.images || [],
    variations: dbProduct.product_variations?.map(v => ({
      id: v.id,
      name: v.name,
      options: v.options
    })) || [],
    stock: dbProduct.stock,
    artisanId: dbProduct.artisan_id,
    rating: dbProduct.rating || 0,
    reviewCount: dbProduct.review_count || 0,
    featured: dbProduct.featured || false,
    createdAt: new Date(dbProduct.created_at),
    material: dbProduct.material || undefined,
    origin: dbProduct.origin || undefined
  };
}

// Convert an array of database products to our application Product array
export function mapDatabaseProductsToProducts(dbProducts: DatabaseProduct[]): Product[] {
  return dbProducts.map(mapDatabaseProductToProduct);
}
