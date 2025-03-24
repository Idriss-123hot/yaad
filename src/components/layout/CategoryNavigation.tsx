
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categoriesData } from '@/data/categories';
import { cn } from '@/lib/utils';

interface CategoryNavigationProps {
  onClose: () => void;
}

export function CategoryNavigation({ onClose }: CategoryNavigationProps) {
  const [activeMainCategory, setActiveMainCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  const handleMainCategoryHover = (category: string) => {
    setActiveMainCategory(category);
    setActiveSubCategory(null);
  };

  const handleSubCategoryHover = (subCategory: string) => {
    setActiveSubCategory(subCategory);
  };

  return (
    <div 
      className="absolute left-0 right-0 top-full bg-white shadow-lg border-t z-50 animate-fade-in"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Main Categories */}
          <div className="w-1/4 py-6 border-r">
            <ul className="space-y-1">
              {categoriesData.map((category) => (
                <li key={category.id}>
                  <button
                    className={cn(
                      "w-full text-left px-6 py-2 text-sm hover:bg-cream-50 hover:text-terracotta-600 transition-colors",
                      activeMainCategory === category.id && "bg-cream-50 text-terracotta-600"
                    )}
                    onMouseEnter={() => handleMainCategoryHover(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sub Categories */}
          {activeMainCategory && (
            <div className="w-1/4 py-6 border-r">
              <ul className="space-y-1">
                {categoriesData
                  .find(cat => cat.id === activeMainCategory)
                  ?.subcategories.map((subCategory) => (
                    <li key={subCategory.id}>
                      <button
                        className={cn(
                          "w-full text-left px-6 py-2 text-sm hover:bg-cream-50 hover:text-terracotta-600 transition-colors",
                          activeSubCategory === subCategory.id && "bg-cream-50 text-terracotta-600"
                        )}
                        onMouseEnter={() => handleSubCategoryHover(subCategory.id)}
                      >
                        {subCategory.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Products Categories */}
          {activeSubCategory && (
            <div className="w-2/4 py-6">
              <div className="grid grid-cols-2 gap-2">
                {categoriesData
                  .find(cat => cat.id === activeMainCategory)
                  ?.subcategories
                  .find(subCat => subCat.id === activeSubCategory)
                  ?.products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/search?category=${activeMainCategory}&subcategory=${activeSubCategory}&product=${product.id}`}
                      className="px-6 py-2 text-sm hover:bg-cream-50 hover:text-terracotta-600 transition-colors flex items-center"
                      onClick={onClose}
                    >
                      <ChevronRight className="h-3 w-3 mr-2 text-terracotta-600" />
                      {product.name}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* View all products link */}
        <div className="p-6 bg-cream-50 text-center">
          <Link 
            to="/search" 
            className="text-sm font-medium text-terracotta-600 hover:underline"
            onClick={onClose}
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CategoryNavigation;
