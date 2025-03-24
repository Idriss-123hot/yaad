
import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { AdvancedFilters } from './AdvancedFilters';
import { useNavigate } from 'react-router-dom';
import { SearchFilters } from '@/services/searchService';

interface SearchBarProps {
  className?: string;
  initialSearchTerm?: string;
  onSearch?: (term: string) => void;
  onFilterApply?: (filters: Partial<SearchFilters>) => void;
  isCompact?: boolean;
}

export function SearchBar({ 
  className = "", 
  initialSearchTerm = "", 
  onSearch, 
  onFilterApply,
  isCompact = false
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // Navigate to search page with query param if no onSearch provided
      const params = new URLSearchParams();
      if (searchTerm) params.set('q', searchTerm);
      navigate(`/search?${params.toString()}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleFilterApply = (filters: Partial<SearchFilters>) => {
    setIsFilterOpen(false);
    
    if (onFilterApply) {
      onFilterApply(filters);
    } else {
      // Navigate to search page with filter params if no onFilterApply provided
      const params = new URLSearchParams();
      if (searchTerm) params.set('q', searchTerm);
      
      // Add other filters to params
      if (filters.category) params.set('category', filters.category);
      if (filters.subcategory) params.set('subcategory', filters.subcategory);
      if (filters.artisans?.length) params.set('artisan', filters.artisans[0]);
      if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
      if (filters.rating !== undefined) params.set('rating', filters.rating.toString());
      if (filters.delivery) params.set('delivery', filters.delivery);
      
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un produit, un artisan, une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-10 w-full rounded-l-full ${isCompact ? 'py-2' : 'py-6'}`}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="ml-2 rounded-r-full border-l-0 px-4"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtres avancés</SheetTitle>
            </SheetHeader>
            <AdvancedFilters 
              onApply={handleFilterApply} 
              initialFilters={{
                q: searchTerm,
              }}
            />
          </SheetContent>
        </Sheet>
        
        <Button 
          type="submit" 
          className="ml-2 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white"
        >
          Rechercher
        </Button>
      </form>
    </div>
  );
}

export default SearchBar;
