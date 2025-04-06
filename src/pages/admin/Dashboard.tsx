
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { Button } from '@/components/ui/button';
import { populateProductsForSubcategories, createRequestedProducts } from '@/utils/productPopulation';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
          <div className="flex space-x-2">
            <Button 
              onClick={() => populateProductsForSubcategories()}
              variant="outline"
            >
              Créer produits par sous-catégorie
            </Button>
            <Button 
              onClick={() => createRequestedProducts()}
              variant="default"
            >
              Créer les produits spécifiques
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <DashboardStats />
          </div>
          <div className="lg:col-span-4">
            <RecentActivity />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
