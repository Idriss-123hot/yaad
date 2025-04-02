
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterOption {
  id: string;
  label: string;
  options?: { label: string; value: string }[];
}

interface SearchAndFilterProps {
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
  filterOptions?: FilterOption[];
}

export function SearchAndFilter({
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  filterOptions = [],
}: SearchAndFilterProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(filters);
  
  const hasActiveFilters = Object.values(filters).some(value => value && value.length > 0);
  
  const handleFilterChange = (id: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const applyFilters = () => {
    onFiltersChange(localFilters);
  };
  
  const resetFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as Record<string, string>);
    
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };
  
  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Effacer</span>
          </Button>
        )}
      </div>
      
      {filterOptions.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={hasActiveFilters ? "default" : "outline"} className="bg-terracotta-600 text-white">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
              {hasActiveFilters && (
                <span className="ml-2 rounded-full bg-white text-terracotta-600 px-2 py-0.5 text-xs font-bold">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Filtres avancés</h4>
              
              <div className="grid gap-4">
                {filterOptions.map((option) => (
                  <div key={option.id} className="grid gap-2">
                    <label htmlFor={option.id} className="text-sm font-medium">
                      {option.label}
                    </label>
                    {option.options ? (
                      <select
                        id={option.id}
                        value={localFilters[option.id] || ''}
                        onChange={(e) => handleFilterChange(option.id, e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">Tous</option>
                        {option.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={option.id}
                        value={localFilters[option.id] || ''}
                        onChange={(e) => handleFilterChange(option.id, e.target.value)}
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Réinitialiser
                </Button>
                <Button onClick={applyFilters} className="bg-terracotta-600">
                  Appliquer
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
