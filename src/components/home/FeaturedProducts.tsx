
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/ProductCard';
import { Link } from 'react-router-dom';

// Updated product data with real images
const FEATURED_PRODUCTS = [
  {
    id: '1',
    title: 'Handmade Ceramic Vase',
    description: 'A beautiful handcrafted ceramic vase with natural glaze finish.',
    price: 89.99,
    category: 'Ceramics & Pottery',
    tags: ['vase', 'ceramics', 'home decor'],
    images: ['https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//small-terracotta-ceramic-vase-handmade-in-morocco.jpeg'],
    stock: 5,
    artisanId: '1',
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    createdAt: new Date('2023-09-15')
  },
  {
    id: '2',
    title: 'Hand-woven Wool Blanket',
    description: 'Luxurious hand-woven wool blanket using traditional techniques.',
    price: 149.99,
    category: 'Textiles & Fabrics',
    tags: ['blanket', 'wool', 'handwoven'],
    images: ['https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//berber-plaid-with-white-pompoms-and-pink-stripes.jpeg'],
    stock: 3,
    artisanId: '2',
    rating: 4.9,
    reviewCount: 18,
    featured: true,
    createdAt: new Date('2023-10-01')
  },
  {
    id: '3',
    title: 'Handcrafted Wooden Serving Board',
    description: 'Elegant serving board made from sustainable hardwood.',
    price: 59.99,
    discountPrice: 49.99,
    category: 'Woodworking',
    tags: ['kitchen', 'serving', 'wood'],
    images: ['https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//wooden-oval-cheese-board-with-arabic-patterns-cutting-board-maison-bagan-281478.webp'],
    stock: 8,
    artisanId: '3',
    rating: 4.7,
    reviewCount: 32,
    featured: true,
    createdAt: new Date('2023-08-22')
  },
  {
    id: '4',
    title: 'Artisanal Silver Earrings',
    description: 'Delicate silver earrings handcrafted by skilled artisans.',
    price: 79.99,
    category: 'Jewelry',
    tags: ['earrings', 'silver', 'accessories'],
    images: ['https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//boucles-doreilles-oufla-boucles-doreilles-417821_1024x1024@2x.jpeg'],
    stock: 12,
    artisanId: '4',
    rating: 4.9,
    reviewCount: 41,
    featured: true,
    createdAt: new Date('2023-10-10')
  }
];

export function FeaturedProducts() {
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
            <Link to="/search">View All Products <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} className="hover-lift" />
          ))}
        </div>

        {/* Mobile View All button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="border-terracotta-200 hover:bg-terracotta-50">
            <Link to="/search">View All Products <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
