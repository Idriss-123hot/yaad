import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

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
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return false;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (error || data?.role !== 'admin') return false;
  
  return true;
};

// Function to check if user has artisan role
export const checkArtisanRole = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return false;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (error || data?.role !== 'artisan') return false;
  
  return true;
};

// Function to get the current user's artisan ID (for artisan users)
export const getCurrentArtisanId = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return null;
  
  const { data, error } = await supabase
    .from('artisans')
    .select('id')
    .eq('user_id', session.user.id)
    .single();
  
  if (error || !data) return null;
  
  return data.id;
};

// Helper function to hash password (for demonstration purposes only)
// In real applications, this would be handled by Supabase Auth directly
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
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
