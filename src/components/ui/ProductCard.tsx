
import { Link } from 'react-router-dom';
import { cn, getImageWithFallback } from '@/lib/utils';
import { ProductWithArtisan } from '@/models/types';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FEATURED_PRODUCTS } from '@/components/home/FeaturedProducts';
import { getArtisanById } from '@/utils/productUtils';

/**
 * Composant pour afficher une carte de produit
 * 
 * @param product Le produit à afficher
 * @param className Classes CSS additionnelles
 */
interface ProductCardProps {
  product: ProductWithArtisan;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { id, title, price, discountPrice, rating, reviewCount, images, artisanId } = product;
  
  const firstImage = images && images.length > 0 ? images[0] : undefined;
  const imageUrl = getImageWithFallback(firstImage);
  
  // Récupérer les informations sur l'artisan
  const artisan = product.artisan || (artisanId ? getArtisanById(artisanId) : undefined);
  const artisanName = artisan?.name || 'Artisan Marocain';
  
  // Vérifier si c'est un produit mis en avant pour déterminer la route correcte
  const isFeaturedProduct = FEATURED_PRODUCTS.some(p => p.id === id);
  const productLink = isFeaturedProduct ? `/featured/${id}` : `/products/${id}`;
  
  // Si l'artisan est disponible, créer un lien vers sa page
  const artisanLink = artisan ? `/artisans/${artisanId}` : undefined;
  
  return (
    <div className={cn(
      "group flex flex-col overflow-hidden rounded-lg transition-all duration-300",
      className
    )}>
      {/* Product Image */}
      <Link to={productLink} className="block aspect-square overflow-hidden rounded-lg bg-muted mb-3 relative">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
          }}
        />
        
        {discountPrice && (
          <Badge 
            className="absolute top-2 left-2 bg-terracotta-600/90 hover:bg-terracotta-600"
          >
            -{Math.round(((price - discountPrice) / price) * 100)}%
          </Badge>
        )}
      </Link>
      
      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <Link to={productLink}>
          <h3 className="font-medium text-base line-clamp-2 mb-1 group-hover:text-terracotta-600">
            {title}
          </h3>
        </Link>
        
        {artisanLink ? (
          <Link to={artisanLink} className="text-sm text-muted-foreground mb-2 hover:text-terracotta-600">
            Par {artisanName}
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground mb-2">
            Par {artisanName}
          </p>
        )}
        
        <div className="flex items-center mt-auto">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium ml-1">{rating?.toFixed(1) || "4.5"}</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({reviewCount || "0"})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          {discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">{discountPrice}€</span>
              <span className="text-sm text-muted-foreground line-through">{price}€</span>
            </div>
          ) : (
            <span className="text-lg font-medium">{price}€</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
