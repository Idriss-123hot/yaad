
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SAMPLE_CATEGORIES } from '@/models/types';
import { cn } from '@/lib/utils';

const Categories = () => {
  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Banner */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Browse Categories</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover unique handcrafted treasures from skilled artisans around the world,
              organized by category to help you find exactly what you're looking for.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SAMPLE_CATEGORIES.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/categories/${category.slug}`}
                  className="group relative h-80 rounded-lg overflow-hidden hover-lift"
                >
                  {/* Image */}
                  <div className="absolute inset-0 zoom-image-container">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="zoom-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 transition-opacity group-hover:opacity-70" />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-6 text-white z-10">
                    <h3 className="font-serif text-xl md:text-2xl font-semibold mb-1 group-hover:text-terracotta-100 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      {category.productCount} Products
                    </p>
                    <span className="inline-block text-sm text-white border-b border-white/30 pb-px group-hover:border-terracotta-300 group-hover:text-terracotta-100 transition-colors">
                      Explore Collection
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
