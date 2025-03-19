
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CategoryNavigation } from '@/components/layout/CategoryNavigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-12',
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
              Categories
            </button>
            <Link to="/artisans" className="text-sm font-medium hover:text-terracotta-600 transition-colors">
              Artisans
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-terracotta-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-terracotta-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-terracotta-100">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative hover:bg-terracotta-100">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta-600 text-white rounded-full text-[10px] flex items-center justify-center">
                0
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="relative hover:bg-terracotta-100">
              <User className="h-5 w-5" />
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
                Categories
              </button>
              <Link 
                to="/artisans" 
                className="text-sm font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Artisans
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium hover:text-terracotta-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex items-center space-x-4 pt-2">
                <Button variant="ghost" size="icon" className="relative hover:bg-terracotta-100">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="relative hover:bg-terracotta-100">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta-600 text-white rounded-full text-[10px] flex items-center justify-center">
                    0
                  </span>
                </Button>
                <Button variant="ghost" size="icon" className="relative hover:bg-terracotta-100">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
