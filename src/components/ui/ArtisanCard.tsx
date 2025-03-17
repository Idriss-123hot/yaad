
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Artisan } from '@/models/types';
import { cn } from '@/lib/utils';

interface ArtisanCardProps {
  artisan: Artisan;
  className?: string;
}

export function ArtisanCard({ artisan, className }: ArtisanCardProps) {
  return (
    <div 
      className={cn(
        'group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      {/* Artisan Profile Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <div className="zoom-image-container">
          <img 
            src={artisan.profileImage} 
            alt={artisan.name} 
            className="zoom-image object-cover"
          />
        </div>
        
        {/* Featured badge */}
        {artisan.featured && (
          <span className="absolute top-3 left-3 bg-terracotta-600 text-white text-xs font-medium px-2 py-1 rounded">
            Featured Artisan
          </span>
        )}
      </div>

      {/* Artisan Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Link to={`/artisans/${artisan.id}`} className="group-hover:text-terracotta-600 transition-colors">
            <h3 className="font-medium">{artisan.name}</h3>
          </Link>
          
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <svg 
                key={index} 
                className={`w-3 h-3 ${index < Math.floor(artisan.rating) ? 'text-amber-500' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{artisan.location}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {artisan.bio}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{artisan.productCount} Products</span>
          <span>{artisan.reviewCount} Reviews</span>
        </div>
      </div>
    </div>
  );
}

export default ArtisanCard;
