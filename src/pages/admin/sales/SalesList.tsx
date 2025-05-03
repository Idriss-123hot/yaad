
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Loader2, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Sale {
  id: string;
  orderDate: Date;
  product: {
    id: string;
    title: string;
  };
  artisan: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
}

const SalesList = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            total_amount,
            status,
            user_id,
            order_products (
              product_id,
              quantity,
              unit_price,
              products:product_id (
                title,
                artisan_id,
                artisans:artisan_id (
                  name
                )
              )
            ),
            profiles:user_id (
              email,
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process and map the data
        const processedSales = data.flatMap(order => {
          return (order.order_products || []).map(item => ({
            id: order.id,
            orderDate: new Date(order.created_at),
            product: {
              id: item.product_id,
              title: item.products?.title || 'Unknown Product',
            },
            artisan: {
              id: item.products?.artisan_id || '',
              name: item.products?.artisans?.name || 'Unknown Artisan',
            },
            customer: {
              id: order.user_id || '',
              email: order.profiles?.email || 'Unknown Customer',
              firstName: order.profiles?.first_name,
              lastName: order.profiles?.last_name,
            },
            quantity: item.quantity,
            unitPrice: item.unit_price,
            totalAmount: order.total_amount,
            status: order.status,
          }));
        });

        setSales(processedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch sales data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Sales Overview</h1>
          <p className="text-muted-foreground">
            View and manage all sales and orders
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Showing the most recent orders across all artisans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sales.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Artisan</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale, index) => (
                        <TableRow key={`${sale.id}-${index}`}>
                          <TableCell>
                            {format(sale.orderDate, 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="font-medium">
                            {sale.product.title}
                          </TableCell>
                          <TableCell>{sale.artisan.name}</TableCell>
                          <TableCell>
                            {sale.customer.firstName && sale.customer.lastName
                              ? `${sale.customer.firstName} ${sale.customer.lastName}`
                              : sale.customer.email}
                          </TableCell>
                          <TableCell className="text-right">{sale.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatPrice(sale.unitPrice)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span
                                className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                  sale.status === 'completed'
                                    ? 'bg-green-500'
                                    : sale.status === 'processing'
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-400'
                                }`}
                              />
                              {sale.status}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No sales yet</h3>
                  <p className="text-muted-foreground">
                    Sales will appear here as customers place orders
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesList;
