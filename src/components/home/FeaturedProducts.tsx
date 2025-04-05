
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/ProductCard';
import { Link } from 'react-router-dom';
import { useTranslations } from '@/lib/i18n';

// Données des produits mis en avant avec IDs uniques et routes correctes
const FEATURED_PRODUCTS = [
  {
    id: 'ceramic-vase',
    title: 'Handmade Ceramic Vase',
    description: 'A beautiful handcrafted ceramic vase with natural glaze finish.',
    price: 89.99,
    category: 'Ceramics & Pottery',
    subcategory: 'Vases', // Added missing subcategory property
    tags: ['vase', 'ceramics', 'home decor'],
    images: [
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/grand-vase-girafe-du-maroc-artisanal-fait-main-elegant-design-trip%202.jpeg',
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/grand-vase-girafe-du-maroc-artisanal-fait-main-elegant-design-trip%203.jpeg',
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/grand-vase-girafe-du-maroc-artisanal-fait-main-elegant-design-trip.jpeg'
    ],
    stock: 5,
    artisanId: '1',
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    createdAt: new Date('2023-09-15'),
    mainCategory: 'ceramics-pottery' // Added mainCategory field
  },
  {
    id: 'wool-blanket',
    title: 'Hand-woven Wool Blanket',
    description: 'Luxurious hand-woven wool blanket using traditional techniques.',
    price: 149.99,
    category: 'Textiles & Fabrics',
    subcategory: 'Blankets', // Added missing subcategory property
    tags: ['blanket', 'wool', 'handwoven'],
    images: [
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/Hand-woven%20Wool%20Blanket%201.jpeg',
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/Hand-woven%20Wool%20Blanket%20%202.jpeg',
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/Hand-woven%20Wool%20Blanket%20%203.jpeg'
    ],
    stock: 3,
    artisanId: '2',
    rating: 4.9,
    reviewCount: 18,
    featured: true,
    createdAt: new Date('2023-10-01'),
    mainCategory: 'textiles-fabrics' // Added mainCategory field
  },
  {
    id: 'wooden-serving-board',
    title: 'Handcrafted Wooden Serving Board',
    description: 'Elegant serving board made from sustainable hardwood.',
    price: 59.99,
    discountPrice: 49.99,
    category: 'Woodworking',
    subcategory: 'Serving Boards', // Added missing subcategory property
    tags: ['kitchen', 'serving', 'wood'],
    images: [
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/wooden-oval-cheese-board-with-arabic-patterns-cutting-board-maison-bagan-281478.webp',
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/wooden-oval-cheese-board-with-arabic-patterns-cutting-board-maison-bagan-796823_1800x1800%202.webp',
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/wooden-oval-cheese-board-with-arabic-patterns-cutting-board-maison-bagan-819467_1800x1800%203.webp'
    ],
    stock: 8,
    artisanId: '7', // Amina Chaoui
    rating: 4.7,
    reviewCount: 32,
    featured: true,
    createdAt: new Date('2023-08-22'),
    mainCategory: 'woodworking' // Added mainCategory field
  },
  {
    id: 'silver-earrings',
    title: 'Artisanal Silver Earrings',
    description: 'Delicate silver earrings handcrafted by skilled artisans.',
    price: 79.99,
    category: 'Jewelry',
    subcategory: 'Earrings', // Added missing subcategory property
    tags: ['earrings', 'silver', 'accessories'],
    images: [
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Women/boucles-d-oreilles-berbere-touareg%201.jpeg',
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Women/boucles-d-oreilles-berbere-touareg%202.jpeg',
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Women/boucles-d-oreilles-berbere-touareg%203.jpeg'
    ],
    stock: 12,
    artisanId: '8', // Mohammed Idrissi
    rating: 4.9,
    reviewCount: 41,
    featured: true,
    createdAt: new Date('2023-10-10'),
    mainCategory: 'jewelry' // Added mainCategory field
  }
];

// Code exporté pour être réutilisé dans les pages produits
export { FEATURED_PRODUCTS };

export function FeaturedProducts() {
  const { t } = useTranslations();
  
  return (
    <section className="py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
              {t('featured_collection', 'Collection en Vedette')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Savoir-Faire Exceptionnel</h2>
          </div>
          <Button variant="link" className="text-terracotta-600 hover:text-terracotta-700 p-0 hidden md:flex">
            <Link to="/search">{t('view_all_products', 'Voir tous les produits')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
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
            <Link to="/search">{t('view_all_products', 'Voir tous les produits')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
