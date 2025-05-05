
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { SessionTimeout } from '@/components/shared/SessionTimeout';
import { checkAdminRole, updateLastActivity } from '@/utils/authUtils';
import { useToast } from '@/hooks/use-toast';
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
        console.log("AdminLayout: Checking session and admin role");
        
        // Vérifier si nous avons une session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("AdminLayout: No session found, redirecting to login");
          
          toast({
            title: 'Authentification requise',
            description: 'Vous devez être connecté pour accéder à cette section',
            variant: 'destructive',
          });
          
          navigate('/admin/login');
          return;
        }
        
        console.log("AdminLayout: Session found, checking admin role");
        
        // Vérifier si l'utilisateur a le rôle admin
        const isAdmin = await checkAdminRole();
        console.log("AdminLayout: Admin check result:", isAdmin);
        
        if (!isAdmin) {
          console.log("AdminLayout: User is not an admin, logging out");
          
          await supabase.auth.signOut();
          
          toast({
            title: 'Accès non autorisé',
            description: 'Vous devez être administrateur pour accéder à cette section',
            variant: 'destructive',
          });
          
          navigate('/admin/login');
          return;
        }
        
        // Utilisateur est un admin
        updateLastActivity();
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('AdminLayout: Erreur de vérification :', error);
        navigate('/admin/login');
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate, toast]);

  // Écouteur pour les changements d'état d'authentification
  useEffect(() => {
    console.log("AdminLayout: Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AdminLayout: Auth state changed:", event);
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log("AdminLayout: User signed out or session ended");
          setIsAuthorized(false);
          navigate('/admin/login');
        }
      }
    );
    
    return () => {
      console.log("AdminLayout: Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

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
