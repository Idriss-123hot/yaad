
import { useState, useEffect } from 'react';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: string;
  orderDate: Date;
  customerName?: string;
  customerEmail?: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
}

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // First get the artisan's ID
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
        
        // Fetch orders for this artisan
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            title,
            order_products!inner (
              quantity,
              unit_price,
              orders!inner (
                id,
                created_at,
                total_amount,
                status,
                user_id,
                profiles:user_id (
                  first_name,
                  last_name,
                  email
                )
              )
            )
          `)
          .eq('artisan_id', artisanId)
          .order('created_at', { foreignTable: 'order_products.orders', ascending: false });
          
        if (error) throw error;
        
        // Process and format the data
        const processedOrders: Order[] = [];
        data.forEach(product => {
          product.order_products.forEach(orderProduct => {
            const order = orderProduct.orders;
            processedOrders.push({
              id: order.id,
              orderDate: new Date(order.created_at),
              customerName: order.profiles?.first_name && order.profiles?.last_name ? 
                `${order.profiles.first_name} ${order.profiles.last_name}` : undefined,
              customerEmail: order.profiles?.email,
              productTitle: product.title,
              quantity: orderProduct.quantity,
              unitPrice: orderProduct.unit_price,
              totalAmount: order.total_amount,
              status: order.status
            });
          });
        });
        
        setOrders(processedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch order data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  return (
    <ArtisanLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Your Orders</h1>
          <p className="text-muted-foreground">
            Manage orders for your products
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{activeTab === 'all' ? 'All Orders' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`}</CardTitle>
                <CardDescription>
                  {activeTab === 'all' 
                    ? 'All orders for your products' 
                    : `Orders with ${activeTab} status`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filterOrders(activeTab).length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Date</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterOrders(activeTab).map((order) => (
                          <TableRow key={`${order.id}-${order.productTitle}`}>
                            <TableCell>
                              {format(order.orderDate, 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell className="font-medium">
                              {order.productTitle}
                            </TableCell>
                            <TableCell>
                              {order.customerName || order.customerEmail || 'Unknown Customer'}
                            </TableCell>
                            <TableCell className="text-right">
                              {order.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPrice(order.unitPrice)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  order.status === 'completed'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : order.status === 'processing'
                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }
                                variant="outline"
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No orders found</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'all' 
                        ? 'You have not received any orders yet' 
                        : `You have no ${activeTab} orders`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ArtisanLayout>
  );
};

export default OrdersList;
