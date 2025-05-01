import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CategoryNavigation } from '@/components/layout/CategoryNavigation';
import { SearchModal } from '@/components/search/SearchModal';
import { LanguageSelector } from '@/components/layout/LanguageSelector'; 
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const favoriteCount = wishlistItems.length;
  const cartCount = getCartCount();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const toggleCategoryMenu = () => {
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  const toggleSearchModal = () => {
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    setIsSearchModalOpen(!isSearchModalOpen);
  };

  const toggleMobileMenu = () => {
    // Close category menu if open when toggling mobile menu
    if (isCategoryMenuOpen && !isMobileMenuOpen) {
      setIsCategoryMenuOpen(false);
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/cart');
  };

  const handleFavoritesClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/favorites');
  };

  const handleAuthClick = () => {
    setIsMobileMenuOpen(false);
    if (session) {
      // If logged in, show user menu or profile page
      // For now, just sign out
      supabase.auth.signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-3 px-6 md:px-12',
        {
          'bg-background/90 backdrop-blur-md shadow-sm': isScrolled || isCategoryMenuOpen || isMobileMenuOpen,
          'bg-transparent': !isScrolled && !isCategoryMenuOpen && !isMobileMenuOpen,
        }
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-serif text-2xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            yaad<span className="text-terracotta-600">.com</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              className="text-sm font-medium hover:text-terracotta-600 transition-colors"
              onClick={toggleCategoryMenu}
            >
              Nos Produits
            </button>
            <Link to="/artisans" className="text-sm font-medium hover:text-terracotta-600 transition-colors">
              Nos Artisans
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-terracotta-600 transition-colors">
              À propos
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-terracotta-600 transition-colors">
              Blog
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-terracotta-100"
              onClick={toggleSearchModal}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-terracotta-100"
              onClick={handleFavoritesClick}
            >
              <Heart className="h-5 w-5" />
              {favoriteCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta-600 text-white rounded-full text-[10px] flex items-center justify-center">
                  {favoriteCount > 99 ? '99+' : favoriteCount}
                </span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-terracotta-100"
              onClick={handleCartClick}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta-600 text-white rounded-full text-[10px] flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-terracotta-100"
              onClick={handleAuthClick}
            >
              <User className="h-5 w-5" />
              {session && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Category Navigation Menu */}
        {isCategoryMenuOpen && <CategoryNavigation onClose={() => setIsCategoryMenuOpen(false)} />}

        {/* Mobile Menu - Improved with better performance */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background fixed top-[61px] left-0 right-0 bottom-0 z-50 overflow-y-auto animate-in slide-in-from-right">
            <nav className="flex flex-col p-6">
              <button 
                className="flex items-center justify-between w-full py-4 border-b text-lg font-medium hover:text-terracotta-600 transition-colors"
                onClick={toggleCategoryMenu}
              >
                Nos Produits
                <Search className="h-5 w-5" />
              </button>
              <Link 
                to="/artisans" 
                className="py-4 border-b text-lg font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nos Artisans
              </Link>
              <Link 
                to="/about" 
                className="py-4 border-b text-lg font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                À propos
              </Link>
              <Link 
                to="/blog" 
                className="py-4 border-b text-lg font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              
              <div className="mt-6 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <LanguageSelector />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover:bg-terracotta-100"
                    onClick={toggleSearchModal}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleFavoritesClick}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Favoris
                  {favoriteCount > 0 && (
                    <span className="ml-auto bg-terracotta-600 text-white px-2 py-0.5 rounded-full text-xs">
                      {favoriteCount}
                    </span>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCartClick}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Panier
                  {cartCount > 0 && (
                    <span className="ml-auto bg-terracotta-600 text-white px-2 py-0.5 rounded-full text-xs">
                      {cartCount}
                    </span>
                  )}
                </Button>
                
                <Button 
                  variant={session ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={handleAuthClick}
                >
                  <User className="h-5 w-5 mr-2" />
                  {session ? 'Mon Compte' : 'Connexion'}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      )}
    </header>
  );
}

export default Navbar;
