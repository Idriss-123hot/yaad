
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Users, ShoppingBag } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your marketplace
            </p>
          </div>
        </div>

        <DashboardStats />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Users className="h-8 w-8 text-terracotta-600" />
              <div>
                <CardTitle>Artisan Management</CardTitle>
                <CardDescription>
                  Create and manage artisan accounts
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Add new artisan accounts</li>
                  <li>Edit artisan profiles and details</li>
                  <li>Review artisan products</li>
                  <li>Track artisan performance</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate('/admin/artisans')}
                className="w-full gap-1 bg-terracotta-600 hover:bg-terracotta-700"
              >
                Manage Artisans
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <ShoppingBag className="h-8 w-8 text-terracotta-600" />
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Add and manage products in your marketplace
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Add new products to the marketplace</li>
                  <li>Edit product details and pricing</li>
                  <li>Manage categories and tags</li>
                  <li>Track product performance</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate('/admin/products')}
                className="w-full gap-1 bg-terracotta-600 hover:bg-terracotta-700"
              >
                Manage Products
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RecentActivity title="Recent Artisans" type="artisans" />
          <RecentActivity title="Recent Products" type="products" />
        </div>
      </div>
    </AdminLayout>
  );
}
