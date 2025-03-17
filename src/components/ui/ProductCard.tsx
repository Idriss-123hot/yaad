
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/models/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'horizontal';
  className?: string;
}

export function ProductCard({ product, variant = 'default', className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasDiscount = product.discountPrice !== undefined;
  
  return (
    <div 
      className={cn(
        'group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md',
        variant === 'horizontal' ? 'flex flex-row' : 'flex flex-col',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className={cn(
        'relative aspect-square overflow-hidden',
        variant === 'horizontal' ? 'w-1/3' : 'w-full'
      )}>
        <div className="zoom-image-container">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="zoom-image"
          />
        </div>
        
        {/* Wishlist button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/90"
        >
          <Heart className="h-4 w-4 text-gray-600" />
          <span className="sr-only">Add to wishlist</span>
        </Button>

        {/* Discount tag */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-terracotta-600 text-white text-xs font-medium px-2 py-1 rounded">
            Sale
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className={cn(
        'flex flex-col p-4',
        variant === 'horizontal' ? 'w-2/3' : 'w-full'
      )}>
        <span className="text-xs text-muted-foreground mb-1">{product.category}</span>
        <Link to={`/products/${product.id}`} className="group-hover:text-terracotta-600 transition-colors">
          <h3 className="font-medium text-base mb-2 line-clamp-1">{product.title}</h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <svg 
                key={index} 
                className={`w-3 h-3 ${index < Math.floor(product.rating) ? 'text-amber-500' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {variant === 'horizontal' && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="font-medium text-terracotta-600">
                  ${product.discountPrice?.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-medium">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "p-1 rounded-full transition-all",
              isHovered ? "bg-terracotta-600 text-white" : "bg-terracotta-50 text-terracotta-600"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
