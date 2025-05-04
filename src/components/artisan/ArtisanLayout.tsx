
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ArtisanSidebar from './ArtisanSidebar';
import { ArtisanHeader } from './ArtisanHeader';
import { checkArtisanRole, updateLastActivity } from '@/utils/authUtils';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ArtisanLayoutProps {
  children: ReactNode;
}

export function ArtisanLayout({ children }: ArtisanLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkArtisan = async () => {
      try {
        // First check if we have a session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: 'Authentification requise',
            description: 'Vous devez être connecté pour accéder à cette section',
            variant: 'destructive',
          });
          navigate('/artisan/login');
          return;
        }
        
        // Then check if user has artisan role
        const isArtisan = await checkArtisanRole();
        
        if (!isArtisan) {
          toast({
            title: 'Accès non autorisé',
            description: 'Vous devez être artisan pour accéder à cette section',
            variant: 'destructive',
          });
          navigate('/artisan/login');
          return;
        }
        
        updateLastActivity();
        setIsAuthorized(true);
      } catch (error) {
        console.error('Erreur de vérification :', error);
        navigate('/artisan/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkArtisan();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    // The useProtectedRoute hook will automatically redirect
    // This is just a fallback
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
