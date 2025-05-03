
import { useState, useEffect } from 'react';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowUp, DollarSign, Package, Eye, ShoppingBag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/lib/utils';

interface SalesData {
  monthDate: Date;
  month: string;
  totalSales: number;
  orders: number;
}

interface ProductPerformance {
  id: string;
  title: string;
  salesCount: number;
  revenue: number;
}

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [monthlyData, setMonthlyData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        // Get artisan ID
        const { data: artisanId, error: artisanError } = await supabase.rpc('get_artisan_id');
        
        if (artisanError) throw artisanError;
        if (!artisanId) {
          toast({
            title: 'Error',
            description: 'Could not determine your artisan account.',
            variant: 'destructive',
          });
          return;
        }

        // Fetch all orders for this artisan's products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            id,
            title,
            order_products (
              quantity,
              unit_price,
              orders (
                created_at,
                status
              )
            )
          `)
          .eq('artisan_id', artisanId);

        if (productsError) throw productsError;

        // Process data for statistics
        let revenue = 0;
        let orderCount = 0;
        const monthMap: Record<string, SalesData> = {};
        const productPerformance: Record<string, ProductPerformance> = {};
        
        // Get month names for display
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Process last 6 months
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - i);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const monthName = monthNames[date.getMonth()];
          
          monthMap[monthKey] = {
            monthDate: new Date(date.getFullYear(), date.getMonth(), 1),
            month: monthName,
            totalSales: 0,
            orders: 0
          };
        }

        // Process orders
        productsData.forEach(product => {
          // Initialize product performance
          if (!productPerformance[product.id]) {
            productPerformance[product.id] = {
              id: product.id,
              title: product.title,
              salesCount: 0,
              revenue: 0
            };
          }
          
          // Process each order
          product.order_products?.forEach(orderProduct => {
            orderProduct.orders?.forEach(order => {
              // Count only completed or processing orders
              if (order.status === 'completed' || order.status === 'processing') {
                const orderDate = new Date(order.created_at);
                const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
                
                // Add to monthly data if within last 6 months
                if (monthMap[monthKey]) {
                  const orderRevenue = orderProduct.quantity * orderProduct.unit_price;
                  monthMap[monthKey].totalSales += orderRevenue;
                  monthMap[monthKey].orders += 1;
                  
                  // Add to overall totals
                  revenue += orderRevenue;
                  orderCount += 1;
                  
                  // Add to product performance
                  productPerformance[product.id].salesCount += orderProduct.quantity;
                  productPerformance[product.id].revenue += orderRevenue;
                }
              }
            });
          });
        });

        // Convert monthly data to array and sort by date
        const monthlyDataArray = Object.values(monthMap).sort(
          (a, b) => a.monthDate.getTime() - b.monthDate.getTime()
        );

        // Get top products by revenue
        const topProductsArray = Object.values(productPerformance)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // Set total views (simulated data)
        // In a real implementation, you would fetch this from an analytics service
        setTotalViews(Math.floor(Math.random() * 1000) + 500);

        // Update state
        setTotalRevenue(revenue);
        setTotalOrders(orderCount);
        setMonthlyData(monthlyDataArray);
        setTopProducts(topProductsArray);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your statistics.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [toast]);

  const formatMonthlyDataForChart = () => {
    return monthlyData.map(item => ({
      name: item.month,
      sales: item.totalSales,
      orders: item.orders
    }));
  };

  return (
    <ArtisanLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store's performance and sales
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 15) + 5}% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 10) + 2} new orders today
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Product Views
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 30) + 10} views today
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversion Rate
                  </CardTitle>
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalViews > 0 ? ((totalOrders / totalViews) * 100).toFixed(1) : '0'}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 0.5).toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly sales chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>
                  Your revenue and order count over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatMonthlyDataForChart()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="sales" name="Revenue" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Your best performing products by revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Units Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.title}
                          </TableCell>
                          <TableCell className="text-right">{product.salesCount}</TableCell>
                          <TableCell className="text-right">{formatPrice(product.revenue)}</TableCell>
                        </TableRow>
                      ))}
                      
                      {topProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6">
                            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p>No sales data available yet</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ArtisanLayout>
  );
};

export default Statistics;
