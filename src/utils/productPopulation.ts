
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Function to populate the products table with one product per subcategory
 * This is intended to be called from the admin interface
 */
export const populateProductsForSubcategories = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('populate-products');
    
    if (error) {
      throw error;
    }
    
    if (data.success) {
      toast({
        title: "Produits créés avec succès",
        description: `${data.products.length} produits ont été créés, un pour chaque sous-catégorie.`
      });
      return true;
    } else {
      throw new Error(data.error || "Une erreur s'est produite");
    }
  } catch (error) {
    console.error("Error populating products:", error);
    toast({
      title: "Erreur lors de la création des produits",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
};
