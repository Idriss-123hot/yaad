
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanSidebar } from './ArtisanSidebar';
import { ArtisanHeader } from './ArtisanHeader';
import { SessionTimeout } from '@/components/shared/SessionTimeout';
import { checkArtisanRole } from '@/utils/authUtils';

/**
 * Interface des props du composant ArtisanLayout
 */
interface ArtisanLayoutProps {
  children: React.ReactNode;
}

/**
 * Composant de mise en page pour les pages d'artisan
 * 
 * Fournit une structure commune pour toutes les pages d'artisan
 * avec une barre latérale, un en-tête et une vérification de l'authentification.
 * 
 * @param {React.ReactNode} children - Contenu de la page à afficher
 */
export function ArtisanLayout({ children }: ArtisanLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkArtisan = async () => {
      // Vérifier si l'utilisateur connecté a le rôle d'artisan
      const isArtisan = await checkArtisanRole();
      
      if (!isArtisan) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas artisan
        navigate('/artisan/login');
        return;
      }
      
      setIsAuthorized(true);
    };
    
    checkArtisan();
  }, [navigate]);

  // Afficher un spinner pendant la vérification de l'autorisation
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
      </div>
    );
  }

  // Structure principale de la mise en page artisan
  return (
    <div className="flex h-screen bg-gray-100">
      <SessionTimeout redirectPath="/artisan/login" />
      <ArtisanSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <ArtisanHeader onMenuButtonClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
