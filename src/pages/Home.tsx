
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

const Home = () => {
  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <div className="py-16 px-4 md:px-6 lg:px-8 bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Catégories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez notre sélection de produits artisanaux marocains, chaque pièce raconte une histoire unique de savoir-faire traditionnel
              </p>
            </div>
            <Categories />
          </div>
        </div>

        {/* Featured Products Section - Using lighter background */}
        <div className="py-16 px-4 md:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Produits en Vedette</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez notre sélection de produits artisanaux exceptionnels
              </p>
            </div>
            <FeaturedProductsCarousel />
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/products" className="inline-flex items-center">
                  Voir tous les produits 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Artisans Section - Using lighter background */}
        <div className="py-16 px-4 md:px-6 lg:px-8 bg-cream-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Nos Artisans</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez les talentueux artisans derrière nos créations uniques
              </p>
            </div>
            <FeaturedArtisansCarousel />
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/artisans" className="inline-flex items-center">
                  Tous nos artisans
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
