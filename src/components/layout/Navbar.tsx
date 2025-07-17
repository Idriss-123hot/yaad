
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  LogOut,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CategoryNavigation } from './CategoryNavigation';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useTranslations } from '@/lib/i18n';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems } = useCart();
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslations();

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous êtes maintenant déconnecté.",
      });
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Impossible de se déconnecter pour le moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ top: 'var(--admin-banner-height, 0px)' }}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-xl font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors"
          >
            YAAD
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          <CategoryNavigation />
          
          <Link 
            to="/artisans" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('artisans', 'Artisans')}
          </Link>
          
          <Link 
            to="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('about', 'À propos')}
          </Link>
          
          <Link 
            to="/contact" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('contact', 'Contact')}
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="search"
              placeholder={t('search', 'Rechercher...')}
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              size="sm" 
              variant="ghost" 
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <LanguageSelector className="hidden sm:flex" />
          <CurrencySelector className="hidden sm:flex" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hidden sm:flex"
            onClick={() => navigate('/favorites')}
          >
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-terracotta-600 text-xs text-white flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-terracotta-600 text-xs text-white flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t('profile', 'Profil')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('logout', 'Déconnexion')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/auth')}
            >
              <User className="h-5 w-5" />
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="flex items-center justify-between mb-6">
                <Link 
                  to="/" 
                  className="text-xl font-bold text-terracotta-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  YAAD
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <Input
                  type="search"
                  placeholder={t('search', 'Rechercher...')}
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full px-3 py-2"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="space-y-4">
                <CategoryNavigation onClose={() => setIsMenuOpen(false)} />
                
                <Link 
                  to="/artisans" 
                  className="block py-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('artisans', 'Artisans')}
                </Link>
                
                <Link 
                  to="/about" 
                  className="block py-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('about', 'À propos')}
                </Link>
                
                <Link 
                  to="/contact" 
                  className="block py-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('contact', 'Contact')}
                </Link>

                <div className="flex items-center space-x-4 py-2">
                  <LanguageSelector />
                  <CurrencySelector />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => {
                      navigate('/favorites');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Heart className="h-5 w-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-terracotta-600 text-xs text-white flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
