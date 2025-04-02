
import { Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

export default function Favorites() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-terracotta-600" />
            Mes Favoris
          </h1>
          <p className="text-muted-foreground mt-2">
            Articles que vous avez ajoutés à vos favoris
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold mb-2">Connectez-vous pour voir vos favoris</h2>
            <p className="text-muted-foreground mb-8">
              Créez un compte ou connectez-vous pour ajouter des articles à vos favoris
            </p>
            <Button 
              className="bg-terracotta-600 hover:bg-terracotta-700"
              onClick={() => window.location.href = '/auth'}
            >
              Se connecter
            </Button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold mb-2">Vous n'avez pas encore de favoris</h2>
            <p className="text-muted-foreground mb-8">
              Explorez notre collection et ajoutez des articles à vos favoris
            </p>
            <Button 
              className="bg-terracotta-600 hover:bg-terracotta-700"
              onClick={() => window.location.href = '/categories'}
            >
              Explorer les produits
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => item.product && (
              <div key={item.productId} className="relative group">
                <ProductCard product={item.product} />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white hover:bg-gray-100 z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromWishlist(item.productId);
                  }}
                >
                  <Heart className="h-5 w-5 fill-terracotta-600 text-terracotta-600" />
                  <span className="sr-only">Retirer des favoris</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
