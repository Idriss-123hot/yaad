
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

/**
 * ProductGallery Component
 * 
 * A reusable component for displaying a product's main image with thumbnails
 * Handles image selection and display
 */
export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Set fallback image in case of loading errors
  const fallbackImage = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
  
  // Handle thumbnail click - immediately changes the main image
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="aspect-square bg-cream-50 rounded-lg overflow-hidden">
        <img 
          src={images[currentImageIndex] || fallbackImage} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2 md:gap-4">
          {images.map((img, idx) => (
            <button 
              key={idx} 
              className={cn(
                "aspect-square bg-cream-50 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity",
                currentImageIndex === idx ? 'ring-2 ring-terracotta-600' : 'opacity-70 hover:opacity-100'
              )}
              onClick={() => handleThumbnailClick(idx)}
              aria-label={`View ${title} - image ${idx + 1}`}
            >
              <img 
                src={img} 
                alt={`${title} - View ${idx + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
