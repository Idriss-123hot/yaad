
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/ProductCard';
import { SAMPLE_PRODUCTS } from '@/models/types';

export function FeaturedProducts() {
  const featuredProducts = SAMPLE_PRODUCTS.filter(product => product.featured);

  return (
    <section className="py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
              Featured Collection
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Exceptional Craftsmanship</h2>
          </div>
          <Button variant="link" className="text-terracotta-600 hover:text-terracotta-700 p-0 hidden md:flex">
            View All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} className="hover-lift" />
          ))}
        </div>

        {/* Mobile View All button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="border-terracotta-200 hover:bg-terracotta-50">
            View All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
