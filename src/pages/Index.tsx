
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ArtisanSpotlight } from '@/components/home/ArtisanSpotlight';
import { SearchBar } from '@/components/search/SearchBar';
import { ensureBucketsExist } from '@/utils/storageUtils';

const Index = () => {
  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    
    // Ensure storage buckets exist
    ensureBucketsExist().then(result => {
      if (result.success) {
        console.log('Buckets de stockage vérifiés avec succès');
      } else {
        console.error('Erreur lors de la vérification des buckets de stockage:', result.error);
      }
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Barre de recherche avancée */}
        <section className="py-12 px-6 md:px-12 bg-cream-50">
          <SearchBar className="max-w-5xl mx-auto" />
        </section>
        
        <FeaturedProducts />
        <div className="savoir-faire-exceptionnel">
          <Categories />
        </div>
        <ArtisanSpotlight />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
