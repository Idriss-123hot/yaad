
import { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Subcategory } from '@/models/types';
import { SearchFilters } from '@/services/searchService';

export interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: Partial<SearchFilters>;
  onApplyFilters: (filters: Partial<SearchFilters>) => void;
}

const AdvancedFilters = ({
  isOpen,
  onClose,
  initialFilters,
  onApplyFilters
}: AdvancedFiltersProps) => {
  // Local state for filters
  const [filters, setFilters] = useState<Partial<SearchFilters>>(initialFilters);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [artisans, setArtisans] = useState<{ id: string; name: string }[]>([]);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    };
    
    fetchCategories();
  }, []);
  
  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!filters.category || filters.category.length === 0) {
        setSubcategories([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name, parent_id')
        .in('parent_id', filters.category);
      
      if (error) {
        console.error('Error fetching subcategories:', error);
        return;
      }
      
      setSubcategories(data || []);
    };
    
    fetchSubcategories();
  }, [filters.category]);
  
  // Fetch artisans
  useEffect(() => {
    const fetchArtisans = async () => {
      const { data, error } = await supabase
        .from('artisans')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching artisans:', error);
        return;
      }
      
      setArtisans(data || []);
    };
    
    fetchArtisans();
  }, []);
  
  // Initialize filters from props
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);
  
  // Handle category change
  const handleCategoryChange = (id: string, checked: boolean) => {
    setFilters(prev => {
      const prevCategories = prev.category || [];
      
      if (checked) {
        return { ...prev, category: [...prevCategories, id] };
      } else {
        // Remove category and any subcategories belonging to it
        const newCategories = prevCategories.filter(c => c !== id);
        const prevSubcategories = prev.subcategory || [];
        const newSubcategories = prevSubcategories.filter(sc => {
          const subcategory = subcategories.find(s => s.id === sc);
          return subcategory?.parent_id !== id;
        });
        
        return { 
          ...prev, 
          category: newCategories,
          subcategory: newSubcategories
        };
      }
    });
  };
  
  // Handle subcategory change
  const handleSubcategoryChange = (id: string, checked: boolean) => {
    setFilters(prev => {
      const prevSubcategories = prev.subcategory || [];
      
      if (checked) {
        return { ...prev, subcategory: [...prevSubcategories, id] };
      } else {
        return { 
          ...prev, 
          subcategory: prevSubcategories.filter(sc => sc !== id)
        };
      }
    });
  };
  
  // Handle artisan change
  const handleArtisanChange = (id: string, checked: boolean) => {
    setFilters(prev => {
      const prevArtisans = prev.artisans || [];
      
      if (checked) {
        return { ...prev, artisans: [...prevArtisans, id] };
      } else {
        return { 
          ...prev, 
          artisans: prevArtisans.filter(a => a !== id)
        };
      }
    });
  };
  
  // Apply filters
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };
  
  // Reset filters
  const handleReset = () => {
    const resetFilters = { q: filters.q };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:max-w-none overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={(filters.category || []).includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked === true)
                    }
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Subcategories */}
          {subcategories.length > 0 && (
            <>
              <div>
                <h3 className="font-medium mb-3">Subcategories</h3>
                <div className="space-y-2">
                  {subcategories.map(subcategory => (
                    <div key={subcategory.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`subcategory-${subcategory.id}`}
                        checked={(filters.subcategory || []).includes(subcategory.id)}
                        onCheckedChange={(checked) => 
                          handleSubcategoryChange(subcategory.id, checked === true)
                        }
                      />
                      <Label htmlFor={`subcategory-${subcategory.id}`}>{subcategory.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
            </>
          )}
          
          {/* Artisans */}
          <div>
            <h3 className="font-medium mb-3">Artisans</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {artisans.map(artisan => (
                <div key={artisan.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`artisan-${artisan.id}`}
                    checked={(filters.artisans || []).includes(artisan.id)}
                    onCheckedChange={(checked) => 
                      handleArtisanChange(artisan.id, checked === true)
                    }
                  />
                  <Label htmlFor={`artisan-${artisan.id}`}>{artisan.name}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Add more filter sections as needed */}
        </div>
        
        <SheetFooter className="flex flex-row space-x-2 sm:space-x-0">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;
