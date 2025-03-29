
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { ShoppingBag, LineChart, BarChart4 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ArtisanDashboard() {
  const [loading, setLoading] = useState(true);
  const [artisanData, setArtisanData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    averageRating: 0,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/artisan/login');
          return;
        }
        
        // Check if user has artisan role and get artisan data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, id, first_name, last_name')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (profileData?.role !== 'artisan') {
          // Not authorized, redirect to login
          await supabase.auth.signOut();
          navigate('/artisan/login');
          return;
        }
        
        // Get artisan details
        const { data: artisan, error: artisanError } = await supabase
          .from('artisans')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (artisanError) throw artisanError;
        
        setArtisanData(artisan);
        
        // Get product stats
        const { count: productCount, error: productError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('artisan_id', artisan.id);
        
        if (productError) throw productError;
        
        // In a real app, we would get these from analytics
        // Here we're just using placeholder data
        setStats({
          totalProducts: productCount || 0,
          totalViews: Math.floor(Math.random() * 1000),
          averageRating: artisan.rating || 0,
        });
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/artisan/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up inactivity tracker for auto logout
    let inactivityTimer: number;
    
    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        supabase.auth.signOut().then(() => {
          toast({
            title: 'Session expired',
            description: 'You have been logged out due to inactivity',
          });
          navigate('/artisan/login');
        });
      }, 30 * 60 * 1000); // 30 minutes
    };
    
    // Events that reset the timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });
    
    resetInactivityTimer();
    
    return () => {
      window.clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
      </div>
    );
  }

  return (
    <ArtisanLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {artisanData?.name}</h1>
            <p className="text-muted-foreground">
              Manage your products and track your performance
            </p>
          </div>
          <Button 
            onClick={() => navigate('/artisan/products/new')}
            className="bg-terracotta-600 hover:bg-terracotta-700"
          >
            Add New Product
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <CardDescription>
                {stats.totalProducts < 20 
                  ? `You can add ${20 - stats.totalProducts} more products`
                  : 'You have reached the maximum limit'}
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Product Views</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <CardDescription>Total product views this month</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5.0</div>
              <CardDescription>Based on {artisanData?.review_count || 0} reviews</CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Recent Products</h2>
          {/* Product list would go here, implementing in future code */}
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Start adding your handcrafted products to showcase your work to customers.
            </p>
            <Button 
              className="mt-4 bg-terracotta-600 hover:bg-terracotta-700"
              onClick={() => navigate('/artisan/products/new')}
            >
              Add Your First Product
            </Button>
          </Card>
        </div>
      </div>
    </ArtisanLayout>
  );
}
