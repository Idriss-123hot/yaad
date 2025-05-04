
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

// Function to check if user has admin role
export const checkAdminRole = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    // Use the maybeSingle() method to avoid errors when no results are found
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
    
    return data?.role === 'admin';
  } catch (error) {
    console.error('Exception checking admin role:', error);
    return false;
  }
};

// Function to check if user has artisan role
export const checkArtisanRole = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    // Use the maybeSingle() method to avoid errors when no results are found
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking artisan role:', error);
      return false;
    }
    
    return data?.role === 'artisan';
  } catch (error) {
    console.error('Exception checking artisan role:', error);
    return false;
  }
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
      .maybeSingle();
    
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
