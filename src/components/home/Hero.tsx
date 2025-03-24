
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of banner images to rotate through
  const bannerImages = [
    "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/yaadhomepage/Photo%20salon%20marocain.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ5YWFkaG9tZXBhZ2UvUGhvdG8gc2Fsb24gbWFyb2NhaW4uanBlZyIsImlhdCI6MTc0MjcyMjIzMywiZXhwIjoxNzc0MjU4MjMzfQ.wvZWoEAcdTY3hycpzS96FpNsCNpG0PbSArXrgrFMC9U",
    "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/yaadhomepage/Cusine%20Marocaine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ5YWFkaG9tZXBhZ2UvQ3VzaW5lIE1hcm9jYWluZS5wbmciLCJpYXQiOjE3NDI3MjMzNDgsImV4cCI6MTc3NDI1OTM0OH0.lpjfeptVjCzU19i59pgvceax2fDAzctwosKf4iEc5TI",
    "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/yaadhomepage/Chambre%20Marocaine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ5YWFkaG9tZXBhZ2UvQ2hhbWJyZSBNYXJvY2FpbmUucG5nIiwiaWF0IjoxNzQyNzIzMzc4LCJleHAiOjE3NzQyNTkzNzh9.lk7lIfYnu6D-zR7BZyKcPvd9Xmh5t8KG3BWKDxLigL8"
  ];

  useEffect(() => {
    setLoaded(true);
    
    // Set up image rotation every 3 seconds
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="relative h-[56vh] overflow-hidden pt-8">
      {/* Background Image with Rotation - Adjusted position */}
      <div className="absolute inset-0 z-0 top-[-15%]">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 z-10"
          aria-hidden="true"
        />
        {bannerImages.map((src, index) => (
          <img 
            key={index}
            src={src}
            alt={`Moroccan interior design ${index + 1}`}
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 absolute inset-0 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <div className={loaded ? 'animate-fade-in' : ''}>
            <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-6">
              Artisanat Marocain Authentique
            </span>
          </div>
          
          <h1 
            className={loaded ? 'font-serif text-3xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in' : 'font-serif text-3xl md:text-5xl font-bold leading-tight mb-6'}
          >
            L'Art Marocain <br /> 
            <span className="text-terracotta-600">dans votre intérieur</span>
          </h1>
          
          <p 
            className={loaded ? 'text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in' : 'text-lg md:text-xl text-muted-foreground mb-6'}
          >
            Découvrez des produits uniques fabriqués à la main avec soin, 
            passion et techniques traditionnelles par des artisans marocains talentueux.
          </p>
          
          <div className={loaded ? 'flex flex-col sm:flex-row gap-4 animate-fade-in' : 'flex flex-col sm:flex-row gap-4'}>
            <Link to="/search">
              <Button 
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-6 w-full sm:w-auto"
                size="lg"
              >
                Explorer Nos Produits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/artisans">
              <Button 
                variant="outline" 
                className="border-terracotta-200 text-foreground hover:bg-terracotta-50 px-8 py-6 w-full sm:w-auto"
                size="lg"
              >
                Rencontrer Nos Artisans
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-terracotta-300 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-terracotta-500 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
