
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures that all required storage buckets exist in Supabase
 * This function will create buckets if they don't exist
 */
export const ensureBucketsExist = async (): Promise<{ success: boolean; error?: any }> => {
  try {
    const { data, error } = await supabase.functions.invoke('ensure-storage-buckets');
    
    if (error) {
      console.error('Erreur lors de la vérification des buckets de stockage:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de l\'appel de la fonction ensure-storage-buckets:', error);
    return { success: false, error };
  }
};

/**
 * Gets the URL for a public file in a bucket
 * @param bucketName - The name of the bucket
 * @param filePath - The path to the file within the bucket
 * @returns The URL for the public file
 */
export const getPublicFileUrl = (bucketName: string, filePath: string): string => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

/**
 * Uploads a file to a bucket
 * @param bucketName - The name of the bucket
 * @param filePath - The path to save the file to
 * @param file - The file to upload
 * @returns The result of the upload operation
 */
export const uploadFile = async (bucketName: string, filePath: string, file: File): Promise<{ success: boolean; url?: string; error?: any }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error(`Erreur lors de l'upload du fichier vers ${bucketName}/${filePath}:`, error);
      return { success: false, error };
    }

    const url = getPublicFileUrl(bucketName, data.path);
    return { success: true, url };
  } catch (error) {
    console.error(`Exception lors de l'upload du fichier vers ${bucketName}/${filePath}:`, error);
    return { success: false, error };
  }
};
