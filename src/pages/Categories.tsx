
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn, getImageWithFallback } from '@/lib/utils';

// Images d'inspiration marocaine pour les catégories principales
const CATEGORY_IMAGES = {
  "home-decor": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Home%20Decor.jpeg",
  "women": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Women%20morocco.jpeg",
  "men": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Mec%20Morocco%20Craft.jpeg",
  "skincare": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Skincare%20Maroc.webp",
  "gourmet": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Gourmet.jpeg"
};

// Catégories principales
const MAIN_CATEGORIES = [
  {
    id: "home-decor",
    name: "Décoration d'Intérieur",
    productCount: 45,
    slug: "home-decor",
  },
  {
    id: "women",
    name: "Femmes",
    productCount: 38,
    slug: "women",
  },
  {
    id: "men",
    name: "Hommes",
    productCount: 25,
    slug: "men",
  },
  {
    id: "skincare",
    name: "Soins de la Peau",
    productCount: 20,
    slug: "skincare",
  },
  {
    id: "gourmet",
    name: "Produits du Terroir",
    productCount: 30,
    slug: "gourmet",
  }
];

const Categories = () => {
  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Fonction pour obtenir l'image personnalisée pour chaque catégorie
  const getCategoryImage = (categoryId: string) => {
    return CATEGORY_IMAGES[categoryId as keyof typeof CATEGORY_IMAGES] || "";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Banner */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Découvrez nos Catégories</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Parcourez notre collection de trésors artisanaux marocains authentiques, organisés par catégorie 
              pour vous aider à trouver exactement ce que vous cherchez.
            </p>
          </div>
        </section>

        {/* Categories Grid - Using the same design as in Home Page */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {MAIN_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/search?category=${category.id}`}
                  className="group relative overflow-hidden rounded-xl h-60 lg:h-72 hover-lift"
                >
                  <img
                    src={getCategoryImage(category.id)}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
                    }}
                  />
                  {/* Darker overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg text-white drop-shadow-md">{category.name}</h3>
                    <p className="text-sm text-white group-hover:underline">
                      Explorer la collection ({category.productCount} produits)
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

export default Categories;
