
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { ArtisanCard } from '@/components/ui/ArtisanCard';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Artisan } from '@/models/types';

const Artisans = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('artisans')
        .select(`
          *,
          products:products(id)
        `)
        .order('featured', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Map database results to our Artisan model
      const mappedArtisans: Artisan[] = data.map(artisan => ({
        id: artisan.id,
        name: artisan.name,
        bio: artisan.bio || '',
        description: artisan.description || '',
        location: artisan.location || 'Morocco',
        profileImage: artisan.profile_photo || '/placeholder.svg',
        galleryImages: Array.isArray(artisan.first_gallery_images) 
          ? artisan.first_gallery_images 
          : [],
        rating: artisan.rating || 4.5,
        reviewCount: artisan.review_count || 0,
        productCount: artisan.products?.length || 0,
        featured: artisan.featured || false,
        joinedDate: new Date(artisan.joined_date),
        website: artisan.website || ''
      }));
      
      setArtisans(mappedArtisans);
    } catch (err: any) {
      console.error('Error fetching artisans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter artisans based on search term
  const filteredArtisans = artisans.filter(artisan => 
    artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (artisan.location && artisan.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6">Our Artisans</h1>
          
          {/* Search bar */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search artisans by name or location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold mb-2 text-red-500">An error occurred</h3>
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
              <h3 className="text-xl font-bold mb-2">No artisans found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `No artisans match your search for "${searchTerm}".` 
                  : "We don't have any artisans to display yet."}
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
