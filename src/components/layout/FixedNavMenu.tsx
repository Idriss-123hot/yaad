
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronUp, ShoppingBag, Home, User, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

export function FixedNavMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const cartCount = getCartCount();
  const favoriteCount = wishlistItems.length;

  // Afficher le menu fixe après un certain défilement
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour faire défiler vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white shadow-md transition-transform duration-300 z-40",
        {
          "translate-y-0": isVisible,
          "translate-y-full": !isVisible,
        }
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <RouterLink to="/" className="flex flex-col items-center text-muted-foreground hover:text-terracotta-600 transition-colors">
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Accueil</span>
          </RouterLink>
          
          <RouterLink to="/search" className="flex flex-col items-center text-muted-foreground hover:text-terracotta-600 transition-colors">
            <Search className="h-5 w-5 mb-1" />
            <span className="text-xs">Recherche</span>
          </RouterLink>
          
          <RouterLink to="/favorites" className="flex flex-col items-center text-muted-foreground hover:text-terracotta-600 transition-colors">
            <div className="relative">
              <Heart className="h-5 w-5 mb-1" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta-600 text-white rounded-full text-[8px] flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </div>
            <span className="text-xs">Favoris</span>
          </RouterLink>
          
          <RouterLink to="/cart" className="flex flex-col items-center text-muted-foreground hover:text-terracotta-600 transition-colors">
            <div className="relative">
              <ShoppingBag className="h-5 w-5 mb-1" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta-600 text-white rounded-full text-[8px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs">Panier</span>
          </RouterLink>
          
          <RouterLink to="/auth" className="flex flex-col items-center text-muted-foreground hover:text-terracotta-600 transition-colors">
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Compte</span>
          </RouterLink>
          
          <button 
            onClick={scrollToTop}
            className="flex flex-col items-center text-muted-foreground hover:text-terracotta-600 transition-colors"
          >
            <ChevronUp className="h-5 w-5 mb-1" />
            <span className="text-xs">Haut</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FixedNavMenu;
