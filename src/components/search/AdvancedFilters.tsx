
import { useState } from 'react';
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
import { categoriesData } from '@/data/categories';
import { SAMPLE_ARTISANS } from '@/models/types';
import {
  Tag,
  User,
  Clock,
  Package,
  MapPin,
  GemIcon,
  EuroIcon
} from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface AdvancedFiltersProps {
  onApply: () => void;
}

export function AdvancedFilters({ onApply }: AdvancedFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const form = useForm();
  
  // Liste des matériaux
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

  // Liste des origines géographiques
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

  // Options de délai de fabrication
  const fabricationTimes = [
    { id: 'ready', label: 'Prêt à expédier (1-3 jours)' },
    { id: 'fast', label: 'Fabrication rapide (3-7 jours)' },
    { id: 'standard', label: 'Fabrication standard (7-14 jours)' },
    { id: 'custom', label: 'Sur-mesure (14+ jours)' }
  ];

  const handleReset = () => {
    setPriceRange([0, 500]);
    form.reset();
  };

  const handleApplyFilters = () => {
    console.log('Applied filters:', {
      priceRange,
      form: form.getValues()
    });
    onApply();
  };

  return (
    <Form {...form}>
      <form className="space-y-6 py-4">
        {/* Catégorie & Sous-catégorie */}
        <AccordionItem value="categories" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              <span>Catégories</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-6 pr-2 py-2 space-y-4">
              <Accordion type="multiple" className="w-full">
                {categoriesData.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="py-2 text-sm">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center space-x-2">
                            <Checkbox id={subcategory.id} />
                            <label
                              htmlFor={subcategory.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {subcategory.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Artisan */}
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
                  <Checkbox id={`artisan-${artisan.id}`} />
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
                defaultValue={[0, 500]}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Disponibilité */}
        <AccordionItem value="availability" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              <span>Disponibilité</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-6 pr-2 py-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" />
                <label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  En stock
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="on-order" />
                <label
                  htmlFor="on-order"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sur commande
                </label>
              </div>
            </div>
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

        {/* Délai de fabrication */}
        <AccordionItem value="fabrication" className="border-b">
          <AccordionTrigger className="flex items-center py-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Délai de fabrication</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-6 pr-2 py-2 space-y-2">
              {fabricationTimes.map((time) => (
                <div key={time.id} className="flex items-center space-x-2">
                  <Checkbox id={`time-${time.id}`} />
                  <label
                    htmlFor={`time-${time.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {time.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <Separator />

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
          >
            Réinitialiser
          </Button>
          <Button 
            type="button" 
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white"
            onClick={handleApplyFilters}
          >
            Appliquer les filtres
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AdvancedFilters;
