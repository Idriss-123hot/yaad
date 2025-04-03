
import { Link } from 'react-router-dom';
import { categoriesData } from '@/data/categories';
import { getImageWithFallback } from '@/lib/utils';
import { useTranslations } from '@/lib/i18n';

// Images d'inspiration marocaine pour chaque catégorie principale
const CATEGORY_IMAGES = {
  "home-decor": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Home%20Decor/Home%20Decor.jpeg",
  "women": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Women/Women%20morocco.jpeg",
  "men": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Men/Mec%20Morocco%20Craft.jpeg",
  "skincare": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Skincare/Skincare%20Maroc.webp",
  "gourmet": "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Gourmet/Gourmet.jpeg"
};

export function Categories() {
  const { t } = useTranslations();
  
  // Fonction pour obtenir l'image personnalisée pour chaque catégorie
  const getCategoryImage = (categoryId: string) => {
    return CATEGORY_IMAGES[categoryId as keyof typeof CATEGORY_IMAGES] || getImageWithFallback(undefined);
  };

  return (
    <section className="py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-3">
            {t('browse_by_category', 'Rechercher par catégories')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Produits de l'Artisanat Marocain</h2>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            Découvrez le riche patrimoine et le savoir-faire exceptionnel du Maroc à travers notre collection soigneusement sélectionnée de produits artisanaux authentiques.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {categoriesData.map((category) => (
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
                  e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg";
                }}
              />
              {/* Darker overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg text-white drop-shadow-md">{category.name}</h3>
                <p className="text-sm text-white group-hover:underline">{t('explore_collection', 'Explorer la collection')}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
