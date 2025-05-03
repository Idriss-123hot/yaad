
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Tag, 
  FileText, 
  LogOut,
  Menu,
  X,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès.',
      });
      
      // Redirection vers la page de connexion
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la déconnexion.',
        variant: 'destructive',
      });
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const Overlay = () => (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity", 
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setOpen(false)}
    />
  );

  return (
    <>
      <Overlay />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 lg:hidden">
          <div className="font-medium">Administration</div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="hidden h-16 items-center px-6 lg:flex">
          <div className="font-medium">Administration</div>
        </div>
        
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h3>
            <div className="space-y-1">
              <Link 
                to="/admin/dashboard"
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive('/admin/dashboard') 
                    ? "bg-terracotta-500 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Tableau de bord
              </Link>
              
              <Link 
                to="/admin/products"
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive('/admin/products') 
                    ? "bg-terracotta-500 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Produits
              </Link>
              
              <Link 
                to="/admin/artisans"
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive('/admin/artisans') 
                    ? "bg-terracotta-500 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <Users className="mr-3 h-5 w-5" />
                Artisans
              </Link>
              
              <Link 
                to="/admin/sales"
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive('/admin/sales') 
                    ? "bg-terracotta-500 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <DollarSign className="mr-3 h-5 w-5" />
                Ventes
              </Link>
              
              <Link 
                to="/admin/support"
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive('/admin/support') 
                    ? "bg-terracotta-500 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                Support
              </Link>
              
              <Link 
                to="/admin/categories"
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive('/admin/categories') 
                    ? "bg-terracotta-500 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <Tag className="mr-3 h-5 w-5" />
                Catégories
              </Link>
              
              <Link 
                to="/admin/blog"
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  isActive('/admin/blog') 
                    ? "bg-terracotta-500 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <FileText className="mr-3 h-5 w-5" />
                Blog
              </Link>
            </div>
          </div>
          
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compte
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
