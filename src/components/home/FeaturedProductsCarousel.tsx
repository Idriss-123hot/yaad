
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ui/ProductCard';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';
import { ProductWithArtisan } from '@/models/types';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * FeaturedProductsCarousel Component
 * 
 * Fetches featured products from Supabase and displays them in an auto-rotating carousel.
 * Products are filtered where featured = true in the database.
 * The carousel automatically rotates through the products and updates when changes are made in the database.
 */
const FeaturedProductsCarousel = () => {
  const [api, setApi] = useState<any>();

  // Set up the auto-rotation for the carousel
  useEffect(() => {
    if (!api) return;

    // Interval for auto-rotation (every 5 seconds)
    const autoRotateInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Clean up on unmount
    return () => {
      clearInterval(autoRotateInterval);
    };
  }, [api]);

  // Fetch featured products from Supabase
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      // Fetch all featured products with their related data
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          artisan:artisans(
            id,
            name,
            profile_photo,
            bio,
            location,
            featured,
            rating,
            review_count,
            first_gallery_images,
            joined_date,
            description,
            website
          ),
          category:categories(
            id,
            name,
            slug
          ),
          subcategory:subcategories(
            id,
            name
          )
        `)
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process each product through our mapper to ensure correct typing
      return data.map(product => mapDatabaseProductToProduct(product)) as ProductWithArtisan[];
    }
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des produits.
        <p className="text-sm text-muted-foreground mt-2">
          {(error as Error).message}
        </p>
      </div>
    );
  }

  // Handle empty state
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        Aucun produit en vedette n'est disponible pour le moment.
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
      setApi={setApi}
    >
      <CarouselContent>
        {featuredProducts.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-1">
            <div className="p-1">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 lg:left-0" />
      <CarouselNext className="right-2 lg:right-0" />
    </Carousel>
  );
};

export default FeaturedProductsCarousel;
