
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import FeaturedProductsCarousel from '@/components/home/FeaturedProductsCarousel';
import FeaturedArtisansCarousel from '@/components/home/FeaturedArtisansCarousel';
import SearchBar from '@/components/search/SearchBar';
import { AdminBanner } from '@/components/layout/AdminBanner';
import { ensureBucketsExist } from '@/utils/storageUtils';
import { useTranslations } from '@/lib/i18n';

// Add CSS for carousels
const productCarouselStyle = "px-4 md:px-8";
const artisanCarouselStyle = "animate-fade-in";

const Index = () => {
  // Get translations using our updated hook
  const { t, isLoading } = useTranslations();
  const navigate = useNavigate();

  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Ensure storage buckets exist
    ensureBucketsExist().then((result) => {
      if (result.success) {
        console.log('Buckets de stockage vérifiés avec succès');
      } else {
        console.error('Erreur lors de la vérification des buckets de stockage:', result.error);
      }
    });
  }, []);

  useEffect(() => {
    // Set CSS variable for admin banner height adjustment
    const adminBanner = document.querySelector('[data-admin-banner]');
    if (adminBanner) {
      const height = adminBanner.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--admin-banner-height', `${height}px`);
    }
  }, []);

  // Handle search from the homepage
  const handleSearch = (filters: any) => {
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

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div data-admin-banner>
          <AdminBanner />
        </div>
        <Navbar />
        <main className="flex-grow flex items-center justify-center" style={{ marginTop: 'calc(64px + var(--admin-banner-height, 0px))' }}>
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-terracotta-600 rounded-full border-t-transparent mx-auto"></div>
            <p className="mt-4">Loading translations...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div data-admin-banner>
        <AdminBanner />
      </div>
      <Navbar />
      <main className="flex-grow" style={{ marginTop: 'calc(64px + var(--admin-banner-height, 0px))' }}>
        <Hero />
        
        <section className="py-12 px-6 md:px-12 bg-cream-50">
          <SearchBar 
            onSearch={handleSearch}
            className="max-w-5xl mx-auto"
            initialFilters={{
              q: '',
              category: [],
              subcategory: []
            }}
          />
        </section>
        
        <section className="py-12 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            {t('featured_collection', 'Collection à la une')}
          </h2>
        </section>
        
        <div className={productCarouselStyle}>
          <FeaturedProductsCarousel />
        </div>
        
        <div className="savoir-faire-exceptionnel">
          <Categories />
        </div>
        
        <div className={artisanCarouselStyle}>
          <FeaturedArtisansCarousel />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
