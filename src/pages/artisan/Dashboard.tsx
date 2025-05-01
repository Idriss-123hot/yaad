
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { checkArtisanRole } from '@/utils/authUtils';
import { Loader2, ArrowLeft, LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ArtisanDashboard() {
  const [loading, setLoading] = useState(true);
  const [artisanData, setArtisanData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/artisan/login');
          return;
        }
        
        const isArtisan = await checkArtisanRole();
        if (!isArtisan) {
          toast({
            title: 'Accès refusé',
            description: 'Vous n\'avez pas les privilèges artisan',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        // Fetch artisan data
        const { data: artisan, error: artisanError } = await supabase
          .from('artisans')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (artisanError) {
          console.error('Error fetching artisan data:', artisanError);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger vos données',
            variant: 'destructive',
          });
          return;
        }
        
        setArtisanData(artisan);
        
        // Fetch recent orders (placeholder for now)
        setRecentOrders([]);
        
      } catch (error) {
        console.error('Error in auth check:', error);
        toast({
          title: 'Erreur d\'authentification',
          description: 'Veuillez vous reconnecter',
          variant: 'destructive',
        });
        navigate('/artisan/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Déconnexion réussie',
        description: 'À bientôt !',
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la déconnexion',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-terracotta-600" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-6 hidden md:block">
          <div className="mb-8">
            <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
              yaad<span className="text-terracotta-600">.com</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">Espace Artisan</p>
          </div>
          
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/artisan/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/artisan/products">
                <Package className="mr-2 h-4 w-4" />
                Mes Produits
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/artisan/settings">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </Button>
          </nav>
          
          <div className="mt-auto pt-8">
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold font-serif">
                Bienvenue, {artisanData?.name || 'Artisan'}
              </h1>
              <div className="flex md:hidden">
                <Button variant="outline" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Produits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ventes ce mois-ci
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0 €</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Commandes en attente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-serif">Commandes récentes</h2>
                <Button variant="outline">Voir toutes</Button>
              </div>
              <Card>
                {recentOrders.length > 0 ? (
                  <CardContent>
                    {/* Order list would go here */}
                    <p>List of recent orders</p>
                  </CardContent>
                ) : (
                  <CardContent className="p-6">
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Vous n'avez pas encore de commandes</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
            
            <div>
              <Button asChild>
                <Link to="/artisan/products/new">
                  Ajouter un nouveau produit
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
