
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Artisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artisans')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setArtisans(data || []);
    } catch (err) {
      console.error('Error fetching artisans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les artisans en fonction du terme de recherche
  const filteredArtisans = artisans.filter(artisan => 
    artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (artisan.location && artisan.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6">Nos Artisans</h1>
          
          {/* Search bar */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un artisan par nom ou location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold mb-2 text-red-500">Une erreur est survenue</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
            </div>
          ) : filteredArtisans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-xl font-bold mb-2">Aucun artisan trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `Aucun artisan ne correspond à votre recherche "${searchTerm}".` 
                  : "Nous n'avons pas encore d'artisans à afficher."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default Artisans;
