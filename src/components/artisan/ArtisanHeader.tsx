import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Menu, LogOut, User } from 'lucide-react';

// Définition des propriétés attendues par le composant
interface ArtisanHeaderProps {
  onMenuButtonClick: () => void;
}

export function ArtisanHeader({ onMenuButtonClick }: ArtisanHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Gestion de la déconnexion de l'artisan
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Déconnexion réussie', // Notification de succès
      });
      navigate('/artisan/login'); // Redirection vers la page de connexion
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
      toast({
        title: 'Erreur de déconnexion', // Notification d'erreur
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Section gauche avec bouton menu mobile et titre */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuButtonClick}
            className="md:hidden"
            aria-label="Ouvrir le menu de navigation" // Accessibilité
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span> // Texte caché pour lecteurs d'écran
          </Button>
          <h1 className="ml-2 text-xl font-semibold text-terracotta-800 md:ml-0">
            Portail Artisan
          </h1>
        </div>
        
        {/* Section droite avec boutons de navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/artisan/profile')}
            className="flex items-center"
            aria-label="Accéder au profil"
          >
            <User className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Mon Profil</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Se déconnecter"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </header>
  );
}