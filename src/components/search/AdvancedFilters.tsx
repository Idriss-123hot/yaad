
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  parent_id: string;
}

interface Props {
  onApply: (filters: any) => void;
  initialFilters?: {
    q?: string;
    category?: string;
    subcategory?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export function AdvancedFilters({ onApply, initialFilters = {} }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialFilters.subcategory || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice || 0,
    initialFilters.maxPrice || 1000,
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch categories and subcategories from database
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          return;
        }
        
        // Fetch subcategories - using direct query instead of 'from'
        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .rpc('get_subcategories')
          .select('*')
          .order('name');
          
        if (subcategoriesError) {
          console.error('Error fetching subcategories:', subcategoriesError);
          
          // Fallback to direct query if RPC doesn't exist yet
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('subcategories')
            .select('*')
            .order('name');
            
          if (fallbackError) {
            console.error('Error in fallback subcategories query:', fallbackError);
            return;
          }
          
          if (fallbackData) {
            const typedSubcategories = fallbackData.map(sub => ({
              id: sub.id,
              name: sub.name,
              parent_id: sub.parent_id
            }));
            setSubcategories(typedSubcategories);
            
            // Group subcategories by parent_id
            const subcategoriesByParent: Record<string, Subcategory[]> = {};
            typedSubcategories.forEach(sub => {
              if (!subcategoriesByParent[sub.parent_id]) {
                subcategoriesByParent[sub.parent_id] = [];
              }
              subcategoriesByParent[sub.parent_id].push(sub);
            });
            
            // Attach subcategories to their parent categories
            const enrichedCategories = categoriesData.map(cat => ({
              ...cat,
              subcategories: subcategoriesByParent[cat.id] || []
            }));
            
            setCategories(enrichedCategories);
          }
        } else if (subcategoriesData) {
          const typedSubcategories = subcategoriesData.map(sub => ({
            id: sub.id,
            name: sub.name,
            parent_id: sub.parent_id
          }));
          setSubcategories(typedSubcategories);
          
          // Group subcategories by parent_id
          const subcategoriesByParent: Record<string, Subcategory[]> = {};
          typedSubcategories.forEach(sub => {
            if (!subcategoriesByParent[sub.parent_id]) {
              subcategoriesByParent[sub.parent_id] = [];
            }
            subcategoriesByParent[sub.parent_id].push(sub);
          });
          
          // Attach subcategories to their parent categories
          const enrichedCategories = categoriesData.map(cat => ({
            ...cat,
            subcategories: subcategoriesByParent[cat.id] || []
          }));
          
          setCategories(enrichedCategories);
        }
      } catch (error) {
        console.error('Error in fetching filters data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
    
  // Apply filters whenever they change (debounced)
  const debouncedApplyFilters = debounce(() => {
    onApply({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      q: initialFilters.q // maintain search query
    });
  }, 500);
  
  // Initialize filters from URL parameters
  useEffect(() => {
    if (initialFilters) {
      setSelectedCategory(initialFilters.category || '');
      setSelectedSubcategory(initialFilters.subcategory || '');
      setPriceRange([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 1000,
      ]);
    }
  }, [initialFilters]);
  
  // Apply filters when selection changes
  useEffect(() => {
    debouncedApplyFilters();
  }, [selectedCategory, selectedSubcategory, priceRange]);
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory('');
      setSelectedSubcategory('');
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory('');
    }
  };
  
  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? '' : subcategoryId);
  };

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <Accordion type="single" collapsible defaultValue="categories" className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium py-2">
            Catégories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {loading ? (
                <div className="py-2 text-sm text-muted-foreground">Chargement des catégories...</div>
              ) : categories.length === 0 ? (
                <div className="py-2 text-sm text-muted-foreground">Aucune catégorie disponible</div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={selectedCategory === category.id}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <Label 
                        htmlFor={`category-${category.id}`}
                        className="cursor-pointer text-sm font-medium"
                      >
                        {category.name}
                      </Label>
                    </div>
                    
                    {/* Show subcategories when parent category is selected */}
                    {selectedCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                      <div className="ml-6 space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`subcategory-${subcategory.id}`} 
                              checked={selectedSubcategory === subcategory.id}
                              onCheckedChange={() => handleSubcategoryChange(subcategory.id)}
                            />
                            <Label 
                              htmlFor={`subcategory-${subcategory.id}`}
                              className="cursor-pointer text-sm"
                            >
                              {subcategory.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator />
      
      {/* Price Range Section */}
      <Accordion type="single" collapsible defaultValue="price" className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium py-2">
            Prix
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{priceRange[0]}€</span>
                <span className="text-sm font-medium">{priceRange[1]}€</span>
              </div>
              <Slider
                defaultValue={priceRange}
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="py-4"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator />
      
      {/* Additional filters could be added here */}
    </div>
  );
}

export default AdvancedFilters;
