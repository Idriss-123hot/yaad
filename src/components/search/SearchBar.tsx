
import { useState } from 'react';
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

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Logique de recherche à implémenter
  };

  const clearSearch = () => {
    setSearchTerm('');
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
            className="pl-10 pr-10 py-6 w-full rounded-l-full"
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
            <AdvancedFilters onApply={() => setIsFilterOpen(false)} />
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
