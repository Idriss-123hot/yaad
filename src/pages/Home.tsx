
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import FeaturedProductsCarousel from '@/components/home/FeaturedProductsCarousel';
import FeaturedArtisansCarousel from '@/components/home/FeaturedArtisansCarousel';
import SearchBar from '@/components/search/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/lib/i18n';

/**
 * Home page component
 * 
 * Displays the main landing page with featured sections including:
 * - Hero banner with dynamic content
 * - Search bar with advanced filtering
 * - Product categories
 * - Dynamic featured products carousel (auto-rotates)
 * - Dynamic featured artisans carousel (auto-rotates)
 */
const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  
  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  
  // Handle search from the homepage
  const handleSearch = (filters) => {
    const queryParams = new URLSearchParams();
    if (filters.q) {
      queryParams.set('q', filters.q);
    }
    
    // Handle category if it's an array
    if (filters.category && filters.category.length > 0) {
      queryParams.set('category', filters.category[0]);
    }
    
    // Handle subcategory if it's an array
    if (filters.subcategory && filters.subcategory.length > 0) {
      queryParams.set('subcategory', filters.subcategory[0]);
    }
    
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Search Section */}
        <section className="py-12 px-4 md:px-6 lg:px-8 bg-cream-50">
          <SearchBar 
            onSearch={handleSearch}
            className="max-w-5xl mx-auto"
            initialFilters={{
              q: '',
              category: [],
              subcategory: []
            }}
            variant="expanded"
            autoFocus={false}
          />
        </section>

        {/* Featured Products Section - Dynamic content from Supabase */}
        <div className="py-16 px-4 md:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">{t('featured_collection', 'Savoir-Faire Exceptionnel')}</h2>
              <Button asChild variant="ghost" className="flex items-center">
                <Link to="/products" className="flex items-center text-terracotta-600 hover:text-terracotta-700">
                  {t('view_all_products', 'Voir tous les produits')} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {/* Dynamic featured products carousel connected to Supabase */}
            <FeaturedProductsCarousel />
          </div>
        </div>
        
        {/* Categories Section */}
        <div className="py-16 px-4 md:px-6 lg:px-8 bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t('browse_by_category', 'Catégories')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('explore_collection', 'Découvrez notre sélection de produits artisanaux marocains, chaque pièce raconte une histoire unique de savoir-faire traditionnel')}
              </p>
            </div>
            <Categories />
          </div>
        </div>

        {/* Featured Artisans Section - Dynamic content from Supabase */}
        <div className="py-16 px-4 md:px-6 lg:px-8 bg-cream-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t('our_artisans', 'Nos Artisans')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('discover_artisans', 'Découvrez les talentueux artisans derrière nos créations uniques')}
              </p>
            </div>
            {/* Dynamic featured artisans carousel connected to Supabase */}
            <FeaturedArtisansCarousel />
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/artisans" className="inline-flex items-center">
                  {t('all_artisans', 'Tous nos artisans')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default Home;
