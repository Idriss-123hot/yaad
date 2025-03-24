
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CategoryNavigation } from '@/components/layout/CategoryNavigation';
import { SearchModal } from '@/components/search/SearchModal';
import { LanguageSelector } from '@/components/layout/LanguageSelector'; 
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/pages/Cart';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const { getCartCount } = useCart();
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
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleAuthClick = () => {
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
          'bg-background/90 backdrop-blur-md shadow-sm': isScrolled || isCategoryMenuOpen,
          'bg-transparent': !isScrolled && !isCategoryMenuOpen,
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
              About
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Category Navigation Menu */}
        {isCategoryMenuOpen && <CategoryNavigation onClose={() => setIsCategoryMenuOpen(false)} />}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background absolute top-full left-0 right-0 p-6 shadow-lg animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <button 
                className="text-sm font-medium hover:text-terracotta-600 transition-colors text-left"
                onClick={toggleCategoryMenu}
              >
                Nos Produits
              </button>
              <Link 
                to="/artisans" 
                className="text-sm font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nos Artisans
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/blog" 
                className="text-sm font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="flex items-center space-x-4 pt-2">
                <LanguageSelector />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-terracotta-100"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toggleSearchModal();
                  }}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-terracotta-100"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleCartClick();
                  }}
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
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleAuthClick();
                  }}
                >
                  <User className="h-5 w-5" />
                  {session && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
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
