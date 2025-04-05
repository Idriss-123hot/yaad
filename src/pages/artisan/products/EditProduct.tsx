
import React from 'react';
import { useParams } from 'react-router-dom';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { ProductForm } from '@/components/products/ProductForm';

const ArtisanProductEdit = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <ArtisanLayout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Erreur: Produit non trouvé</h1>
          <p>L'identifiant du produit est manquant.</p>
        </div>
      </ArtisanLayout>
    );
  }

  return (
    <ArtisanLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>
        <ProductForm 
          productId={id}
          isAdmin={false}
          redirectPath="/artisan/products"
        />
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanProductEdit;
