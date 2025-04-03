
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to prepare an artisan's data for import
 * @param data Raw artisan data in CSV format
 * @returns Formatted artisan data ready for import
 */
export function prepareArtisanData(data: any) {
  // Parse numeric values
  const rating = typeof data.rating === 'string' 
    ? parseFloat(data.rating.replace(',', '.')) 
    : data.rating || 4.5;
  
  const reviewCount = typeof data.review_count === 'string'
    ? parseInt(data.review_count, 10)
    : data.review_count || 0;
  
  // Parse boolean values - "yes" or true
  const featured = typeof data.featured === 'string'
    ? data.featured.toLowerCase() === 'yes' || data.featured.toLowerCase() === 'true'
    : Boolean(data.featured);
  
  return {
    email: data.email,
    role: data.role || 'artisan',
    first_name: data.first_name,
    last_name: data.last_name,
    name: data.name || `${data.first_name} ${data.last_name}`,
    description: data.description || '',
    location: data.location || '',
    bio: data.bio || '',
    profile_photo: data.profile_photo || '',
    first_gallery_images: data.first_gallery_images || '',
    second_gallery_images: data.second_gallery_images || '',
    website: data.website || '',
    rating: rating,
    review_count: reviewCount,
    featured: featured,
    joined_date: data.joined_date || new Date().toISOString().split('T')[0]
  };
}

/**
 * Import multiple artisans using the edge function
 * @param artisans Array of artisan data objects 
 * @returns Result of the import operation
 */
export async function importArtisans(artisans: any[]) {
  try {
    // Call the edge function for importing artisans
    const { data, error } = await supabase.functions.invoke('import-artisans', {
      body: { artisans: artisans.map(prepareArtisanData) }
    });
    
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error importing artisans:', error);
    return { success: false, error };
  }
}
