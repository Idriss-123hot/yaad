import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';

export default function ArtisanDashboard() {
  const [loading, setLoading] = useState(true);
  const [artisanData, setArtisanData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Fetch artisan data
  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
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
        console.error('Error in fetching artisan data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtisanData();
  }, [toast]);
  
  if (loading) {
    return (
      <ArtisanLayout>
        <div className="flex items-center justify-center h-full p-8">
          <Loader2 className="h-12 w-12 animate-spin text-terracotta-600" />
        </div>
      </ArtisanLayout>
    );
  }
  
  return (
    <ArtisanLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-serif">
            Bienvenue, {artisanData?.name || 'Artisan'}
          </h1>
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
    </ArtisanLayout>
  );
}
