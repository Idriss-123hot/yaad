import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanSidebar } from './ArtisanSidebar';
import { ArtisanHeader } from './ArtisanHeader';
import { SessionTimeout } from '@/components/shared/SessionTimeout';
import { checkArtisanRole } from '@/utils/authUtils';

// Définition des propriétés du layout
interface ArtisanLayoutProps {
  children: React.ReactNode;
}

export function ArtisanLayout({ children }: ArtisanLayoutProps) {
  // États pour la gestion de la sidebar et de l'autorisation
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  // Vérification du rôle artisan au montage du composant
  useEffect(() => {
    const checkArtisan = async () => {
      try {
        const isArtisan = await checkArtisanRole();
        
        if (!isArtisan) {
          navigate('/artisan/login');
          return;
        }
        
        setIsAuthorized(true); // Autorise l'accès si le rôle est valide
      } catch (error) {
        console.error('Erreur de vérification du rôle :', error);
        navigate('/artisan/login');
      }
    };
    
    checkArtisan();
  }, [navigate]);

  // Affiche un indicateur de chargement pendant la vérification
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
      </div>
    );
  }

  // Structure principale du layout
  return (
    <div className="flex h-screen bg-gray-100">
      <SessionTimeout redirectPath="/artisan/login" />
      <ArtisanSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <ArtisanHeader onMenuButtonClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          {children} // Contenu des pages enfants
        </main>
      </div>
    </div>
  );
}