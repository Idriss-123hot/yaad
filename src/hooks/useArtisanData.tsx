
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Artisan } from '@/models/types';
import { useToast } from '@/hooks/use-toast';

interface ArtisanContextType {
  artisanData: Artisan | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const ArtisanContext = createContext<ArtisanContextType | undefined>(undefined);

export const ArtisanProvider = ({ children }: { children: ReactNode }) => {
  const [artisanData, setArtisanData] = useState<Artisan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchArtisanData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      // Fetch artisan data
      const { data, error } = await supabase
        .from('artisans')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error('No artisan profile found');
      }
      
      // Format the data to match our Artisan type
      const formattedData: Artisan = {
        id: data.id,
        name: data.name,
        bio: data.bio || '',
        location: data.location || '',
        profileImage: data.profile_photo || '/placeholder.svg',
        galleryImages: Array.isArray(data.first_gallery_images) ? data.first_gallery_images : [],
        rating: data.rating || 0,
        reviewCount: data.review_count || 0,
        productCount: 0, // We'll need to fetch this separately if needed
        featured: data.featured || false,
        joinedDate: new Date(data.joined_date),
        description: data.description || '',
        website: data.website || '',
      };
      
      setArtisanData(formattedData);
    } catch (error: any) {
      console.error('Error fetching artisan data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch artisan data on mount
  useEffect(() => {
    fetchArtisanData();
  }, []);
  
  return (
    <ArtisanContext.Provider value={{
      artisanData,
      isLoading,
      error,
      refreshData: fetchArtisanData,
    }}>
      {children}
    </ArtisanContext.Provider>
  );
};

export const useArtisanData = () => {
  const context = useContext(ArtisanContext);
  if (context === undefined) {
    throw new Error('useArtisanData must be used within an ArtisanProvider');
  }
  return context;
};

export default useArtisanData;
