
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// =====================================================
// CONFIGURATION DES IMAGES - ZONE MODIFIABLE
// =====================================================
// Changez simplement les URLs ci-dessous pour modifier les images du carrousel
// Format: chaque URL doit pointer vers une image valide
// ATTENTION: Ne modifiez que les URLs entre guillemets
const HEADER_IMAGES = [
  "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/yaadhomepage/Photo%20salon%20marocain.jpeg",
  "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/yaadhomepage/Cusine%20Marocaine.png",
  "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/yaadhomepage/Chambre%20Marocaine.png"
];

// Image de secours en cas d'erreur de chargement
const FALLBACK_IMAGE = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";

// Intervalle de rotation des images (en millisecondes)
const ROTATION_INTERVAL = 3000; // 3 secondes
// =====================================================
// FIN DE LA ZONE MODIFIABLE
// =====================================================

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Configuration de la rotation automatique des images
  useEffect(() => {
    setLoaded(true);
    
    // Démarrage de la rotation automatique
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HEADER_IMAGES.length);
    }, ROTATION_INTERVAL);
    
    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  // Préchargement des images pour une transition plus fluide
  useEffect(() => {
    HEADER_IMAGES.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return (
    <section className="relative h-[65vh] overflow-hidden pt-8">
      {/* Carrousel d'images en arrière-plan */}
      <div className="absolute inset-0 z-0 top-[-5%] md:top-[-10%]">
        {/* Dégradé pour améliorer la lisibilité du texte */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 z-10"
          aria-hidden="true"
        />
        
        {/* Images du carrousel */}
        {HEADER_IMAGES.map((src, index) => (
          <img 
            key={index}
            src={src}
            alt={`Intérieur marocain ${index + 1}`}
            className={`w-full h-[120%] object-cover object-center transition-opacity duration-1000 absolute inset-0 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              console.error("Erreur de chargement de l'image:", src);
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <div className={loaded ? 'animate-fade-in' : ''}>
            <span className="inline-block bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-medium mb-6">
              Artisanat Marocain Authentique
            </span>
          </div>
          
          <h1 
            className={loaded ? 'font-serif text-3xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in' : 'font-serif text-3xl md:text-5xl font-bold leading-tight mb-6'}
          >
            L'Art Marocain <br /> 
            <span className="text-terracotta-600">dans votre intérieur</span>
          </h1>
          
          <p 
            className={loaded ? 'text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in' : 'text-lg md:text-xl text-muted-foreground mb-6'}
          >
            Découvrez des produits uniques fabriqués à la main avec soin, 
            passion et techniques traditionnelles par des artisans marocains talentueux.
          </p>
          
          <div className={loaded ? 'flex flex-col sm:flex-row gap-4 animate-fade-in' : 'flex flex-col sm:flex-row gap-4'}>
            <Link to="/search">
              <Button 
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-6 w-full sm:w-auto"
                size="lg"
              >
                Explorer Nos Produits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/artisans">
              <Button 
                variant="outline" 
                className="border-terracotta-200 text-foreground hover:bg-terracotta-50 px-8 py-6 w-full sm:w-auto"
                size="lg"
              >
                Rencontrer Nos Artisans
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-terracotta-300 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-terracotta-500 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
