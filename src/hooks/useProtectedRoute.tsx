
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { checkAdminRole, checkArtisanRole } from '@/utils/authUtils';

type RoleType = 'admin' | 'artisan' | 'any';

export const useProtectedRoute = (requiredRole: RoleType = 'any') => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if the user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Not logged in, redirect to appropriate auth page
          toast({
            title: 'Authentication required',
            description: 'Please log in to view this page',
          });
          
          // Redirect to the appropriate login page based on the required role
          const loginPath = requiredRole === 'admin' ? '/admin/login' : 
                           requiredRole === 'artisan' ? '/artisan/login' : '/auth';
          
          navigate(loginPath, { state: { from: window.location.pathname } });
          setIsAuthorized(false);
          return;
        }
        
        // If any role is acceptable, we're already authorized
        if (requiredRole === 'any') {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }
        
        // Check for specific role
        let hasRole = false;
        
        if (requiredRole === 'admin') {
          hasRole = await checkAdminRole();
        } else if (requiredRole === 'artisan') {
          hasRole = await checkArtisanRole();
        }
        
        if (!hasRole) {
          // Redirect to the appropriate login page based on the required role
          const loginPath = requiredRole === 'admin' ? '/admin/login' : '/artisan/login';
          
          toast({
            title: 'Access denied',
            description: `You need ${requiredRole} permissions to view this page`,
            variant: 'destructive',
          });
          
          navigate(loginPath);
          setIsAuthorized(false);
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthorized(false);
        
        // Redirect to the appropriate login page based on the required role
        const loginPath = requiredRole === 'admin' ? '/admin/login' : 
                          requiredRole === 'artisan' ? '/artisan/login' : '/auth';
        
        navigate(loginPath);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, requiredRole, toast]);
  
  return { isAuthorized, isLoading };
};

export default useProtectedRoute;
