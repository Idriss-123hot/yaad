

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { SessionTimeout } from '@/components/shared/SessionTimeout';
import { checkAdminRole, updateLastActivity } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';

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
        const isAdmin = await checkAdminRole();
        
        if (!isAdmin) {
          toast({
            title: 'Accès non autorisé',
            description: 'Vous devez être connecté en tant qu\'administrateur pour accéder à cette page',
            variant: 'destructive',
          });
          navigate('/admin/login');
          return;
        }
        
        // Update last activity timestamp
        updateLastActivity();
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking admin role:', error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

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
