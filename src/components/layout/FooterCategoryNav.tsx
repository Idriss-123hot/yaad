
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { categoriesData } from '@/data/categories';

type ExpandedCategories = {
  [key: string]: boolean;
};

export function FooterCategoryNav() {
  const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Categories</h3>
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {categoriesData.map((category) => (
          <div key={category.id} className="border-b border-border/30 pb-2">
            <div 
              className="flex items-center justify-between cursor-pointer py-1"
              onClick={() => toggleCategory(category.id)}
            >
              <Link 
                to={`/categories/${category.id}`} 
                className="text-sm hover:text-terracotta-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {category.name}
              </Link>
              <button 
                className="text-muted-foreground hover:text-terracotta-600 transition-colors"
                aria-label={expandedCategories[category.id] ? "Collapse category" : "Expand category"}
              >
                {expandedCategories[category.id] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {expandedCategories[category.id] && (
              <div className="ml-3 mt-1 space-y-1">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id}>
                    <Link
                      to={`/categories/${category.id}/${subcategory.id}`}
                      className="text-xs text-muted-foreground hover:text-terracotta-600 transition-colors block py-1"
                    >
                      {subcategory.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FooterCategoryNav;
