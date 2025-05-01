
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { useCarousel } from '@/hooks/useCarousel';
import { SAMPLE_ARTISANS } from '@/models/types';

export function FeaturedArtisansCarousel() {
  const { api, carouselRef } = useCarousel();
  
  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [api]);
  
  return (
    <section className="py-12 px-4 md:px-8 bg-cream-50 artisan-carousel">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold">Nos Artisans à l'Honneur</h2>
          <Link to="/artisans">
            <Button variant="link" className="text-terracotta-600">
              Voir tous les artisans
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <Carousel
          ref={carouselRef}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {SAMPLE_ARTISANS.map((artisan) => (
              <CarouselItem key={artisan.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ArtisanCard artisan={artisan} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex">
            <CarouselPrevious className="-left-3" />
            <CarouselNext className="-right-3" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

export default FeaturedArtisansCarousel;
