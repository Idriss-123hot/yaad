
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ArtisanSidebar from './ArtisanSidebar';
import { ArtisanHeader } from './ArtisanHeader';
import { checkArtisanRole, updateLastActivity } from '@/utils/authUtils';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ArtisanLayoutProps {
  children: ReactNode;
}

export function ArtisanLayout({ children }: ArtisanLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Vérifier l'autorisation au chargement
  useEffect(() => {
    const checkArtisanAccess = async () => {
      try {
        console.log("ArtisanLayout: Checking session and artisan role");
        
        // Vérifier si nous avons une session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("ArtisanLayout: No session found, redirecting to login");
          
          toast({
            title: 'Authentification requise',
            description: 'Vous devez être connecté pour accéder à cette section',
            variant: 'destructive',
          });
          
          navigate('/artisan/login');
          return;
        }
        
        console.log("ArtisanLayout: Session found, checking artisan role");
        
        // Utiliser setTimeout pour éviter les récursions potentielles avec RLS
        setTimeout(async () => {
          try {
            // Vérifier si l'utilisateur a le rôle artisan
            const isArtisan = await checkArtisanRole();
            console.log("ArtisanLayout: Artisan check result:", isArtisan);
            
            if (!isArtisan) {
              console.log("ArtisanLayout: User is not an artisan, logging out");
              
              toast({
                title: 'Accès non autorisé',
                description: 'Vous devez être artisan pour accéder à cette section',
                variant: 'destructive',
              });
              
              navigate('/artisan/login');
              return;
            }
            
            // Utilisateur est un artisan
            updateLastActivity();
            setIsAuthorized(true);
            setIsLoading(false);
          } catch (error) {
            console.error("ArtisanLayout: Role check error:", error);
            navigate('/artisan/login');
            setIsLoading(false);
          }
        }, 100);
      } catch (error) {
        console.error('ArtisanLayout: Erreur de vérification :', error);
        navigate('/artisan/login');
        setIsLoading(false);
      }
    };
    
    checkArtisanAccess();
  }, [navigate, toast]);

  // Écouteur pour les changements d'état d'authentification
  useEffect(() => {
    console.log("ArtisanLayout: Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("ArtisanLayout: Auth state changed:", event);
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log("ArtisanLayout: User signed out or session ended");
          setIsAuthorized(false);
          navigate('/artisan/login');
        }
      }
    );
    
    return () => {
      console.log("ArtisanLayout: Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de l'espace artisan...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <ArtisanSidebar />
      <div className="flex flex-col flex-1">
        <ArtisanHeader onMenuButtonClick={() => {}} />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default ArtisanLayout;
