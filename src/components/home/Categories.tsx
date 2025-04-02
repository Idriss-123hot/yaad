import { Link } from 'react-router-dom';
import { categoriesData } from '@/data/categories';
import { getImageWithFallback } from '@/lib/utils';

// Mappage des images personnalisées pour chaque catégorie principale
const CATEGORY_IMAGES = {
  "home-decor": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Home%20Decor.jpeg",
  "women": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Women%20morocco.jpeg",
  "men": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Mec%20Morocco%20Craft.jpeg",
  "skincare": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Skincare%20Maroc.webp",
  "gourmet": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Gourmet.jpeg"
};

export function Categories() {
  // Récupère l'image appropriée pour une catégorie donnée
  const getCategoryImage = (categoryId: string) => {
    return CATEGORY_IMAGES[categoryId as keyof typeof CATEGORY_IMAGES] || getImageWithFallback(undefined);
  };

  return (
    <section className="py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-10">
          <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
            Explorer par catégories
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Trésors de l'Artisanat Marocain</h2>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            Plongez dans un univers de créations uniques façonnées par des mains expertes, héritières d'un savoir-faire séculaire.
          </p>
        </div>

        {/* Grille des catégories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {categoriesData.map((category) => (
            <Link
              key={category.id}
              to={`/search?category=${category.id}`}
              className="group relative overflow-hidden rounded-xl h-60 lg:h-72 hover-lift transition-transform duration-300"
              aria-label={`Explorer la catégorie ${category.name}`}
            >
              {/* Image de la catégorie */}
              <img
                src={getCategoryImage(category.id)}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
                }}
              />
              
              {/* Overlay pour améliorer la lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              
              {/* Texte superposé */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  {category.name}
                </h3>
                <p className="text-sm opacity-90 group-hover:underline mt-1">
                  Découvrir
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}