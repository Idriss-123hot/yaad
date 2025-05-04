
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Loader2 } from 'lucide-react';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/hooks/useCategories';

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        navigate('/admin/categories');
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCategory(data);
        } else {
          toast({
            title: 'Catégorie non trouvée',
            description: 'La catégorie que vous essayez de modifier n\'existe pas.',
            variant: 'destructive',
          });
          navigate('/admin/categories');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de récupérer les données de la catégorie.',
          variant: 'destructive',
        });
        navigate('/admin/categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [id, navigate, toast]);

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Modifier la Catégorie</h1>
          <p className="text-muted-foreground">Mettre à jour les détails de la catégorie</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
            </div>
          ) : category ? (
            <CategoryForm category={category} />
          ) : null}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCategory;
