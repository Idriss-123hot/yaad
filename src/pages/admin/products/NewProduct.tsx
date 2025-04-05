
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/products/ProductForm';

const AdminProductNew = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Créer un nouveau produit</h1>
        <ProductForm 
          isAdmin={true}
          redirectPath="/admin/products"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProductNew;
