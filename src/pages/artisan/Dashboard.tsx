
import { useState, useEffect } from 'react';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, Star, Activity, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentArtisanId } from '@/utils/authUtils';

export default function ArtisanDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productCount: 0,
    avgRating: 0,
    recentOrders: 0,
  });
  const [artisanName, setArtisanName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const artisanId = await getCurrentArtisanId();
        
        if (!artisanId) {
          toast({
            title: 'Error',
            description: 'Could not retrieve your artisan profile',
            variant: 'destructive',
          });
          return;
        }

        // Get artisan details
        const { data: artisanData, error: artisanError } = await supabase
          .from('artisans')
          .select('name')
          .eq('id', artisanId)
          .single();
        
        if (artisanError) throw artisanError;
        setArtisanName(artisanData.name);

        // Get product count
        const { count: productCount, error: productError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('artisan_id', artisanId);
        
        if (productError) throw productError;

        // Get average rating
        const { data: ratingData, error: ratingError } = await supabase
          .from('artisans')
          .select('rating')
          .eq('id', artisanId)
          .single();
        
        if (ratingError) throw ratingError;

        // For this example, we'll use a placeholder for recent orders
        // In a real application, you would fetch this from an orders table

        setStats({
          productCount: productCount || 0,
          avgRating: ratingData.rating || 0,
          recentOrders: 0, // Placeholder
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  return (
    <ArtisanLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome back, {artisanName || 'Artisan'}</h1>
          <p className="text-muted-foreground">
            Manage your products and track your performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-12 animate-pulse rounded bg-gray-200" />
                ) : (
                  stats.productCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.productCount >= 20 ? 'Maximum limit reached' : `${20 - stats.productCount} more available`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-12 animate-pulse rounded bg-gray-200" />
                ) : (
                  stats.avgRating.toFixed(1)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on customer reviews
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-12 animate-pulse rounded bg-gray-200" />
                ) : (
                  stats.recentOrders
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                In the last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center md:justify-start mb-8">
          <Button 
            onClick={() => navigate('/artisan/products/new')}
            className="bg-terracotta-600 hover:bg-terracotta-700"
            disabled={stats.productCount >= 20}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {/* Placeholder for recent activity or products list */}
        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
            <CardDescription>
              Manage and update your product listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
            ) : stats.productCount === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No products yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first product to start selling
                </p>
                <Button 
                  onClick={() => navigate('/artisan/products/new')}
                  variant="outline"
                >
                  Create Product
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button 
                  onClick={() => navigate('/artisan/products')}
                  variant="outline"
                >
                  View All Products
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ArtisanLayout>
  );
}
