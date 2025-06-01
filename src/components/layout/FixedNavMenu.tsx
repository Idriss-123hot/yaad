import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronUp, ShoppingBag, Home, User, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
export function FixedNavMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    getCartCount
  } = useCart();
  const {
    wishlistItems
  } = useWishlist();
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
      behavior: 'smooth'
    });
  };
  return <div className={cn("fixed bottom-0 left-0 right-0 bg-white shadow-md transition-transform duration-300 z-40", {
    "translate-y-0": isVisible,
    "translate-y-full": !isVisible
  })}>
      
    </div>;
}
export default FixedNavMenu;