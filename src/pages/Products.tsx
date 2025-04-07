
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { ProductCard } from '@/components/ui/ProductCard';
import { SAMPLE_PRODUCTS } from '@/data/sampleData'; // Changed import source to data/sampleData

const Products = () => {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  
  useEffect(() => {
    // In a real app, we would fetch products from API
    // This is just using sample data for now
    console.log('Products page loaded');
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Nos Produits</h1>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-xl font-bold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Nous travaillons à ajouter de nouveaux produits bientôt.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default Products;
