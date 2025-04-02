
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Menu, LogOut, User } from 'lucide-react';

interface ArtisanHeaderProps {
  onMenuButtonClick: () => void;
}

export function ArtisanHeader({ onMenuButtonClick }: ArtisanHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged out successfully',
      });
      navigate('/artisan/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error logging out',
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
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <h1 className="ml-2 text-xl font-semibold text-terracotta-800 md:ml-0">Artisan Portal</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/artisan/profile')}
            className="flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">My Profile</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
