
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  className?: string;
}

export function ProductGallery({ images, className }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || '');
  
  // If no images, return null
  if (!images || images.length === 0) {
    return null;
  }

  // Handler for thumbnail click
  const handleThumbnailClick = (image: string) => {
    setActiveImage(image);
  };

  return (
    <div className={cn("grid grid-cols-12 gap-4", className)}>
      {/* Vertical thumbnails */}
      <div className="col-span-2 flex flex-col space-y-3 h-fit">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(image)}
            className={cn(
              "relative border rounded-md overflow-hidden aspect-square transition-all",
              activeImage === image 
                ? "border-terracotta-600 ring-1 ring-terracotta-400"
                : "border-gray-200 hover:border-terracotta-300"
            )}
          >
            <img
              src={image}
              alt={`Aperçu du produit ${index + 1}`}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
              }}
            />
          </button>
        ))}
      </div>
      
      {/* Main image */}
      <div className="col-span-10">
        <div className="rounded-lg overflow-hidden">
          <img
            src={activeImage}
            alt="Image principale du produit"
            className="w-full h-auto object-cover aspect-square"
            onError={(e) => {
              e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductGallery;
