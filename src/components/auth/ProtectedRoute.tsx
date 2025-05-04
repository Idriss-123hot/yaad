
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { checkAdminRole, checkArtisanRole } from '@/utils/authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'artisan' | 'customer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        
        // If user is logged in and a role is required, check role
        if (sessionData.session && requiredRole) {
          let hasRole = false;
          
          if (requiredRole === 'admin') {
            hasRole = await checkAdminRole();
          } else if (requiredRole === 'artisan') {
            hasRole = await checkArtisanRole();
          } else if (requiredRole === 'customer') {
            // For customer role, we just need to be logged in
            hasRole = true;
          }
          
          setUserRole(hasRole ? requiredRole : null);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession && requiredRole) {
          let hasRole = false;
          
          if (requiredRole === 'admin') {
            hasRole = await checkAdminRole();
          } else if (requiredRole === 'artisan') {
            hasRole = await checkArtisanRole();
          } else if (requiredRole === 'customer') {
            // For customer role, we just need to be logged in
            hasRole = true;
          }
          
          setUserRole(hasRole ? requiredRole : null);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
      </div>
    );
  }

  if (!session) {
    // If user is not logged in, redirect to login page
    // with the current URL as redirect URL
    toast({
      title: "Authentification requise",
      description: "Veuillez vous connecter pour accéder à cette page.",
      variant: "default",
    });
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // If a specific role is required and user doesn't have that role
    toast({
      title: "Accès refusé",
      description: `Vous devez être ${requiredRole} pour accéder à cette page.`,
      variant: "destructive",
    });
    
    return <Navigate to="/" replace />;
  }

  // If user is logged in (and has the correct role if required), render children
  return <>{children}</>;
};

export default ProtectedRoute;
