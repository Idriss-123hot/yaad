
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShoppingBag, BarChart, Users } from 'lucide-react';

interface Stat {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  change?: number;
  color: string;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stat[]>([
    {
      title: 'Total Artisans',
      value: 0,
      icon: User,
      description: 'Active artisan accounts',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Total Products',
      value: 0,
      icon: ShoppingBag,
      description: 'Products in marketplace',
      color: 'bg-green-100 text-green-800',
    },
    {
      title: 'Categories',
      value: 0,
      icon: BarChart,
      description: 'Product categories',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Total Users',
      value: 0,
      icon: Users,
      description: 'Registered customers',
      color: 'bg-amber-100 text-amber-800',
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch artisan count
        const { count: artisanCount, error: artisanError } = await supabase
          .from('artisans')
          .select('*', { count: 'exact', head: true });

        // Fetch product count
        const { count: productCount, error: productError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch category count
        const { count: categoryCount, error: categoryError } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });

        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer');

        if (!artisanError && !productError && !categoryError && !userError) {
          setStats([
            { ...stats[0], value: artisanCount || 0 },
            { ...stats[1], value: productCount || 0 },
            { ...stats[2], value: categoryCount || 0 },
            { ...stats[3], value: userCount || 0 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
