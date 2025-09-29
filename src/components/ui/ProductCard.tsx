
import { Link } from 'react-router-dom';
import { cn, getImageWithFallback } from '@/lib/utils';
import { ProductWithArtisan } from '@/models/types';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProductCardProps {
  product: ProductWithArtisan;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { id, title, price, discountPrice, rating, reviewCount, images, artisan } = product;
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { formatPrice } = useCurrency();
  
  const fallbackImage = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
  const firstImage = images && images.length > 0 && !imageError ? images[0] : fallbackImage;
  
  const discountPercentage = price && discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;
  
  const artisanName = artisan?.name || 'Artisan Marocain';
  const artisanId = artisan?.id || product.artisanId;
  
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };
  
  return (
    <div className={cn(
      "group flex flex-col overflow-hidden rounded-lg transition-all duration-300 hover-lift",
      className
    )}>
      <Link to={`/products/${id}`} className="block aspect-square overflow-hidden rounded-lg bg-muted mb-3 relative">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-4 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={firstImage}
          alt={title}
          className={cn(
            "h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {discountPrice && discountPercentage > 0 && (
          <Badge 
            className="absolute top-2 left-2 bg-terracotta-600/90 hover:bg-terracotta-600"
          >
            -{discountPercentage}%
          </Badge>
        )}
      </Link>
      
      <div className="flex-1 flex flex-col p-3">
        <Link to={`/products/${id}`}>
          <h3 className="font-medium text-base line-clamp-2 mb-3 group-hover:text-terracotta-600 leading-relaxed">
            {title}
          </h3>
        </Link>
        
        {artisanId ? (
          <Link to={`/artisans/${artisanId}`} className="text-sm text-muted-foreground mb-4 hover:text-terracotta-600 block">
            Par {artisanName}
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            Par {artisanName}
          </p>
        )}
        
        <div className="flex items-center mt-auto mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium ml-1">{rating?.toFixed(1) || "4.5"}</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({reviewCount || "0"})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {discountPrice ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-medium text-primary">{formatPrice(discountPrice)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(price)}</span>
            </div>
          ) : (
            <span className="text-lg font-medium text-primary">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
