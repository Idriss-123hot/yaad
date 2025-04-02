import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Données des slides avec contenu français
  const slides = [
    {
      image: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Photo%20salon%20marocain.jpeg',
      title: 'Artisanat du Maroc',
      subtitle: 'Découvrez des pièces uniques créées par nos maîtres artisans',
      cta: 'Explorer',
      link: '/categories',
    },
    // ... autres slides
  ];

  // Logique de défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Contrôles de navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[90vh] mt-20">
      {/* Carrousel */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={currentSlide !== index}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            
            {/* Contenu textuel */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="text-center text-white max-w-2xl px-4">
                <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                  {slide.subtitle}
                </p>
                <Button
                  size="lg"
                  className="bg-terracotta-600 hover:bg-terracotta-700 text-lg"
                  asChild
                >
                  <a href={slide.link}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contrôles */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-terracotta-600' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>

      {/* Flèches de navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ArrowLeft className="h-8 w-8 text-terracotta-800" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ArrowRight className="h-8 w-8 text-terracotta-800" />
      </Button>
    </section>
  );
}