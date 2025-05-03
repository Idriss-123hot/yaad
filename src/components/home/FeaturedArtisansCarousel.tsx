
import { useRef, useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Artisan } from '@/models/types';

export function FeaturedArtisansCarousel() {
  const { api, carouselRef } = useCarousel();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch featured artisans from Supabase
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('artisans')
          .select('*, products(id)')
          .eq('featured', true)
          .order('name');
          
        if (error) throw error;
        
        // Map database artisans to Artisan model
        const mappedArtisans = data.map((artisan): Artisan => ({
          id: artisan.id,
          name: artisan.name,
          bio: artisan.bio || '',
          location: artisan.location || '',
          profileImage: artisan.profile_photo || '',
          description: artisan.description || '',
          website: artisan.website || '',
          rating: artisan.rating || 0,
          reviewCount: artisan.review_count || 0,
          productCount: artisan.products?.length || 0,  // Add productCount property
          featured: artisan.featured || false,
          joinedDate: new Date(artisan.joined_date),
          galleryImages: artisan.first_gallery_images || []
        }));
        
        setArtisans(mappedArtisans);
      } catch (error) {
        console.error('Error fetching artisans:', error);
        // Don't show error toast on homepage components
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtisans();
  }, []);
  
  // Auto-rotate carousel
  useEffect(() => {
    if (!api || artisans.length <= 1) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [api, artisans.length]);
  
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
            {loading ? (
              // Show placeholders while loading
              Array(4).fill(0).map((_, index) => (
                <CarouselItem key={`placeholder-${index}`} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="rounded-lg overflow-hidden shadow-md bg-white p-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mx-auto mb-4"></div>
                    <div className="h-5 bg-gray-200 animate-pulse rounded mb-2 w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto"></div>
                  </div>
                </CarouselItem>
              ))
            ) : artisans.length > 0 ? (
              artisans.map((artisan) => (
                <CarouselItem key={artisan.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ArtisanCard artisan={artisan} />
                </CarouselItem>
              ))
            ) : (
              // Show placeholder if no artisans
              <CarouselItem className="basis-full">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nos artisans seront bientôt disponibles</p>
                </div>
              </CarouselItem>
            )}
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
