
import { supabase } from '@/integrations/supabase/client';

// Function to check if the user session is expired (30 minutes)
export const isSessionExpired = (lastActivity: string | null): boolean => {
  if (!lastActivity) return true;
  
  const lastActivityTime = new Date(lastActivity).getTime();
  const currentTime = new Date().getTime();
  // 30 minutes in milliseconds
  const sessionTimeout = 30 * 60 * 1000;
  
  return currentTime - lastActivityTime > sessionTimeout;
};

// Function to update the last activity timestamp
export const updateLastActivity = (): void => {
  localStorage.setItem('lastActivity', new Date().toISOString());
};

// Optimized function to check a user's role without risking RLS recursion
export const checkUserRole = async (roleToCheck: string): Promise<boolean> => {
  try {
    console.log(`Checking if user has ${roleToCheck} role`);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No session found when checking role');
      return false;
    }
    
    // Use direct service role API call to avoid RLS recursion
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error(`Error checking ${roleToCheck} role:`, error);
      return false;
    }
    
    console.log('Role check result:', data?.role);
    return data?.role === roleToCheck;
  } catch (error) {
    console.error(`Exception checking ${roleToCheck} role:`, error);
    return false;
  }
};

// Function to check if user has admin role
export const checkAdminRole = async (): Promise<boolean> => {
  return checkUserRole('admin');
};

// Function to check if user has artisan role
export const checkArtisanRole = async (): Promise<boolean> => {
  return checkUserRole('artisan');
};

// Function to get the current user's artisan ID (for artisan users)
export const getCurrentArtisanId = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('artisans')
      .select('id')
      .eq('user_id', session.user.id)
      .single();
    
    if (error || !data) {
      console.error('Error getting artisan ID:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Exception getting artisan ID:', error);
    return null;
  }
};

/**
 * Ensures that all required storage buckets exist in Supabase
 * This function will create buckets if they don't exist
 */
export const ensureStorageBuckets = async () => {
  try {
    const { error } = await supabase.functions.invoke('ensure-storage-buckets');
    if (error) {
      console.error('Error ensuring storage buckets:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (error) {
    console.error('Exception invoking ensure-storage-buckets function:', error);
    return { success: false, error };
  }
};
