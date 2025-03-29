
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  title: string;
  type: 'artisans' | 'products';
}

export function RecentActivity({ title, type }: RecentActivityProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query;

        if (type === 'artisans') {
          query = supabase
            .from('artisans')
            .select('id, name, location, created_at')
            .order('created_at', { ascending: false })
            .limit(5);
        } else {
          query = supabase
            .from('products')
            .select('id, title, price, created_at, artisan:artisans(name)')
            .order('created_at', { ascending: false })
            .limit(5);
        }

        const { data, error } = await query;

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const handleView = (id: string) => {
    if (type === 'artisans') {
      navigate(`/admin/artisans/${id}`);
    } else {
      navigate(`/admin/products/${id}`);
    }
  };

  const handleViewAll = () => {
    navigate(`/admin/${type}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{type === 'artisans' ? 'Artisan' : 'Product'}</TableHead>
                {type === 'artisans' ? (
                  <TableHead>Location</TableHead>
                ) : (
                  <>
                    <TableHead>Price</TableHead>
                    <TableHead>Artisan</TableHead>
                  </>
                )}
                <TableHead>Added</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No {type} found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {type === 'artisans' ? item.name : item.title}
                    </TableCell>
                    {type === 'artisans' ? (
                      <TableCell>{item.location || 'N/A'}</TableCell>
                    ) : (
                      <>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.artisan?.name || 'N/A'}</TableCell>
                      </>
                    )}
                    <TableCell>
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(item.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
