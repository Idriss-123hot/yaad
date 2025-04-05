
import { Product, ProductVariation } from "@/models/types";
import { Database } from "@/integrations/supabase/types";

// Type for products as they come from the database
export type DatabaseProduct = Database['public']['Tables']['products']['Row'] & {
  product_variations?: Database['public']['Tables']['product_variations']['Row'][];
  artisan?: Database['public']['Tables']['artisans']['Row'];
  category?: Database['public']['Tables']['categories']['Row'];
  categories?: Database['public']['Tables']['categories']['Row'];
  subcategory?: Database['public']['Tables']['subcategories']['Row'];
};

// Convert a database product to our application Product interface
export function mapDatabaseProductToProduct(dbProduct: DatabaseProduct): Product {
  // Determine which field to use for category
  const categoryData = dbProduct.categories || dbProduct.category;
  const categoryName = categoryData?.name || '';
  
  // Extract subcategory data if available
  const subcategoryName = dbProduct.subcategory?.name || '';
  
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description || '',
    price: dbProduct.price,
    discountPrice: dbProduct.discount_price || undefined,
    category: categoryName,
    subcategory: subcategoryName,
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
    origin: dbProduct.origin || undefined,
    categoryId: categoryData?.id,
    subcategoryId: dbProduct.subcategory_id || dbProduct.subcategory?.id
  };
}

// Convert an array of database products to our application Product array
export function mapDatabaseProductsToProducts(dbProducts: DatabaseProduct[]): Product[] {
  return dbProducts.map(mapDatabaseProductToProduct);
}
