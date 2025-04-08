
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { mapDatabaseArtisanToArtisan } from '@/utils/mapDatabaseModels';

/**
 * FeaturedArtisansCarousel Component
 * 
 * Fetches featured artisans from Supabase and displays them in an auto-rotating carousel.
 * Artisans are filtered where featured = true in the database.
 * The carousel automatically rotates with smooth scrolling.
 * 
 * Features:
 * - Dynamic data fetching from Supabase
 * - Auto-scrolling with pause on hover
 * - Responsive design
 * - Loading skeletons while fetching
 * - Error handling
 * - Navigation buttons for manual scrolling
 */
export function FeaturedArtisansCarousel() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const scrollInterval = useRef<number | null>(null);
  
  // Fallback image for artisans without a profile photo
  const fallbackImage = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg";

  useEffect(() => {
    fetchFeaturedArtisans();
    
    // Auto-scroll setup
    const startAutoScroll = () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
      
      scrollInterval.current = window.setInterval(() => {
        if (carouselRef.current) {
          const newScrollPosition = carouselRef.current.scrollLeft + 1; // Scroll plus lent
          
          if (newScrollPosition >= maxScroll) {
            // Retour au début quand on atteint la fin
            carouselRef.current.scrollLeft = 0;
            setScrollPosition(0);
          } else {
            carouselRef.current.scrollLeft = newScrollPosition;
            setScrollPosition(newScrollPosition);
          }
        }
      }, 80); // Interval plus long pour un défilement plus lent
    };
    
    // Démarrer le défilement auto une fois les artisans chargés
    if (artisans.length > 0 && !loading) {
      startAutoScroll();
      
      // Calculer la largeur maximale de défilement
      if (carouselRef.current) {
        setMaxScroll(
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth
        );
      }
    }
    
    // Pause auto-scroll on hover
    const handleMouseEnter = () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
        scrollInterval.current = null;
      }
    };
    
    // Resume auto-scroll on mouse leave
    const handleMouseLeave = () => {
      if (!scrollInterval.current) {
        startAutoScroll();
      }
    };
    
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('mouseenter', handleMouseEnter);
      carousel.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
      
      if (carousel) {
        carousel.removeEventListener('mouseenter', handleMouseEnter);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [artisans, loading, maxScroll]);

  const fetchFeaturedArtisans = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('artisans')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      // Process artisans to ensure each has a valid profile image
      const processedArtisans = data.map(artisan => {
        const mappedArtisan = mapDatabaseArtisanToArtisan(artisan);
        // Add fallback image if profileImage is empty
        if (!mappedArtisan.profileImage) {
          mappedArtisan.profileImage = fallbackImage;
        }
        return mappedArtisan;
      });
      
      setArtisans(processedArtisans || []);
    } catch (err) {
      console.error('Error fetching featured artisans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const newPosition = Math.max(0, carouselRef.current.scrollLeft - 500);
      carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const newPosition = Math.min(
        maxScroll,
        carouselRef.current.scrollLeft + 500
      );
      carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  // Loading state - display skeleton cards
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des artisans.
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!artisans || artisans.length === 0) {
    return (
      <div className="text-center py-8">
        Aucun artisan en vedette n'est disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full bg-background/80 text-foreground shadow-md hover:bg-background",
            { "opacity-50 cursor-not-allowed": scrollPosition <= 0 }
          )}
          onClick={scrollLeft}
          disabled={scrollPosition <= 0}
          aria-label="Previous artisans"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full bg-background/80 text-foreground shadow-md hover:bg-background",
            { "opacity-50 cursor-not-allowed": scrollPosition >= maxScroll }
          )}
          onClick={scrollRight}
          disabled={scrollPosition >= maxScroll}
          aria-label="Next artisans"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      <div
        ref={carouselRef}
        className="overflow-x-auto pb-4 scrollbar-hide"
        onScroll={handleScroll}
      >
        <div className="flex space-x-6 py-4 px-2">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="min-w-[300px] max-w-[300px]">
              <ArtisanCard artisan={artisan} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedArtisansCarousel;
