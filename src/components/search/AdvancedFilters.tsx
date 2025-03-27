
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { categoriesData } from '@/data/categories';
import { SAMPLE_ARTISANS } from '@/models/types';
import { SearchFilters } from '@/services/searchService';
import {
  Tag,
  User,
  Clock,
  Package,
  MapPin,
  GemIcon,
  EuroIcon,
  Star
} from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AdvancedFiltersProps {
  onApply: (filters: Partial<SearchFilters>) => void;
  initialFilters?: Partial<SearchFilters>;
}

export function AdvancedFilters({ onApply, initialFilters = {} }: AdvancedFiltersProps) {
  // Category states
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialFilters.category);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    initialFilters.subcategory ? [initialFilters.subcategory] : []
  );
  
  // Artisan state
  const [selectedArtisans, setSelectedArtisans] = useState<string[]>(
    initialFilters.artisans || []
  );
  
  // Price range state
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice !== undefined ? initialFilters.minPrice : 0,
    initialFilters.maxPrice !== undefined ? initialFilters.maxPrice : 500
  ]);
  
  // Rating state
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    initialFilters.rating
  );
  
  // Delivery time state
  const [selectedDelivery, setSelectedDelivery] = useState<string | undefined>(
    initialFilters.delivery
  );
  
  // Materials
  const materials = [
    { id: 'wood', label: 'Bois' },
    { id: 'leather', label: 'Cuir' },
    { id: 'metal', label: 'Métal' },
    { id: 'ceramic', label: 'Céramique' },
    { id: 'wool', label: 'Laine' },
    { id: 'cotton', label: 'Coton' },
    { id: 'clay', label: 'Argile' },
    { id: 'glass', label: 'Verre' }
  ];
  
  // Geographical origins
  const origins = [
    { id: 'marrakech', label: 'Marrakech' },
    { id: 'fes', label: 'Fès' },
    { id: 'rabat', label: 'Rabat' },
    { id: 'essaouira', label: 'Essaouira' },
    { id: 'chefchaouen', label: 'Chefchaouen' },
    { id: 'casablanca', label: 'Casablanca' },
    { id: 'tangier', label: 'Tanger' },
    { id: 'tetouan', label: 'Tétouan' }
  ];
  
  // Fabrication times
  const fabricationTimes = [
    { id: 'express', label: 'Prêt à expédier (1-3 jours)' },
    { id: 'standard', label: 'Fabrication standard (3-7 jours)' },
    { id: 'economy', label: 'Sur-mesure (7+ jours)' }
  ];

  // Apply filters automatically when selections change
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedSubcategories, selectedArtisans, selectedRating, selectedDelivery]);

  // Also apply filters when price range changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);
    return () => clearTimeout(timer);
  }, [priceRange]);

  // Update selected category
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategory(categoryId);
      // Reset subcategories when main category changes
      setSelectedSubcategories([]);
    } else {
      setSelectedCategory(undefined);
    }
  };
  
  // Update selected subcategories - now allows multiple selections
  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubcategories(prev => [...prev, subcategoryId]);
    } else {
      setSelectedSubcategories(prev => prev.filter(id => id !== subcategoryId));
    }
  };
  
  // Update selected artisans
  const handleArtisanChange = (artisanId: string, checked: boolean) => {
    if (checked) {
      setSelectedArtisans(prev => [...prev, artisanId]);
    } else {
      setSelectedArtisans(prev => prev.filter(id => id !== artisanId));
    }
  };
  
  // Reset all filters and apply immediately
  const handleReset = () => {
    setSelectedCategory(undefined);
    setSelectedSubcategories([]);
    setSelectedArtisans([]);
    setPriceRange([0, 500]);
    setSelectedRating(undefined);
    setSelectedDelivery(undefined);
    
    // Apply empty filters
    onApply({});
  };
  
  // Apply filters automatically - called by useEffect hooks
  const applyFilters = () => {
    const filters: Partial<SearchFilters> = {
      category: selectedCategory,
      subcategory: selectedSubcategories.length > 0 ? selectedSubcategories[0] : undefined,
      artisans: selectedArtisans.length > 0 ? selectedArtisans : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      rating: selectedRating,
      delivery: selectedDelivery,
    };
    
    onApply(filters);
  };
  
  // Update when initialFilters change
  useEffect(() => {
    if (initialFilters.category !== undefined) {
      setSelectedCategory(initialFilters.category);
    }
    
    if (initialFilters.subcategory !== undefined) {
      setSelectedSubcategories([initialFilters.subcategory]);
    }
    
    if (initialFilters.artisans !== undefined) {
      setSelectedArtisans(initialFilters.artisans);
    }
    
    if (initialFilters.minPrice !== undefined || initialFilters.maxPrice !== undefined) {
      setPriceRange([
        initialFilters.minPrice !== undefined ? initialFilters.minPrice : 0,
        initialFilters.maxPrice !== undefined ? initialFilters.maxPrice : 500
      ]);
    }
    
    if (initialFilters.rating !== undefined) {
      setSelectedRating(initialFilters.rating);
    }
    
    if (initialFilters.delivery !== undefined) {
      setSelectedDelivery(initialFilters.delivery);
    }
  }, [initialFilters]);

  return (
    <div className="space-y-6 py-4">
      {/* Catégorie & Sous-catégorie */}
      <Accordion type="multiple" className="w-full" defaultValue={["categories"]}>
        <AccordionItem value="categories" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              <span>Catégories</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-6 pr-2 py-2 space-y-4">
              <div className="space-y-2">
                {categoriesData.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={selectedCategory === category.id}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
              
              {selectedCategory && (
                <div className="mt-4 pl-4 space-y-2">
                  <p className="text-sm font-medium mb-2">Sous-catégories</p>
                  {categoriesData
                    .find(cat => cat.id === selectedCategory)
                    ?.subcategories.map((subCategory) => (
                      <div key={subCategory.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`subcategory-${subCategory.id}`}
                          checked={selectedSubcategories.includes(subCategory.id)}
                          onCheckedChange={(checked) => 
                            handleSubcategoryChange(subCategory.id, checked === true)
                          }
                        />
                        <label
                          htmlFor={`subcategory-${subCategory.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subCategory.name}
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Artisans */}
        <AccordionItem value="artisans" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Artisans</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-6 pr-2 py-2 space-y-2 max-h-60 overflow-y-auto">
              {SAMPLE_ARTISANS.map((artisan) => (
                <div key={artisan.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`artisan-${artisan.id}`}
                    checked={selectedArtisans.includes(artisan.id)}
                    onCheckedChange={(checked) => 
                      handleArtisanChange(artisan.id, checked === true)
                    }
                  />
                  <label
                    htmlFor={`artisan-${artisan.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {artisan.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Prix */}
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <EuroIcon className="h-4 w-4 mr-2" />
              <span>Prix</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 py-4 space-y-4">
              <div className="flex justify-between">
                <span>{priceRange[0]} €</span>
                <span>{priceRange[1]} €</span>
              </div>
              <Slider
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Customer Rating */}
        <AccordionItem value="rating" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              <span>Avis clients</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              className="pl-6 pr-2 py-2 space-y-2"
              value={selectedRating?.toString()}
              onValueChange={(value) => setSelectedRating(parseInt(value))}
            >
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="flex items-center">
                    {rating}+ <Star className="h-3 w-3 ml-1 fill-yellow-500 text-yellow-500" />
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Délai de livraison */}
        <AccordionItem value="delivery" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Délai de livraison</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              className="pl-6 pr-2 py-2 space-y-2"
              value={selectedDelivery}
              onValueChange={setSelectedDelivery}
            >
              {fabricationTimes.map((time) => (
                <div key={time.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={time.id} id={`time-${time.id}`} />
                  <Label htmlFor={`time-${time.id}`}>
                    {time.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Matériau */}
        <AccordionItem value="material" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <GemIcon className="h-4 w-4 mr-2" />
              <span>Matériaux</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-6 pr-2 py-2 space-y-2 grid grid-cols-2">
              {materials.map((material) => (
                <div key={material.id} className="flex items-center space-x-2">
                  <Checkbox id={`material-${material.id}`} />
                  <label
                    htmlFor={`material-${material.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {material.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Origine géographique */}
        <AccordionItem value="origin" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Origine</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-6 pr-2 py-2 space-y-2 grid grid-cols-2">
              {origins.map((origin) => (
                <div key={origin.id} className="flex items-center space-x-2">
                  <Checkbox id={`origin-${origin.id}`} />
                  <label
                    htmlFor={`origin-${origin.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {origin.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <div className="flex justify-center">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          className="w-full"
        >
          Réinitialiser tous les filtres
        </Button>
      </div>
    </div>
  );
}

export default AdvancedFilters;
