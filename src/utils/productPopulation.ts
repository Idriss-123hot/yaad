
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

/**
 * Function to create specific products in the database
 * @param products Array of product data objects to create
 */
export const createSpecificProducts = async (products: any[]): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('populate-products', {
      method: 'POST',
      body: { products },
      headers: {
        'Content-Type': 'application/json',
        // Add mode as a URL parameter using the correct format
        'x-mode': 'specific'
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (data.success) {
      toast({
        title: "Produits créés avec succès",
        description: `${data.products.length} produits spécifiques ont été créés.`
      });
      return true;
    } else {
      throw new Error(data.error || "Une erreur s'est produite");
    }
  } catch (error) {
    console.error("Error creating specific products:", error);
    toast({
      title: "Erreur lors de la création des produits",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
};

// Function to create the specific products requested in the user's prompt
export const createRequestedProducts = async (): Promise<boolean> => {
  // List of specific products to create from the user's request
  const productsToCreate = [
    {
      title: "Sac en cuir marocain",
      description: "Sac artisanal en cuir de haute qualité, réalisé à la main par des artisans marocains.",
      price: "120.00",
      discount_price: "100.00",
      category_id: "4c21aa10-d5f4-4ad5-b3ff-1d902588cbf3",
      tags: "artisanat, cuir, marocain, sac",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "10",
      artisan_id: "31fe3b2d-f94a-42b1-b3f6-920c07e063a8",
      rating: "4.9",
      review_count: "15",
      featured: "true",
      is_custom_order: "false",
      production_time: "7 jours",
      material: "Cuir",
      origin: "Maroc",
      subcategory_id: "01376a9d-64fc-41be-9242-26437226f698"
    },
    {
      title: "Tapis berbère tissé à la main",
      description: "Tapis artisanal berbère, réalisé par des maîtres tisserands, alliant motifs traditionnels et savoir-faire ancestral.",
      price: "350.00",
      discount_price: "300.00",
      category_id: "928c2c58-c37d-45f4-b40e-d94b4ce2e8f2",
      tags: "tapis, berbère, marocain, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "5",
      artisan_id: "d12a06f3-94eb-4d17-8dc4-17133838477c",
      rating: "4.9",
      review_count: "20",
      featured: "true",
      is_custom_order: "true",
      production_time: "15 jours",
      material: "Laine",
      origin: "Maroc",
      subcategory_id: "1cf6b98c-604c-4548-99d5-de4d5451f673"
    },
    {
      title: "Babouches en cuir traditionnelles",
      description: "Babouches confectionnées en cuir selon les méthodes traditionnelles marocaines, confortables et colorées.",
      price: "80.00",
      discount_price: "70.00",
      category_id: "77242d41-5b56-48ed-9560-f05ce516ad7d",
      tags: "babouches, cuir, marocain, tradition",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "25",
      artisan_id: "8e9135f4-46d9-44f3-bbd3-372cc6456b8e",
      rating: "4.8",
      review_count: "30",
      featured: "false",
      is_custom_order: "false",
      production_time: "10 jours",
      material: "Cuir",
      origin: "Maroc",
      subcategory_id: "2f98e86e-126a-439f-b53f-67e5b0b80cda"
    },
    {
      title: "Coffret de soins naturels",
      description: "Coffret regroupant des soins naturels artisanaux, élaboré avec des huiles essentielles et extraits de plantes locales.",
      price: "60.00",
      discount_price: "50.00",
      category_id: "f147ea0b-c0e8-4225-9f4b-46a87b61a190",
      tags: "soins, naturels, coffret, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "30",
      artisan_id: "837d190c-a0b8-4633-b7fb-33dd1c6cc245",
      rating: "4.6",
      review_count: "12",
      featured: "false",
      is_custom_order: "true",
      production_time: "5 jours",
      material: "Huiles, Plantes",
      origin: "Maroc",
      subcategory_id: "30dfff6a-3aa5-4765-8703-0f7051bdbd02"
    },
    {
      title: "Savon artisanal au ghassoul",
      description: "Savon traditionnel à base de ghassoul et argile, préparé de façon artisanale pour une peau douce.",
      price: "15.00",
      discount_price: "12.00",
      category_id: "f147ea0b-c0e8-4225-9f4b-46a87b61a190",
      tags: "savon, ghassoul, artisanal, marocain",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "50",
      artisan_id: "2777700f-6db1-4ec7-ae1e-e63f79f7d73d",
      rating: "4.9",
      review_count: "40",
      featured: "true",
      is_custom_order: "false",
      production_time: "3 jours",
      material: "Argile",
      origin: "Maroc",
      subcategory_id: "51b54bc9-d2eb-4972-8747-36a7b2f91edb"
    },
    {
      title: "Masque facial à l'argile",
      description: "Masque facial nourrissant à base d'argile naturelle, adapté à tous types de peau et aux rituels de beauté marocains.",
      price: "20.00",
      discount_price: "18.00",
      category_id: "f147ea0b-c0e8-4225-9f4b-46a87b61a190",
      tags: "masque, facial, argile, soin, marocain",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "40",
      artisan_id: "e8b0ce0b-7ead-47c3-9fcd-20b4e74868dd",
      rating: "4.7",
      review_count: "18",
      featured: "false",
      is_custom_order: "false",
      production_time: "4 jours",
      material: "Argile",
      origin: "Maroc",
      subcategory_id: "5dbf2473-8c39-400d-9bc7-47c56e7fc6c7"
    },
    {
      title: "Tenture murale berbère",
      description: "Tenture murale artisanale inspirée des motifs berbères traditionnels, réalisée avec un tissu de qualité.",
      price: "200.00",
      discount_price: "180.00",
      category_id: "928c2c58-c37d-45f4-b40e-d94b4ce2e8f2",
      tags: "tenture, murale, berbère, textile",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "8",
      artisan_id: "d3633fbe-5fd4-49f1-9e92-456bfeae81a9",
      rating: "4.8",
      review_count: "22",
      featured: "true",
      is_custom_order: "true",
      production_time: "20 jours",
      material: "Tissu",
      origin: "Maroc",
      subcategory_id: "68bf2d72-f28d-4b86-b200-ad5e088c3349"
    },
    {
      title: "Plateau en cuivre martelé",
      description: "Plateau artisanal en cuivre martelé, fabriqué selon des techniques traditionnelles pour une pièce unique.",
      price: "45.00",
      discount_price: "40.00",
      category_id: "928c2c58-c37d-45f4-b40e-d94b4ce2e8f2",
      tags: "plateau, cuivre, martelé, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "15",
      artisan_id: "81e4a807-f289-4e47-8a66-addad3c52ad9",
      rating: "4.8",
      review_count: "10",
      featured: "false",
      is_custom_order: "false",
      production_time: "7 jours",
      material: "Cuivre",
      origin: "Maroc",
      subcategory_id: "6c07e7e9-4678-4e33-a084-ac26acda3c4a"
    },
    {
      title: "Bracelet berbère en argent",
      description: "Bracelet artisanal en argent, inspiré des motifs berbères, fabriqué par un maître bijoutier.",
      price: "75.00",
      discount_price: "65.00",
      category_id: "77242d41-5b56-48ed-9560-f05ce516ad7d",
      tags: "bijoux, argent, berbère, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "20",
      artisan_id: "5a703c00-d3f7-4d9b-9a06-f890dae91ffa",
      rating: "4.9",
      review_count: "25",
      featured: "true",
      is_custom_order: "false",
      production_time: "10 jours",
      material: "Argent",
      origin: "Maroc",
      subcategory_id: "5becefc0-0bd4-4be5-b6a2-52b556e64b3d"
    },
    {
      title: "Collier en perles artisanales",
      description: "Collier raffiné en perles, confectionné à la main et inspiré de la tradition féminine marocaine.",
      price: "90.00",
      discount_price: "80.00",
      category_id: "4c21aa10-d5f4-4ad5-b3ff-1d902588cbf3",
      tags: "bijoux, perles, artisanal, marocain",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "15",
      artisan_id: "2777700f-6db1-4ec7-ae1e-e63f79f7d73d",
      rating: "4.8",
      review_count: "18",
      featured: "false",
      is_custom_order: "false",
      production_time: "8 jours",
      material: "Perles",
      origin: "Maroc",
      subcategory_id: "751572e7-6d65-4389-a2b7-fbab194f2b7b"
    },
    {
      title: "Sérum capillaire aux huiles d'argan",
      description: "Sérum capillaire nourrissant élaboré à partir d'huiles naturelles d'argan pour revitaliser et protéger vos cheveux.",
      price: "40.00",
      discount_price: "35.00",
      category_id: "f147ea0b-c0e8-4225-9f4b-46a87b61a190",
      tags: "soin, cheveux, argan, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "50",
      artisan_id: "837d190c-a0b8-4633-b7fb-33dd1c6cc245",
      rating: "4.7",
      review_count: "14",
      featured: "true",
      is_custom_order: "true",
      production_time: "5 jours",
      material: "Huiles naturelles",
      origin: "Maroc",
      subcategory_id: "7e074579-b294-4af4-a349-1bb07deb173b"
    },
    {
      title: "Épices du souk marocain",
      description: "Mélange d'épices artisanales, typique des souks marocains, pour relever vos plats de saveurs authentiques.",
      price: "25.00",
      discount_price: "20.00",
      category_id: "c4606901-d9b8-4bbd-b42e-5532e3b6792e",
      tags: "épices, gourmet, marocain, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "100",
      artisan_id: "d3633fbe-5fd4-49f1-9e92-456bfeae81a9",
      rating: "4.8",
      review_count: "22",
      featured: "false",
      is_custom_order: "false",
      production_time: "3 jours",
      material: "Mélange d'épices",
      origin: "Maroc",
      subcategory_id: "a014ca54-d68e-458f-8f0a-ee9fce0bf108"
    },
    {
      title: "Coussin brodé artisanal pour enfants",
      description: "Coussin décoratif pour enfants, orné de broderies traditionnelles et confectionné avec soin.",
      price: "35.00",
      discount_price: "30.00",
      category_id: "928c2c58-c37d-45f4-b40e-d94b4ce2e8f2",
      tags: "coussin, broderie, enfant, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "40",
      artisan_id: "8920fbc3-c363-41e4-9f7f-4fbe38b4179f",
      rating: "4.7",
      review_count: "10",
      featured: "true",
      is_custom_order: "false",
      production_time: "6 jours",
      material: "Tissu",
      origin: "Maroc",
      subcategory_id: "a534deed-7059-474e-8009-165bad30e2cd"
    },
    {
      title: "Bougie parfumée artisanale",
      description: "Bougie fabriquée à la main avec des parfums naturels pour créer une ambiance chaleureuse et authentique.",
      price: "18.00",
      discount_price: "15.00",
      category_id: "928c2c58-c37d-45f4-b40e-d94b4ce2e8f2",
      tags: "bougie, parfum, artisanal, maison",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "60",
      artisan_id: "e8b0ce0b-7ead-47c3-9fcd-20b4e74868dd",
      rating: "4.7",
      review_count: "12",
      featured: "false",
      is_custom_order: "false",
      production_time: "2 jours",
      material: "Cire",
      origin: "Maroc",
      subcategory_id: "aacd8fca-1fdc-4ec6-935d-9344aa95f6df"
    },
    {
      title: "Miroir en bois sculpté",
      description: "Miroir unique en bois, finement sculpté à la main, apportant une touche d'élégance artisanale à votre intérieur.",
      price: "150.00",
      discount_price: "130.00",
      category_id: "928c2c58-c37d-45f4-b40e-d94b4ce2e8f2",
      tags: "miroir, bois, sculpté, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "5",
      artisan_id: "8e9135f4-46d9-44f3-bbd3-372cc6456b8e",
      rating: "4.8",
      review_count: "16",
      featured: "true",
      is_custom_order: "true",
      production_time: "12 jours",
      material: "Bois",
      origin: "Maroc",
      subcategory_id: "b4cbd6a7-407d-48dc-b805-3a7aae7af58e"
    },
    {
      title: "Pochette en broderie traditionnelle",
      description: "Petite pochette réalisée à la main avec des motifs brodés inspirés du patrimoine marocain.",
      price: "45.00",
      discount_price: "40.00",
      category_id: "4c21aa10-d5f4-4ad5-b3ff-1d902588cbf3",
      tags: "accessoires, pochette, broderie, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "30",
      artisan_id: "2777700f-6db1-4ec7-ae1e-e63f79f7d73d",
      rating: "4.9",
      review_count: "8",
      featured: "false",
      is_custom_order: "false",
      production_time: "4 jours",
      material: "Tissu",
      origin: "Maroc",
      subcategory_id: "c0bf4840-61b3-457d-89ec-668dac3d6376"
    },
    {
      title: "Chemise en lin brodée",
      description: "Chemise élégante en lin avec des broderies traditionnelles, alliant confort et style artisanal.",
      price: "60.00",
      discount_price: "55.00",
      category_id: "77242d41-5b56-48ed-9560-f05ce516ad7d",
      tags: "vêtement, chemise, lin, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "20",
      artisan_id: "31fe3b2d-f94a-42b1-b3f6-920c07e063a8",
      rating: "4.8",
      review_count: "14",
      featured: "true",
      is_custom_order: "false",
      production_time: "7 jours",
      material: "Lin",
      origin: "Maroc",
      subcategory_id: "cb5111f1-873f-4353-b615-b49bfa6af71a"
    },
    {
      title: "Ceinture en cuir gravée",
      description: "Ceinture artisanale en cuir avec des motifs gravés, symbole d'un savoir-faire ancestral.",
      price: "50.00",
      discount_price: "45.00",
      category_id: "77242d41-5b56-48ed-9560-f05ce516ad7d",
      tags: "accessoires, ceinture, cuir, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "35",
      artisan_id: "5a703c00-d3f7-4d9b-9a06-f890dae91ffa",
      rating: "4.9",
      review_count: "20",
      featured: "false",
      is_custom_order: "true",
      production_time: "6 jours",
      material: "Cuir",
      origin: "Maroc",
      subcategory_id: "d1c902a7-a299-4a64-9fc0-7af500252ba1"
    },
    {
      title: "Porte-clés en cuir pour garçon",
      description: "Porte-clés original en cuir, pensé pour les garçons, alliant design moderne et tradition artisanale.",
      price: "12.00",
      discount_price: "10.00",
      category_id: "77242d41-5b56-48ed-9560-f05ce516ad7d",
      tags: "accessoires, porte-clés, cuir, enfant",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "50",
      artisan_id: "81e4a807-f289-4e47-8a66-addad3c52ad9",
      rating: "4.8",
      review_count: "9",
      featured: "false",
      is_custom_order: "false",
      production_time: "3 jours",
      material: "Cuir",
      origin: "Maroc",
      subcategory_id: "d6b67a5d-1cd4-458b-939e-793c6eb7c6c7"
    },
    {
      title: "Table basse en mosaïque",
      description: "Table basse unique ornée de mosaïques réalisées à la main, fusion de tradition et modernité.",
      price: "220.00",
      discount_price: "200.00",
      category_id: "928c2c58-c37d-45f4-b40e-d94b4ce2e8f2",
      tags: "meuble, table basse, mosaïque, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "3",
      artisan_id: "d12a06f3-94eb-4d17-8dc4-17133838477c",
      rating: "4.9",
      review_count: "30",
      featured: "true",
      is_custom_order: "true",
      production_time: "14 jours",
      material: "Mosaïque",
      origin: "Maroc",
      subcategory_id: "da7d73a1-9812-416c-9ef4-ec8761d69d20"
    },
    {
      title: "Robe en soie brodée",
      description: "Robe élégante en soie avec des broderies traditionnelles, symbole du raffinement artisanal marocain.",
      price: "150.00",
      discount_price: "135.00",
      category_id: "4c21aa10-d5f4-4ad5-b3ff-1d902588cbf3",
      tags: "vêtement, robe, soie, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "10",
      artisan_id: "2777700f-6db1-4ec7-ae1e-e63f79f7d73d",
      rating: "4.9",
      review_count: "20",
      featured: "true",
      is_custom_order: "false",
      production_time: "9 jours",
      material: "Soie",
      origin: "Maroc",
      subcategory_id: "e016e0c1-d95d-43f7-9a46-4accea97ded2"
    },
    {
      title: "Mini sac à dos artisanal",
      description: "Petit sac à dos coloré, confectionné à la main avec des techniques traditionnelles, idéal pour les enfants.",
      price: "30.00",
      discount_price: "25.00",
      category_id: "4c21aa10-d5f4-4ad5-b3ff-1d902588cbf3",
      tags: "sac, enfant, artisanal, coloré",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "45",
      artisan_id: "837d190c-a0b8-4633-b7fb-33dd1c6cc245",
      rating: "4.8",
      review_count: "11",
      featured: "false",
      is_custom_order: "false",
      production_time: "4 jours",
      material: "Tissu",
      origin: "Maroc",
      subcategory_id: "e5b09230-6edc-4a29-8b92-42b5d90ad790"
    },
    {
      title: "Escarpins en cuir exotique",
      description: "Escarpins élégants en cuir, confectionnés artisanalement pour offrir confort et style raffiné.",
      price: "100.00",
      discount_price: "90.00",
      category_id: "4c21aa10-d5f4-4ad5-b3ff-1d902588cbf3",
      tags: "chaussures, escarpins, cuir, artisanal",
      images: "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg",
      stock: "12",
      artisan_id: "8920fbc3-c363-41e4-9f7f-4fbe38b4179f",
      rating: "4.8",
      review_count: "13",
      featured: "true",
      is_custom_order: "true",
      production_time: "8 jours",
      material: "Cuir",
      origin: "Maroc",
      subcategory_id: "e82048dd-71ef-46a1-a6ed-2de8e020e615"
    }
  ];
  
  return createSpecificProducts(productsToCreate);
};
