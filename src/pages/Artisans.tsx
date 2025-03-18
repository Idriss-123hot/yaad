
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { SAMPLE_ARTISANS } from '@/models/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

const Artisans = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArtisans, setFilteredArtisans] = useState(SAMPLE_ARTISANS);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Extract unique locations for filter
  const locations = Array.from(new Set(SAMPLE_ARTISANS.map(artisan => artisan.location.split(',')[0].trim())));

  // Filter artisans based on search query and location
  useEffect(() => {
    let result = SAMPLE_ARTISANS;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(artisan => 
        artisan.name.toLowerCase().includes(query) || 
        artisan.bio.toLowerCase().includes(query)
      );
    }
    
    if (selectedLocation) {
      result = result.filter(artisan => 
        artisan.location.split(',')[0].trim() === selectedLocation
      );
    }
    
    setFilteredArtisans(result);
  }, [searchQuery, selectedLocation]);

  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle location filter click
  const handleLocationFilter = (location: string) => {
    setSelectedLocation(prevLocation => prevLocation === location ? null : location);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Banner */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Rencontrez Nos Artisans</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez les talents et les histoires derrière nos créations. Chaque artisan apporte son savoir-faire unique, 
              ses traditions et son histoire à ses créations.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 px-6 md:px-12 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-auto md:flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Rechercher par nom ou spécialité..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              {/* Location Filter */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-2 md:py-0">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {locations.map(location => (
                    <Button 
                      key={location}
                      variant={selectedLocation === location ? "default" : "outline"}
                      size="sm"
                      className={`rounded-full whitespace-nowrap ${selectedLocation === location ? 'bg-terracotta-600 text-white hover:bg-terracotta-700' : ''}`}
                      onClick={() => handleLocationFilter(location)}
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Artisans */}
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-8">Artisans à l'Honneur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtisans
                .filter(artisan => artisan.featured)
                .map((artisan) => (
                  <ArtisanCard 
                    key={artisan.id} 
                    artisan={artisan} 
                    className="hover-lift"
                    linkTo={`/artisans/${artisan.id}`}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* All Artisans */}
        <section className="py-12 px-6 md:px-12 bg-sage-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-8">Tous Nos Artisans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtisans
                .filter(artisan => !artisan.featured)
                .map((artisan) => (
                  <ArtisanCard 
                    key={artisan.id} 
                    artisan={artisan} 
                    className="hover-lift"
                    linkTo={`/artisans/${artisan.id}`}
                  />
                ))}
            </div>

            {/* No results message */}
            {filteredArtisans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun artisan ne correspond à votre recherche.</p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLocation(null);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Artisans;
