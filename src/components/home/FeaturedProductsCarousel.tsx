
import React, { useEffect, useRef } from 'react';
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
 * The carousel automatically rotates through the products using a useRef approach for better performance.
 */
const FeaturedProductsCarousel = () => {
  // Use useRef instead of useState for the carousel API
  const carouselRef = useRef<{ scrollNext: () => void } | null>(null);
  
  // Fallback image for products without images
  const fallbackImage = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg";

  // Set up the auto-rotation for the carousel using the ref
  useEffect(() => {
    // Only proceed if we have a valid carousel reference
    if (!carouselRef.current) return;
    
    // Interval for auto-rotation (every 5 seconds)
    const autoRotateInterval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollNext();
      }
    }, 5000);

    // Clean up on unmount
    return () => {
      clearInterval(autoRotateInterval);
    };
  }, [carouselRef.current]); // Only re-run if the ref changes

  // Fetch featured products from Supabase
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      try {
        // Fetch all featured products with their related data
        // Important: Using .select('*') for artisans directly causes the infinite recursion
        // So we'll fetch minimal data needed for display
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            artisan:artisan_id (
              id, name, profile_photo, location, rating
            ),
            category:category_id (
              id, name
            )
          `)
          .eq('featured', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Process each product through our mapper to ensure correct typing
        // and add fallback image if no images are available
        return data.map(product => {
          // Create a properly structured product object to match expected interface
          const mappedProduct = {
            id: product.id,
            title: product.title,
            description: product.description || '',
            price: product.price,
            discountPrice: product.discount_price,
            category: product.category?.name || '',
            categoryId: product.category_id,
            subcategory: '',
            subcategoryId: product.subcategory_id,
            tags: product.tags || [],
            images: product.images || [],
            stock: product.stock,
            artisanId: product.artisan_id,
            rating: product.rating || 0,
            reviewCount: product.review_count || 0,
            featured: product.featured || false,
            createdAt: new Date(product.created_at),
            material: product.material,
            origin: product.origin,
            // Add artisan data if available
            artisan: product.artisan ? {
              id: product.artisan.id,
              name: product.artisan.name,
              bio: '',
              location: product.artisan.location || '',
              profileImage: product.artisan.profile_photo || '',
              galleryImages: [],
              rating: product.artisan.rating || 4.5,
              reviewCount: 0,
              productCount: 0,
              featured: false,
              joinedDate: new Date()
            } : undefined
          };
          
          // Add fallback image if the product has no images
          if (!mappedProduct.images || mappedProduct.images.length === 0) {
            mappedProduct.images = [fallbackImage];
          }
          
          return mappedProduct as ProductWithArtisan;
        });
      } catch (err) {
        console.error("Error fetching featured products:", err);
        throw err;
      }
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

  // Function to handle carousel API instantiation
  const handleCarouselCreated = (api: any) => {
    carouselRef.current = api;
  };

  return (
    // Add a container with minimum height and background for better debugging
    <div className="min-h-[400px] w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative"
        setApi={handleCarouselCreated} // Use our custom handler for the API
      >
        <CarouselContent className="flex">
          {featuredProducts.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-1"
              aria-label={`Featured product: ${product.title}`}
            >
              <div className="p-1 h-full">
                <ProductCard product={product} className="h-full" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious 
          className="left-2 lg:left-0" 
          aria-label="View previous featured product"
        />
        <CarouselNext 
          className="right-2 lg:right-0" 
          aria-label="View next featured product"
        />
      </Carousel>
    </div>
  );
};

export default FeaturedProductsCarousel;
