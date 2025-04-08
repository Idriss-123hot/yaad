
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

/**
 * Home page component
 * 
 * Displays the main landing page with featured sections including:
 * - Hero banner
 * - Product categories
 * - Featured products from Supabase (automatically rotates)
 * - Featured artisans
 * 
 * NOTE: All product data is dynamically fetched from Supabase.
 * Static/hardcoded products have been removed to ensure all content
 * is up-to-date with the database.
 */
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

        {/* Featured Products Section - Dynamic content from Supabase */}
        <div className="py-16 px-4 md:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Savoir-Faire Exceptionnel</h2>
              <Button asChild variant="ghost" className="flex items-center">
                <Link to="/products" className="flex items-center text-terracotta-600 hover:text-terracotta-700">
                  Voir tous les produits 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {/* Dynamic featured products carousel connected to Supabase */}
            {/* This carousel fetches all products where featured=true from the database */}
            {/* No static product data is used - all content is dynamically loaded */}
            <FeaturedProductsCarousel />
          </div>
        </div>

        {/* Featured Artisans Section */}
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
