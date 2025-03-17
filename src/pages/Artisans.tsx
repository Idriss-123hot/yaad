
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { SAMPLE_ARTISANS } from '@/models/types';

const Artisans = () => {
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
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Meet Our Artisans</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the talented makers behind our handcrafted products. Each artisan brings unique skills,
              traditions, and stories to their creations.
            </p>
          </div>
        </section>

        {/* Artisans Grid */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SAMPLE_ARTISANS.map((artisan) => (
                <ArtisanCard 
                  key={artisan.id} 
                  artisan={artisan} 
                  className="hover-lift"
                  linkTo={`/artisans/${artisan.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Artisans;
