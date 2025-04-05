
import React from 'react';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { ProductForm } from '@/components/products/ProductForm';

const ArtisanProductNew = () => {
  return (
    <ArtisanLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Créer un nouveau produit</h1>
        <ProductForm 
          isAdmin={false}
          redirectPath="/artisan/products"
        />
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanProductNew;
