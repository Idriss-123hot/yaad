
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import FixedNavMenu from '@/components/layout/FixedNavMenu';
import { useCategories } from '@/hooks/useCategories';

const Categories = () => {
  const { categories, loading } = useCategories();
  
  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Banner */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Catégories</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explorez notre collection d'artisanat marocain authentique par catégories.
              Découvrez des pièces uniques fabriquées par des artisans talentueux.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/search?category=${category.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={category.image || '/placeholder.svg'}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-terracotta-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {category.description || `Découvrez notre collection de ${category.name}`}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default Categories;
