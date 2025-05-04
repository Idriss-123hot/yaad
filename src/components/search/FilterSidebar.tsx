import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SearchFilters } from '@/services/search';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  initialFilters: Partial<SearchFilters>;
  onApplyFilters: (filters: Partial<SearchFilters>) => void;
  onClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  initialFilters, 
  onApplyFilters,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState<Partial<SearchFilters>>(initialFilters);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [subcategories, setSubcategories] = useState<{id: string, name: string}[]>([]);
  const [artisans, setArtisans] = useState<{id: string, name: string}[]>([]);
  
  // Fetch filter options
  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
        
      if (!error && data) {
        setCategories(data);
      }
    };
    
    // Fetch subcategories
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name')
        .order('name');
        
      if (!error && data) {
        setSubcategories(data);
      }
    };
    
    // Fetch artisans
    const fetchArtisans = async () => {
      const { data, error } = await supabase
        .from('artisans')
        .select('id, name')
        .order('name');
        
      if (!error && data) {
        setArtisans(data);
      }
    };
    
    fetchCategories();
    fetchSubcategories();
    fetchArtisans();
  }, []);
  
  // Update local filters when initialFilters change
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setLocalFilters(prev => {
      const categories = [...(prev.category || [])];
      
      if (checked) {
        categories.push(categoryId);
      } else {
        const index = categories.indexOf(categoryId);
        if (index !== -1) {
          categories.splice(index, 1);
        }
      }
      
      return { ...prev, category: categories };
    });
  };
  
  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    setLocalFilters(prev => {
      const subcategories = [...(prev.subcategory || [])];
      
      if (checked) {
        subcategories.push(subcategoryId);
      } else {
        const index = subcategories.indexOf(subcategoryId);
        if (index !== -1) {
          subcategories.splice(index, 1);
        }
      }
      
      return { ...prev, subcategory: subcategories };
    });
  };
  
  const handleArtisanChange = (artisanId: string, checked: boolean) => {
    setLocalFilters(prev => {
      const artisansList = [...(prev.artisans || [])];
      
      if (checked) {
        artisansList.push(artisanId);
      } else {
        const index = artisansList.indexOf(artisanId);
        if (index !== -1) {
          artisansList.splice(index, 1);
        }
      }
      
      return { ...prev, artisans: artisansList };
    });
  };
  
  const handlePriceRangeChange = (value: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: value as [number, number]
    }));
  };
  
  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    if (onClose) onClose();
  };
  
  const handleResetFilters = () => {
    const resetFilters: Partial<SearchFilters> = {
      ...localFilters,
      category: [],
      subcategory: [],
      artisans: [],
      priceRange: [0, 1000] as [number, number]
    };
    
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };
  
  return (
    <div className="bg-white rounded-lg p-4 border sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-lg">Filtres</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700"
            aria-label="Fermer les filtres"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Prix</h3>
        <div className="px-2">
          <Slider 
            value={localFilters.priceRange as number[] || [0, 1000]} 
            min={0} 
            max={1000}
            step={10}
            onValueChange={handlePriceRangeChange}
            aria-label="Plage de prix"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{(localFilters.priceRange as number[])?.[0] || 0} MAD</span>
            <span>{(localFilters.priceRange as number[])?.[1] || 1000} MAD</span>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Catégories</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`} 
                checked={localFilters.category?.includes(category.id)} 
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
              />
              <Label 
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Subcategories - only show if categories are selected */}
      {localFilters.category && localFilters.category.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3">Sous-catégories</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {subcategories.map((subcategory) => (
              <div key={subcategory.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`subcategory-${subcategory.id}`} 
                  checked={localFilters.subcategory?.includes(subcategory.id)} 
                  onCheckedChange={(checked) => handleSubcategoryChange(subcategory.id, checked === true)}
                />
                <Label 
                  htmlFor={`subcategory-${subcategory.id}`}
                  className="text-sm cursor-pointer"
                >
                  {subcategory.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Artisans */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Artisans</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`artisan-${artisan.id}`} 
                checked={localFilters.artisans?.includes(artisan.id)} 
                onCheckedChange={(checked) => handleArtisanChange(artisan.id, checked === true)}
              />
              <Label 
                htmlFor={`artisan-${artisan.id}`}
                className="text-sm cursor-pointer"
              >
                {artisan.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button 
          className="w-full bg-terracotta-600 hover:bg-terracotta-700"
          onClick={handleApplyFilters}
        >
          Appliquer les filtres
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleResetFilters}
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};
