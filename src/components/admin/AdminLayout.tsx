
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { SessionTimeout } from '@/components/shared/SessionTimeout';
import { checkAdminRole, updateLastActivity } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // First check if we have a session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session found, redirecting to login");
          toast({
            title: 'Authentification requise',
            description: 'Vous devez être connecté pour accéder à cette section',
            variant: 'destructive',
          });
          navigate('/admin/login');
          return;
        }
        
        console.log("Session found, checking admin role");
        // Then check if user has admin role using the fixed utility function
        // Utilisation d'un setTimeout pour éviter les problèmes de récursion avec les RLS policies
        setTimeout(async () => {
          try {
            const isAdmin = await checkAdminRole();
            console.log("Admin check result:", isAdmin);
            
            if (!isAdmin) {
              console.log("User is not an admin, logging out and redirecting");
              await supabase.auth.signOut();
              
              toast({
                title: 'Accès non autorisé',
                description: 'Vous devez être administrateur pour accéder à cette section',
                variant: 'destructive',
              });
              navigate('/admin/login');
              return;
            }
            
            updateLastActivity();
            setIsAuthorized(true);
            setIsLoading(false);
          } catch (error) {
            console.error('Erreur de vérification du rôle admin:', error);
            navigate('/admin/login');
            setIsLoading(false);
          }
        }, 100);
      } catch (error) {
        console.error('Erreur de vérification :', error);
        navigate('/admin/login');
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de l'interface admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <SessionTimeout redirectPath="/admin/login" />
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuButtonClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
