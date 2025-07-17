import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdvancedFilters from './AdvancedFilters';
import { SearchFilters } from '@/services/search';
import { useTranslations } from '@/lib/i18n';

interface SearchBarProps {
  onSearch: (filters: Partial<SearchFilters>) => void;
  initialFilters?: Partial<SearchFilters>;
  variant?: 'default' | 'minimal' | 'expanded';
  autoFocus?: boolean;
  className?: string;
}

export const SearchBar = ({
  onSearch,
  initialFilters = { q: '', category: [], subcategory: [] },
  variant = 'default',
  autoFocus = false,
  className = '',
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.q || '');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslations();
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (location.pathname !== '/search') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      return;
    }
    
    onSearch({ ...initialFilters, q: searchQuery });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    if (!searchQuery) return;
    
    onSearch({ ...initialFilters, q: '' });
  };
  
  const handleApplyFilters = (filters: Partial<SearchFilters>) => {
    onSearch({ ...filters, q: searchQuery });
  };
  
  let containerClasses = 'flex items-center gap-2 ';
  let inputClasses = 'flex-grow ';
  
  switch (variant) {
    case 'minimal':
      containerClasses += 'max-w-xs';
      break;
    case 'expanded':
      containerClasses += 'w-full max-w-4xl';
      inputClasses += 'py-6 text-lg';
      break;
    default:
      containerClasses += 'w-full max-w-md';
  }
  
  return (
    <>
      <form 
        onSubmit={handleSubmit} 
        className={`${containerClasses} ${className}`}
      >
        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            type="search"
            placeholder={t('search_products', 'Search products, artisans, etc.')}
            value={searchQuery}
            onChange={handleInputChange}
            className={`pr-8 ${inputClasses}`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <Button type="submit" size="icon">
          <SearchIcon size={18} />
        </Button>
        
        <Button 
          type="button" 
          size="icon" 
          variant="outline"
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal size={18} />
        </Button>
      </form>
      
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={initialFilters}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default SearchBar;
