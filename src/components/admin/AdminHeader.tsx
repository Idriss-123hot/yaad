import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Menu, LogOut, User } from 'lucide-react';

interface AdminHeaderProps {
  onMenuButtonClick: () => void;
}

export function AdminHeader({ onMenuButtonClick }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Déconnexion réussie',
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
      toast({
        title: 'Erreur de déconnexion',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuButtonClick}
            className="md:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
          <h1 className="ml-2 text-xl font-semibold text-terracotta-800 md:ml-0">
            Panneau Administrateur
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/profile')}
            className="flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Mon Profil</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </header>
  );
}