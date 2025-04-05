
import React from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/products/ProductForm';

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Erreur: Produit non trouvé</h1>
          <p>L'identifiant du produit est manquant.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>
        <ProductForm 
          productId={id}
          isAdmin={true}
          redirectPath="/admin/products"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProductEdit;
