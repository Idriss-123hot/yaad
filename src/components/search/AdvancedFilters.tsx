
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
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { Subcategory } from '@/models/types';
import { SearchFilters } from '@/services/search';
import { Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState({
    categories: true,
    subcategories: false,
    artisans: true
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(prev => ({ ...prev, categories: true }));
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
        
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        
        setCategories(data || []);
      } catch (err) {
        console.error('Exception fetching categories:', err);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch subcategories based on selected categories
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!filters.category || filters.category.length === 0) {
        setSubcategories([]);
        return;
      }
      
      setLoading(prev => ({ ...prev, subcategories: true }));
      try {
        const { data, error } = await supabase
          .from('subcategories')
          .select('id, name, parent_id')
          .in('parent_id', filters.category);
        
        if (error) {
          console.error('Error fetching subcategories:', error);
          return;
        }
        
        setSubcategories(data || []);
      } catch (err) {
        console.error('Exception fetching subcategories:', err);
      } finally {
        setLoading(prev => ({ ...prev, subcategories: false }));
      }
    };
    
    fetchSubcategories();
  }, [filters.category]);
  
  // Fetch artisans
  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(prev => ({ ...prev, artisans: true }));
      try {
        const { data, error } = await supabase
          .from('artisans')
          .select('id, name')
          .order('name');
        
        if (error) {
          console.error('Error fetching artisans:', error);
          return;
        }
        
        setArtisans(data || []);
      } catch (err) {
        console.error('Exception fetching artisans:', err);
      } finally {
        setLoading(prev => ({ ...prev, artisans: false }));
      }
    };
    
    fetchArtisans();
  }, []);
  
  // Initialize filters from props
  useEffect(() => {
    setFilters(initialFilters);
    if (initialFilters.priceRange) {
      setPriceRange(initialFilters.priceRange);
    }
  }, [initialFilters]);
  
  // Handle category change
  const handleCategoryChange = (id: string, checked: boolean) => {
    setFilters(prev => {
      const prevCategories = prev.category || [];
      
      if (checked) {
        const newFilters = { ...prev, category: [...prevCategories, id] };
        onApplyFilters(newFilters); // Apply filters immediately
        return newFilters;
      } else {
        // Remove category and any subcategories belonging to it
        const newCategories = prevCategories.filter(c => c !== id);
        const prevSubcategories = prev.subcategory || [];
        const newSubcategories = prevSubcategories.filter(sc => {
          const subcategory = subcategories.find(s => s.id === sc);
          return subcategory?.parent_id !== id;
        });
        
        const newFilters = { 
          ...prev, 
          category: newCategories,
          subcategory: newSubcategories
        };
        
        onApplyFilters(newFilters); // Apply filters immediately
        return newFilters;
      }
    });
  };
  
  // Handle subcategory change
  const handleSubcategoryChange = (id: string, checked: boolean) => {
    setFilters(prev => {
      const prevSubcategories = prev.subcategory || [];
      
      let newFilters;
      if (checked) {
        newFilters = { ...prev, subcategory: [...prevSubcategories, id] };
      } else {
        newFilters = { 
          ...prev, 
          subcategory: prevSubcategories.filter(sc => sc !== id)
        };
      }
      
      onApplyFilters(newFilters); // Apply filters immediately
      return newFilters;
    });
  };
  
  // Handle artisan change
  const handleArtisanChange = (id: string, checked: boolean) => {
    setFilters(prev => {
      const prevArtisans = prev.artisans || [];
      
      let newFilters;
      if (checked) {
        newFilters = { ...prev, artisans: [...prevArtisans, id] };
      } else {
        newFilters = { 
          ...prev, 
          artisans: prevArtisans.filter(a => a !== id)
        };
      }
      
      onApplyFilters(newFilters); // Apply filters immediately
      return newFilters;
    });
  };
  
  // Handle price range change
  const handlePriceRangeChange = (values: number[]) => {
    if (values.length === 2) {
      // Explicitly cast to tuple type to ensure TypeScript understands it has exactly 2 elements
      const range: [number, number] = [values[0], values[1]];
      setPriceRange(range);
      
      const newFilters = {
        ...filters,
        priceRange: range
      };
      
      setFilters(newFilters);
      onApplyFilters(newFilters); // Apply filters immediately
    }
  };
  
  // Apply filters
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };
  
  // Reset filters
  const handleReset = () => {
    // Define default price range as a proper tuple
    const defaultPriceRange: [number, number] = [0, 1000];
    
    const resetFilters: Partial<SearchFilters> = { 
      q: initialFilters.q,
      category: [],
      subcategory: [],
      artisans: [],
      priceRange: defaultPriceRange
    };
    
    setFilters(resetFilters);
    setPriceRange(defaultPriceRange);
    onApplyFilters(resetFilters);
    onClose();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[320px] sm:w-[400px] sm:max-w-none overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtres avancés</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Price Range Filter */}
          <div>
            <h3 className="font-medium mb-3">Fourchette de prix</h3>
            <div className="px-2">
              <Slider
                value={priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={handlePriceRangeChange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0]} €</span>
                <span>{priceRange[1]} €</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Catégories</h3>
            {loading.categories ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
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
            )}
          </div>
          
          <Separator />
          
          {/* Subcategories */}
          {(filters.category && filters.category.length > 0) && (
            <>
              <div>
                <h3 className="font-medium mb-3">Sous-catégories</h3>
                {loading.subcategories ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : subcategories.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune sous-catégorie disponible pour cette catégorie.
                  </p>
                )}
              </div>
              
              <Separator />
            </>
          )}
          
          {/* Artisans */}
          <div>
            <h3 className="font-medium mb-3">Artisans</h3>
            {loading.artisans ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
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
            )}
          </div>
        </div>
        
        <SheetFooter className="flex flex-row space-x-2 sm:space-x-0">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button onClick={handleApply}>
            Appliquer les filtres
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;
