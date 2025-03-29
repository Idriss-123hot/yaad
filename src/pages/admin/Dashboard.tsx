
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/admin/login');
          return;
        }
        
        // Check if user has admin role
        const { data, error } = await supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        if (data?.role !== 'admin') {
          // Not authorized, redirect to login
          await supabase.auth.signOut();
          navigate('/admin/login');
          return;
        }
        
        setUsername(data.first_name ? `${data.first_name} ${data.last_name || ''}` : session.user.email);
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/admin/login');
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
          navigate('/admin/login');
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
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {username}</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/artisans/new')}
            className="bg-terracotta-600 hover:bg-terracotta-700"
          >
            Create New Artisan
          </Button>
        </div>
        
        <DashboardStats />
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentActivity title="Recent Artisans" type="artisans" />
          <RecentActivity title="Recent Products" type="products" />
        </div>
      </div>
    </AdminLayout>
  );
}
