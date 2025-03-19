
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { categoriesData } from '@/data/categories';

export function Categories() {
  // Prendre les 5 premières catégories principales pour l'affichage
  const displayCategories = categoriesData.slice(0, 4);

  return (
    <section className="py-16 px-6 md:px-12 bg-cream-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
            Browse by Category
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Discover Our Collections</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our carefully curated categories featuring exceptional handcrafted items from skilled artisans around the world.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayCategories.map((category, index) => (
            <Link 
              key={category.id} 
              to={`/categories/${category.id}`}
              className={cn(
                "group relative h-80 rounded-lg overflow-hidden hover-lift",
                index === 0 && "md:col-span-2 md:row-span-2 md:h-auto"
              )}
            >
              {/* Image - using placeholder since we don't have actual images */}
              <div className="absolute inset-0 zoom-image-container bg-sage-100">
                <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-sage-800">
                  {category.name}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 transition-opacity group-hover:opacity-70" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-6 text-white z-10">
                <h3 className="font-serif text-xl md:text-2xl font-semibold mb-1 group-hover:text-terracotta-100 transition-colors">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm mb-2">
                  {category.subcategories.length} Subcategories
                </p>
                <span className="inline-block text-sm text-white border-b border-white/30 pb-px group-hover:border-terracotta-300 group-hover:text-terracotta-100 transition-colors">
                  Explore Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
