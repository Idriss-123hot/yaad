
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Interface pour les options de filtrage
 */
interface FilterOption {
  id: string;         // Identifiant unique du filtre
  label: string;      // Libellé affiché pour le filtre
  options?: { label: string; value: string }[];  // Options possibles pour ce filtre
}

/**
 * Interface pour les props du composant de recherche et filtrage
 */
interface SearchAndFilterProps {
  searchPlaceholder: string;  // Texte d'invite pour la zone de recherche
  searchQuery: string;        // Terme de recherche actuel
  onSearchChange: (value: string) => void;  // Fonction appelée lors du changement du terme de recherche
  filters: Record<string, string>;          // État actuel des filtres
  onFiltersChange: (filters: Record<string, string>) => void;  // Fonction appelée lors du changement des filtres
  filterOptions?: FilterOption[];  // Options de filtrage disponibles
}

/**
 * Composant de recherche et filtrage pour les tableaux de données
 * 
 * Permet de rechercher et filtrer les données dans un tableau.
 */
export function SearchAndFilter({
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  filterOptions = [],
}: SearchAndFilterProps) {
  // État local pour les filtres (avant application)
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(filters);
  
  // Vérifie si des filtres sont actuellement actifs
  const hasActiveFilters = Object.values(filters).some(value => value && value.length > 0);
  
  /**
   * Gère le changement d'une valeur de filtre
   * @param id - Identifiant du filtre
   * @param value - Nouvelle valeur
   */
  const handleFilterChange = (id: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  /**
   * Applique les filtres locaux aux filtres globaux
   */
  const applyFilters = () => {
    onFiltersChange(localFilters);
  };
  
  /**
   * Réinitialise tous les filtres
   */
  const resetFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as Record<string, string>);
    
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };
  
  /**
   * Efface le terme de recherche
   */
  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Champ de recherche */}
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
      
      {/* Bouton de filtrage et popover avec options de filtrage */}
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
              
              {/* Options de filtrage */}
              <div className="grid gap-4">
                {filterOptions.map((option) => (
                  <div key={option.id} className="grid gap-2">
                    <label htmlFor={option.id} className="text-sm font-medium">
                      {option.label}
                    </label>
                    {option.options ? (
                      // Menu déroulant pour les options prédéfinies
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
                      // Champ texte pour les filtres libres
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
              
              {/* Boutons d'action */}
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
