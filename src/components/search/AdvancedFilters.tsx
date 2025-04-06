
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Category, Subcategory } from '@/models/types';

interface AdvancedFiltersProps {
  filters: {
    query: string;
    selectedCategories: string[];
    selectedSubcategories: string[];
    priceRange: [number, number];
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
}

export function AdvancedFilters({ filters, onFilterChange }: AdvancedFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true
  });
  const [loading, setLoading] = useState(true);
  
  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesError) {
          throw categoriesError;
        }
        
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);
  
  // Load subcategories
  useEffect(() => {
    const loadSubcategories = async () => {
      setLoading(true);
      try {
        const { data: subcategoriesData, error } = await supabase
          .from('subcategories')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setSubcategories(subcategoriesData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading subcategories:', error);
        setLoading(false);
      }
    };
    
    loadSubcategories();
  }, []);
  
  // Toggle section open/closed
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newSelectedCategories = [...filters.selectedCategories];
    
    if (checked) {
      newSelectedCategories.push(categoryId);
    } else {
      newSelectedCategories = newSelectedCategories.filter(id => id !== categoryId);
      
      // Also remove any subcategories related to this category
      const categorySubcatIds = subcategories
        .filter(sc => sc.parent_id === categoryId)
        .map(sc => sc.id);
      
      const newSelectedSubcategories = filters.selectedSubcategories.filter(
        id => !categorySubcatIds.includes(id)
      );
      
      onFilterChange({
        selectedCategories: newSelectedCategories,
        selectedSubcategories: newSelectedSubcategories
      });
      return;
    }
    
    onFilterChange({ selectedCategories: newSelectedCategories });
  };
  
  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    let newSelectedSubcategories = [...filters.selectedSubcategories];
    
    if (checked) {
      newSelectedSubcategories.push(subcategoryId);
      
      // Make sure parent category is also selected
      const subcategory = subcategories.find(sc => sc.id === subcategoryId);
      if (subcategory && !filters.selectedCategories.includes(subcategory.parent_id)) {
        const newSelectedCategories = [...filters.selectedCategories, subcategory.parent_id];
        onFilterChange({
          selectedCategories: newSelectedCategories,
          selectedSubcategories: newSelectedSubcategories
        });
        return;
      }
    } else {
      newSelectedSubcategories = newSelectedSubcategories.filter(id => id !== subcategoryId);
    }
    
    onFilterChange({ selectedSubcategories: newSelectedSubcategories });
  };
  
  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    onFilterChange({ priceRange: values as [number, number] });
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    onFilterChange({
      selectedCategories: [],
      selectedSubcategories: [],
      priceRange: [0, 1000]
    });
  };

  // Get subcategories for a specific category
  const getCategorySubcategories = (categoryId: string) => {
    return subcategories.filter(sc => sc.parent_id === categoryId);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-5">
            {/* Categories Section */}
            <Collapsible open={openSections.categories}>
              <div className="flex justify-between items-center pb-2">
                <h3 className="font-medium">Catégories</h3>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => toggleSection('categories')}
                  >
                    {openSections.categories ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="space-y-3 pt-1 pl-1">
                  {loading ? (
                    <div className="text-sm text-muted-foreground pl-6">Chargement...</div>
                  ) : (
                    categories.map(category => {
                      const categorySubcategories = getCategorySubcategories(category.id);
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category.id}`} 
                              checked={filters.selectedCategories.includes(category.id)}
                              onCheckedChange={(checked) => 
                                handleCategoryChange(category.id, checked === true)
                              }
                            />
                            <Label 
                              htmlFor={`category-${category.id}`}
                              className="cursor-pointer text-sm"
                            >
                              {category.name}
                            </Label>
                          </div>
                          
                          {/* Render subcategories if the category is selected */}
                          {filters.selectedCategories.includes(category.id) && categorySubcategories.length > 0 && (
                            <div className="ml-6 space-y-1">
                              {categorySubcategories.map(subcategory => (
                                <div key={subcategory.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`subcategory-${subcategory.id}`} 
                                    checked={filters.selectedSubcategories.includes(subcategory.id)}
                                    onCheckedChange={(checked) => 
                                      handleSubcategoryChange(subcategory.id, checked === true)
                                    }
                                  />
                                  <Label 
                                    htmlFor={`subcategory-${subcategory.id}`}
                                    className="cursor-pointer text-xs text-muted-foreground"
                                  >
                                    {subcategory.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Price Range Section */}
            <Collapsible open={openSections.price}>
              <div className="flex justify-between items-center pb-2">
                <h3 className="font-medium">Prix</h3>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => toggleSection('price')}
                  >
                    {openSections.price ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="space-y-4 pt-1">
                  <div className="pl-1">
                    <Slider 
                      defaultValue={[0, 1000]} 
                      value={filters.priceRange} 
                      onValueChange={handlePriceChange} 
                      min={0} 
                      max={1000} 
                      step={10}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>Min: {filters.priceRange[0]}€</div>
                    <div>Max: {filters.priceRange[1]}€</div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Reset Filters Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2" 
              onClick={handleResetFilters}
              disabled={
                filters.selectedCategories.length === 0 &&
                filters.selectedSubcategories.length === 0 &&
                filters.priceRange[0] === 0 && 
                filters.priceRange[1] === 1000
              }
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
