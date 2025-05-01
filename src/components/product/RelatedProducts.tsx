
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ui/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';
import { ProductWithArtisan } from '@/models/types';
import { Loader2 } from 'lucide-react';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
  artisanId?: string;
  maxProducts?: number;
}

export const RelatedProducts = ({
  currentProductId,
  categoryId,
  artisanId,
  maxProducts = 3
}: RelatedProductsProps) => {
  const [products, setProducts] = useState<ProductWithArtisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, categoryId, artisanId]);
  
  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          artisan:artisans(*),
          category:categories(*),
          subcategory:subcategories(*)
        `)
        .neq('id', currentProductId) // Exclude current product
        .limit(maxProducts);
      
      // If we have a category ID, prefer products from the same category
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      // If we have an artisan ID, add a preference for the same artisan
      // but only if we don't already have category filtering
      else if (artisanId) {
        query = query.eq('artisan_id', artisanId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // If we don't have enough products with the same category/artisan,
      // fetch additional random products
      if (data.length < maxProducts) {
        const remainingCount = maxProducts - data.length;
        
        const excludeIds = [currentProductId, ...data.map(p => p.id)];
        
        const { data: additionalData, error: additionalError } = await supabase
          .from('products')
          .select(`
            *,
            artisan:artisans(*),
            category:categories(*),
            subcategory:subcategories(*)
          `)
          .not('id', 'in', `(${excludeIds.join(',')})`)
          .order('featured', { ascending: false })
          .limit(remainingCount);
          
        if (!additionalError && additionalData) {
          data.push(...additionalData);
        }
      }
      
      // Map database products to our product model
      const mappedProducts = data.map(mapDatabaseProductToProduct);
      setProducts(mappedProducts);
    } catch (err: any) {
      console.error('Error fetching related products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-terracotta-600" />
      </div>
    );
  }
  
  if (error) {
    return null; // Don't show error in UI, just hide the section
  }
  
  if (products.length === 0) {
    return null; // No related products to show
  }
  
  return (
    <section className="py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
