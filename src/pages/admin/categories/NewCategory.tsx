
import { AdminLayout } from '@/components/admin/AdminLayout';
import CategoryForm from '@/components/admin/categories/CategoryForm';

const NewCategory = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Nouvelle Catégorie</h1>
          <p className="text-muted-foreground">Créer une nouvelle catégorie de produits</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <CategoryForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewCategory;
