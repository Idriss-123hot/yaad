
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative h-[80vh] overflow-hidden pt-16">
      {/* Background Image - Modern Moroccan Living Room */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 z-10"
          aria-hidden="true"
        />
        <img 
          src="https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/sign/yaadhomepage/Photo%20salon%20marocain.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ5YWFkaG9tZXBhZ2UvUGhvdG8gc2Fsb24gbWFyb2NhaW4uanBlZyIsImlhdCI6MTc0MjcyMjIzMywiZXhwIjoxNzc0MjU4MjMzfQ.wvZWoEAcdTY3hycpzS96FpNsCNpG0PbSArXrgrFMC9U"
          alt="Modern Moroccan living room with artisanal products"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <div className={`opacity-0 ${loaded ? 'animate-slide-down' : ''}`}>
            <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-6">
              Artisanat Marocain Authentique
            </span>
          </div>
          
          <h1 
            className={`font-serif text-4xl md:text-6xl font-bold leading-tight mb-6 opacity-0 ${loaded ? 'animate-slide-down stagger-1' : ''}`}
          >
            L'Art Marocain <br /> 
            <span className="text-terracotta-600">dans votre intérieur</span>
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-muted-foreground mb-8 opacity-0 ${loaded ? 'animate-slide-down stagger-2' : ''}`}
          >
            Découvrez des produits uniques fabriqués à la main avec soin, 
            passion et techniques traditionnelles par des artisans marocains talentueux.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 opacity-0 ${loaded ? 'animate-slide-down stagger-3' : ''}`}>
            <Button 
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-6"
              size="lg"
            >
              Explorer Nos Produits
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="border-terracotta-200 text-foreground hover:bg-terracotta-50 px-8 py-6"
              size="lg"
            >
              Rencontrer Nos Artisans
            </Button>
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
