
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
        // Vérifier si l'utilisateur est connecté
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        
        // Si l'utilisateur est connecté et qu'un rôle est requis, vérifier le rôle
        if (sessionData.session && requiredRole) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', sessionData.session.user.id)
            .single();
            
          if (error) throw error;
          
          setUserRole(profileData?.role || null);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Configurer un écouteur pour les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession && requiredRole) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', newSession.user.id)
              .single();
              
            setUserRole(profileData?.role || null);
          } catch (error) {
            console.error('Erreur lors de la récupération du rôle:', error);
          }
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
    // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
    // avec l'URL actuelle comme URL de redirection
    toast({
      title: "Authentification requise",
      description: "Veuillez vous connecter pour accéder à cette page.",
      variant: "default",
    });
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Si un rôle spécifique est requis et que l'utilisateur n'a pas ce rôle
    toast({
      title: "Accès refusé",
      description: `Vous devez être ${requiredRole} pour accéder à cette page.`,
      variant: "destructive",
    });
    
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est connecté (et a le bon rôle si requis), rendre les enfants
  return <>{children}</>;
};

export default ProtectedRoute;
