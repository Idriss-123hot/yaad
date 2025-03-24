
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { Separator } from '@/components/ui/separator';
import { SearchBar } from '@/components/search/SearchBar';
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
  X,
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { categoriesData } from '@/data/categories';
import { SAMPLE_ARTISANS, Product } from '@/models/types';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import { useToast } from '@/hooks/use-toast';
import { 
  searchProducts, 
  getFiltersFromURL, 
  filtersToURLParams,
  SearchFilters,
  debouncedSearch
} from '@/services/searchService';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Get filters from URL
  const initialFilters = getFiltersFromURL(searchParams);
  
  // State for filters
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  
  // Refs
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore]);
  
  // Load products on mount and when filters change
  useEffect(() => {
    const newFilters = getFiltersFromURL(searchParams);
    setFilters(newFilters);
    setCurrentPage(newFilters.page || 1);
    fetchProducts(newFilters);
  }, [searchParams]);
  
  // Initial fetch
  const fetchProducts = async (currentFilters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { products: fetchedProducts, total } = await searchProducts({
        ...currentFilters,
        page: 1,
        limit: 20
      });
      
      setProducts(fetchedProducts);
      setTotalProducts(total);
      setHasMore(fetchedProducts.length < total);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      toast({
        variant: "destructive",
        title: "Error loading products",
        description: "Please try again or adjust your search filters.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load more products for infinite scroll
  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);
    
    try {
      const { products: moreProducts, total } = await searchProducts({
        ...filters,
        page: nextPage,
        limit: 20
      });
      
      setProducts(prev => [...prev, ...moreProducts]);
      setCurrentPage(nextPage);
      setHasMore(products.length + moreProducts.length < total);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error loading more products",
        description: "Please try again.",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Update URL when filters change
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    const params = filtersToURLParams(updatedFilters);
    setSearchParams(params);
  };
  
  // Handle search input
  const handleSearch = (term: string) => {
    updateFilters({ q: term });
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    updateFilters({ sort: value });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };
  
  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };
  
  // Apply filters from Advanced Filters component
  const handleApplyFilters = (appliedFilters: Partial<SearchFilters>) => {
    updateFilters(appliedFilters);
    setIsMobileFiltersOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header & Search Bar */}
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold">Discover Our Products</h1>
            <p className="text-muted-foreground mt-2 mb-4">
              Explore our collection of handcrafted Moroccan artisanal products
            </p>
            
            <SearchBar 
              className="mt-4" 
              initialSearchTerm={filters.q || ''} 
              onSearch={handleSearch}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Panel - Desktop */}
            <div className={`w-full md:w-1/3 lg:w-1/4 md:block ${isMobileFiltersOpen ? 'block' : 'hidden'}`}>
              <div className="sticky top-24 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium text-lg">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>

                <Separator className="my-4" />

                <AdvancedFilters 
                  initialFilters={filters}
                  onApply={handleApplyFilters}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              {/* Mobile Filters Button & Sort */}
              <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    onClick={toggleMobileFilters}
                    className="md:hidden mr-2"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Searching...' : `${totalProducts} products found`}
                  </p>
                </div>
                
                <Select 
                  value={filters.sort || 'featured'} 
                  onValueChange={handleSortChange}
                >
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
              
              {/* Active Filters */}
              {(filters.q || filters.category || filters.subcategory || filters.artisans?.length || 
                filters.rating || filters.delivery || 
                (filters.minPrice !== undefined && filters.minPrice > 0) || 
                (filters.maxPrice !== undefined && filters.maxPrice < 500)) && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {filters.q && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Search: {filters.q}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilters({ q: undefined })}
                      />
                    </Badge>
                  )}
                  
                  {filters.category && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      {categoriesData.find(c => c.id === filters.category)?.name || 'Category'}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilters({ category: undefined })}
                      />
                    </Badge>
                  )}
                  
                  {filters.subcategory && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      {categoriesData
                        .flatMap(c => c.subcategories)
                        .find(s => s.id === filters.subcategory)?.name || 'Subcategory'}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilters({ subcategory: undefined })}
                      />
                    </Badge>
                  )}
                  
                  {filters.artisans?.map(artisanId => (
                    <Badge key={artisanId} variant="outline" className="flex items-center gap-1">
                      {SAMPLE_ARTISANS.find(a => a.id === artisanId)?.name || 'Artisan'}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => {
                          updateFilters({ 
                            artisans: filters.artisans?.filter(id => id !== artisanId) 
                          })
                        }}
                      />
                    </Badge>
                  ))}
                  
                  {filters.rating && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      {filters.rating}+ <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilters({ rating: undefined })}
                      />
                    </Badge>
                  )}
                  
                  {filters.delivery && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      {filters.delivery === 'express' 
                        ? 'Express Delivery' 
                        : filters.delivery === 'standard' 
                          ? 'Standard Delivery' 
                          : 'Economy Delivery'}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilters({ delivery: undefined })}
                      />
                    </Badge>
                  )}
                  
                  {(filters.minPrice !== undefined && filters.minPrice > 0) || 
                  (filters.maxPrice !== undefined && filters.maxPrice < 500) ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Price: {filters.minPrice || 0}€ - {filters.maxPrice || 500}€
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                      />
                    </Badge>
                  ) : null}
                  
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
                    Clear All
                  </Button>
                </div>
              )}
              
              {/* Products Display */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-10 h-10 border-4 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2 text-red-600">{error}</h3>
                  <Button variant="outline" onClick={() => fetchProducts(filters)}>
                    Try Again
                  </Button>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => {
                    if (products.length === index + 1) {
                      return (
                        <div ref={lastProductElementRef} key={product.id}>
                          <ProductCard product={product} />
                        </div>
                      );
                    } else {
                      return <ProductCard key={product.id} product={product} />;
                    }
                  })}
                </div>
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
              
              {/* Loading more indicator */}
              {isLoadingMore && (
                <div className="flex justify-center items-center mt-8 mb-4">
                  <div className="w-8 h-8 border-4 border-terracotta-600 border-t-transparent rounded-full animate-spin"></div>
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
