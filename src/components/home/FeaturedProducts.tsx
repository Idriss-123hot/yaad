
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/ProductCard';
import { Link } from 'react-router-dom';

// Données des produits vedettes avec traductions
export const FEATURED_PRODUCTS = [
  {
    id: 'vase-céramique',
    title: 'Vase en Céramique Artisanal',
    description: 'Vase traditionnel marocain avec finition émaillée naturelle',
    price: 89.99,
    category: 'Céramique',
    images: [
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//grand-vase-girafe-du-maroc-artisanal-fait-main-elegant-design-trip.jpeg',
    ],
    artisanId: '1',
    rating: 4.8,
  },
  {
    id: 'couverture-laine',
    title: 'Couverture en Laine Tissée Main',
    description: 'Laine premium tissée selon des méthodes ancestrales',
    price: 149.99,
    category: 'Textile',
    images: [
      'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Hand-woven%20Wool%20Blanket%201.jpeg',
    ],
    artisanId: '2',
    rating: 4.9,
  },
  // ... autres produits
];

export function FeaturedProducts() {
  return (
    <section className="py-16 px-6 md:px-12 bg-terracotta-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
              Sélection d'Exception
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Nos Créations Phares</h2>
          </div>
          
          {/* Bouton desktop */}
          <Button 
            variant="link" 
            className="text-terracotta-600 hover:text-terracotta-700 p-0 hidden md:flex"
            asChild
          >
            <Link to="/search">
              Tout explorer <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              className="bg-white hover:shadow-lg transition-all"
            />
          ))}
        </div>

        {/* Bouton mobile */}
        <div className="mt-8 flex justify-center md:hidden">
          <Button 
            variant="outline" 
            className="border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50"
            asChild
          >
            <Link to="/search">
              Voir toute la collection <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
