
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Photo%20salon%20marocain.jpeg',
      title: 'Artisanat Authentique',
      subtitle: 'Découvrez notre collection exclusive d\'artisanat marocain',
      cta: 'Explorer',
      link: '/categories',
    },
    {
      image: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Cusine%20Marocaine.png',
      title: 'Tapis Berbères',
      subtitle: 'Des motifs traditionnels tissés à la main par nos artisans',
      cta: 'Découvrir',
      link: '/categories/textiles-fabrics',
    },
    {
      image: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Chambre%20Marocaine.png',
      title: 'Savoir-Faire Marocain',
      subtitle: 'Rencontrez nos artisans passionnés et leur expertise',
      cta: 'Rencontrer',
      link: '/artisans',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full h-[80vh] mt-20">
      {/* Full-width slider without transparency */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Encadrement solide pour le texte (sans transparence) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-terracotta-800">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 text-gray-700">
                  {slide.subtitle}
                </p>
                <Button
                  asChild
                  className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-2"
                >
                  <a href={slide.link}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full h-12 w-12 z-10 shadow-md"
        onClick={prevSlide}
      >
        <ArrowLeft className="h-6 w-6" />
        <span className="sr-only">Précédent</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full h-12 w-12 z-10 shadow-md"
        onClick={nextSlide}
      >
        <ArrowRight className="h-6 w-6" />
        <span className="sr-only">Suivant</span>
      </Button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-terracotta-600' : 'bg-white hover:bg-white/80'
            } shadow-sm`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
