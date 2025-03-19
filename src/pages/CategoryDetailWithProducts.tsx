
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { categoriesData } from '@/data/categories';
import { ChevronRight } from 'lucide-react';

const CategoryDetailWithProducts = () => {
  const { mainCategory, subCategory, product } = useParams<{ 
    mainCategory: string;
    subCategory: string;
    product?: string;
  }>();

  // Find main category
  const mainCategoryData = categoriesData.find(cat => cat.id === mainCategory);
  
  // Find subcategory
  const subCategoryData = mainCategoryData?.subcategories.find(
    subCat => subCat.id === subCategory
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [mainCategory, subCategory, product]);

  if (!mainCategoryData || !subCategoryData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground">
              Sorry, the category you're looking for doesn't exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Category Header */}
        <section className="bg-cream-50 py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm mb-6 text-muted-foreground">
              <Link to="/" className="hover:text-terracotta-600 transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to={`/categories/${mainCategory}`} className="hover:text-terracotta-600 transition-colors">
                {mainCategoryData.name}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-foreground">{subCategoryData.name}</span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{subCategoryData.name}</h1>
            <p className="text-muted-foreground max-w-3xl">
              Discover our collection of {subCategoryData.name.toLowerCase()} items, handcrafted by talented artisans.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subCategoryData.products.map((productItem) => (
                <Link 
                  key={productItem.id}
                  to={`/categories/${mainCategory}/${subCategory}/${productItem.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-cream-50 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Product Image</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-lg mb-2">{productItem.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse our selection of {productItem.name.toLowerCase()} crafted with care by our skilled artisans.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetailWithProducts;
