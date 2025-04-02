import { useState } from 'react';
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
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Loading state for logout

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast({ title: 'Logged out successfully' });
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error logging out',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false); // Reset loading state
    }
  };

  return (
    <header className="border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuButtonClick}
            className="md:hidden"
            aria-label="Toggle navigation menu"  // Improved accessibility
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <h1 className="ml-2 text-xl font-semibold text-terracotta-800 md:ml-0">
            Admin Panel
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/profile')}
            className="flex items-center"
            aria-label="User profile"
          >
            <User className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">My Profile</span>
          </Button>

          {/* Enhanced logout button with loading state */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center text-red-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? (
              <span className="hidden md:inline">Logging out...</span>
            ) : (
              <span className="hidden md:inline">Logout</span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}