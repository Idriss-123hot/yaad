
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArtisanForm } from '@/components/artisans/ArtisanForm';

const AdminArtisanNew = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Créer un nouvel artisan</h1>
        <ArtisanForm redirectPath="/admin/artisans" />
      </div>
    </AdminLayout>
  );
};

export default AdminArtisanNew;
