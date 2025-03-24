
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Search as SearchIcon, 
  SlidersHorizontal, 
  Star, 
  X 
} from 'lucide-react';
import { categoriesData } from '@/data/categories';
import { SAMPLE_PRODUCTS, SAMPLE_ARTISANS, Product } from '@/models/types';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseProductsToProducts } from '@/utils/productMappers';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedArtisans, setSelectedArtisans] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [deliveryTimeFilter, setDeliveryTimeFilter] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Extract URL parameters
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const artisan = searchParams.get('artisan');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const delivery = searchParams.get('delivery');
    const search = searchParams.get('q');

    if (category) setSelectedMainCategory(category);
    if (subcategory) setSelectedSubCategories([subcategory]);
    if (artisan) setSelectedArtisans([artisan]);
    if (minPrice && maxPrice) setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    if (rating) setRatingFilter(parseInt(rating));
    if (delivery) setDeliveryTimeFilter(delivery);
    if (search) setSearchTerm(search);
    
    // Fetch products from the database
    fetchProducts(category, subcategory, artisan);
  }, [searchParams]);

  // Function to fetch products from Supabase
  const fetchProducts = async (category?: string | null, subcategory?: string | null, artisan?: string | null) => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('products').select(`
        *,
        artisan:artisan_id(*),
        category:category_id(*)
      `);
      
      // Apply backend filters if available
      if (category) {
        // This would require a proper category structure in the database
        // For now we're just using the sample data
      }
      
      if (artisan) {
        query = query.eq('artisan_id', artisan);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        // Fallback to sample data
        setProducts(SAMPLE_PRODUCTS);
        setFilteredProducts(SAMPLE_PRODUCTS);
      } else if (data) {
        const mappedProducts = data.length > 0 ? mapDatabaseProductsToProducts(data) : SAMPLE_PRODUCTS;
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error in product fetch:', error);
      // Fallback to sample data
      setProducts(SAMPLE_PRODUCTS);
      setFilteredProducts(SAMPLE_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply client-side filters whenever filter state changes
  useEffect(() => {
    let filtered = [...products];
    
    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedMainCategory) {
      filtered = filtered.filter(p => {
        const category = categoriesData.find(c => c.id === selectedMainCategory);
        return category && p.category.includes(category.name);
      });
    }
    
    // Subcategory filter (would require proper data structure)
    if (selectedSubCategories.length > 0) {
      // This is a placeholder for real subcategory filtering
    }
    
    // Artisan filter
    if (selectedArtisans.length > 0) {
      filtered = filtered.filter(p => selectedArtisans.includes(p.artisanId));
    }
    
    // Price range filter
    filtered = filtered.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Rating filter
    if (ratingFilter) {
      filtered = filtered.filter(p => p.rating >= ratingFilter);
    }
    
    // Delivery time filter (placeholder - would need actual delivery time data)
    if (deliveryTimeFilter) {
      // This is a placeholder for real delivery time filtering
    }
    
    setFilteredProducts(filtered);
  }, [
    products, 
    searchTerm, 
    selectedMainCategory, 
    selectedSubCategories, 
    selectedArtisans, 
    priceRange, 
    ratingFilter, 
    deliveryTimeFilter
  ]);

  // Update URL with filters for shareable links
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('q', searchTerm);
    if (selectedMainCategory) params.set('category', selectedMainCategory);
    if (selectedSubCategories.length > 0) params.set('subcategory', selectedSubCategories[0]);
    if (selectedArtisans.length > 0) params.set('artisan', selectedArtisans[0]);
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());
    if (ratingFilter) params.set('rating', ratingFilter.toString());
    if (deliveryTimeFilter) params.set('delivery', deliveryTimeFilter);
    
    setSearchParams(params);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMainCategory(null);
    setSelectedSubCategories([]);
    setSelectedArtisans([]);
    setPriceRange([0, 500]);
    setRatingFilter(null);
    setDeliveryTimeFilter(null);
    setSearchParams({});
  };

  // Toggle mobile filters panel
  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold">Product Search</h1>
            <p className="text-muted-foreground mt-2">
              Explore our collection of handcrafted Moroccan products
            </p>
          </div>

          {/* Search Input */}
          <div className="flex items-center mb-8 gap-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 w-full"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={updateSearchParams}>Search</Button>
            <Button 
              variant="outline" 
              onClick={toggleMobileFilters}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Panel - Desktop */}
            <div className={`w-full md:w-1/4 md:block ${isMobileFiltersOpen ? 'block' : 'hidden'}`}>
              <div className="sticky top-24 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium text-lg">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>

                <Separator className="my-4" />

                {/* Main Categories */}
                <Accordion type="single" collapsible defaultValue="categories">
                  <AccordionItem value="categories">
                    <AccordionTrigger>Main Categories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categoriesData.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedMainCategory === category.id}
                              onCheckedChange={(checked) => {
                                setSelectedMainCategory(checked ? category.id : null);
                                // Reset subcategories if main category changes
                                if (checked) {
                                  setSelectedSubCategories([]);
                                }
                              }}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-2 text-sm font-medium"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Subcategories - only show if a main category is selected */}
                {selectedMainCategory && (
                  <Accordion type="single" collapsible defaultValue="subcategories">
                    <AccordionItem value="subcategories">
                      <AccordionTrigger>Subcategories</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {categoriesData
                            .find(cat => cat.id === selectedMainCategory)
                            ?.subcategories.map((subCategory) => (
                              <div key={subCategory.id} className="flex items-center">
                                <Checkbox
                                  id={`subcategory-${subCategory.id}`}
                                  checked={selectedSubCategories.includes(subCategory.id)}
                                  onCheckedChange={(checked) => {
                                    setSelectedSubCategories(
                                      checked
                                        ? [...selectedSubCategories, subCategory.id]
                                        : selectedSubCategories.filter(id => id !== subCategory.id)
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={`subcategory-${subCategory.id}`}
                                  className="ml-2 text-sm font-medium"
                                >
                                  {subCategory.name}
                                </label>
                              </div>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* Artisans */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="artisans">
                    <AccordionTrigger>Artisans</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {SAMPLE_ARTISANS.map((artisan) => (
                          <div key={artisan.id} className="flex items-center">
                            <Checkbox
                              id={`artisan-${artisan.id}`}
                              checked={selectedArtisans.includes(artisan.id)}
                              onCheckedChange={(checked) => {
                                setSelectedArtisans(
                                  checked
                                    ? [...selectedArtisans, artisan.id]
                                    : selectedArtisans.filter(id => id !== artisan.id)
                                );
                              }}
                            />
                            <label
                              htmlFor={`artisan-${artisan.id}`}
                              className="ml-2 text-sm font-medium"
                            >
                              {artisan.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Price Range */}
                <Accordion type="single" collapsible defaultValue="price">
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={500}
                          step={10}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{priceRange[0]}€</span>
                          <span className="text-sm">{priceRange[1]}€</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Customer Rating */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="rating">
                    <AccordionTrigger>Customer Rating</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center">
                            <Checkbox
                              id={`rating-${rating}`}
                              checked={ratingFilter === rating}
                              onCheckedChange={(checked) => {
                                setRatingFilter(checked ? rating : null);
                              }}
                            />
                            <label
                              htmlFor={`rating-${rating}`}
                              className="ml-2 text-sm font-medium flex items-center"
                            >
                              {rating}+ <Star className="h-3 w-3 ml-1 fill-yellow-500 text-yellow-500" />
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Delivery Time */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="delivery">
                    <AccordionTrigger>Delivery Time</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="delivery-express"
                            checked={deliveryTimeFilter === 'express'}
                            onCheckedChange={(checked) => {
                              setDeliveryTimeFilter(checked ? 'express' : null);
                            }}
                          />
                          <label
                            htmlFor="delivery-express"
                            className="ml-2 text-sm font-medium"
                          >
                            Express (1-3 days)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="delivery-standard"
                            checked={deliveryTimeFilter === 'standard'}
                            onCheckedChange={(checked) => {
                              setDeliveryTimeFilter(checked ? 'standard' : null);
                            }}
                          />
                          <label
                            htmlFor="delivery-standard"
                            className="ml-2 text-sm font-medium"
                          >
                            Standard (3-7 days)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="delivery-economy"
                            checked={deliveryTimeFilter === 'economy'}
                            onCheckedChange={(checked) => {
                              setDeliveryTimeFilter(checked ? 'economy' : null);
                            }}
                          />
                          <label
                            htmlFor="delivery-economy"
                            className="ml-2 text-sm font-medium"
                          >
                            Economy (7-14 days)
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button
                  onClick={() => {
                    updateSearchParams();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="w-full mt-4 bg-terracotta-600 hover:bg-terracotta-700 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="w-full md:w-3/4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-10 h-10 border-4 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredProducts.length} products
                    </p>
                    <Select defaultValue="featured">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default Search;
