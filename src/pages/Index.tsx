
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ArtisanSpotlight } from '@/components/home/ArtisanSpotlight';

const Index = () => {
  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen tadelakt-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        <Categories />
        <ArtisanSpotlight />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
