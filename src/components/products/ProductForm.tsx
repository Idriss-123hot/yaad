
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Image, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadFile } from '@/utils/storageUtils';

// Form validation schema
const productSchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères' }),
  price: z.coerce.number().positive({ message: 'Le prix doit être supérieur à 0' }),
  discount_price: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative({ message: 'Le stock ne peut pas être négatif' }).default(0),
  category_id: z.string().uuid({ message: 'Veuillez sélectionner une catégorie' }),
  subcategory_id: z.string().uuid({ message: 'Veuillez sélectionner une sous-catégorie' }).optional(),
  material: z.string().optional(),
  origin: z.string().optional(),
  artisan_id: z.string().uuid({ message: 'Veuillez sélectionner un artisan' }).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: string;
  isAdmin?: boolean;
  onSuccess?: (productId: string) => void;
  defaultValues?: Partial<ProductFormValues>;
  redirectPath?: string;
}

export function ProductForm({ 
  productId, 
  isAdmin = false, 
  onSuccess, 
  defaultValues,
  redirectPath 
}: ProductFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string; parent_id: string }[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<{ id: string; name: string; parent_id: string }[]>([]);
  const [artisans, setArtisans] = useState<{ id: string; name: string }[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const MAX_IMAGES = 4; // Maximum number of images allowed per product

  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: '',
      subcategory_id: '',
      material: '',
      origin: '',
      artisan_id: '',
    }
  });

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les catégories',
          variant: 'destructive',
        });
        return;
      }
      
      setCategories(data || []);
    };
    
    fetchCategories();
  }, [toast]);

  // Fetch subcategories for dropdown
  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name, parent_id')
        .order('name');
      
      if (error) {
        console.error('Error fetching subcategories:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les sous-catégories',
          variant: 'destructive',
        });
        return;
      }
      
      setSubcategories(data || []);
    };
    
    fetchSubcategories();
  }, [toast]);

  // Filter subcategories when category changes
  useEffect(() => {
    const categoryId = form.watch('category_id');
    if (categoryId && subcategories.length > 0) {
      const filtered = subcategories.filter(sc => sc.parent_id === categoryId);
      setFilteredSubcategories(filtered);
      
      // If current subcategory is not valid for this category, reset it
      const currentSubcategory = form.watch('subcategory_id');
      if (currentSubcategory && !filtered.some(sc => sc.id === currentSubcategory)) {
        form.setValue('subcategory_id', '');
      }
    } else {
      setFilteredSubcategories([]);
    }
  }, [form.watch('category_id'), subcategories, form]);

  // Fetch artisans for dropdown (admin only)
  useEffect(() => {
    if (isAdmin) {
      const fetchArtisans = async () => {
        const { data, error } = await supabase
          .from('artisans')
          .select('id, name')
          .order('name');
        
        if (error) {
          console.error('Error fetching artisans:', error);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les artisans',
            variant: 'destructive',
          });
          return;
        }
        
        setArtisans(data || []);
      };
      
      fetchArtisans();
    }
  }, [isAdmin, toast]);

  // Fetch product data for editing
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) {
          console.error('Error fetching product:', error);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger le produit',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        if (data) {
          // Update form with fetched data
          form.reset({
            title: data.title,
            description: data.description || '',
            price: data.price,
            discount_price: data.discount_price || undefined,
            stock: data.stock,
            category_id: data.category_id || '',
            subcategory_id: data.subcategory_id || '',
            material: data.material || '',
            origin: data.origin || '',
            artisan_id: data.artisan_id,
          });
          
          // Set images
          setImages(data.images || []);
        }
        
        setLoading(false);
      };
      
      fetchProduct();
    }
  }, [productId, form, toast]);

  // Get current artisan ID if not admin
  const getCurrentArtisanId = async (): Promise<string | null> => {
    if (isAdmin && form.getValues('artisan_id')) {
      return form.getValues('artisan_id');
    }
    
    // If not admin, get the current user's artisan ID
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour effectuer cette action',
        variant: 'destructive',
      });
      return null;
    }
    
    const { data, error } = await supabase
      .from('artisans')
      .select('id')
      .eq('user_id', session.user.id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching artisan ID:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer votre ID d\'artisan',
        variant: 'destructive',
      });
      return null;
    }
    
    return data.id;
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    // Check if adding these files would exceed the maximum allowed
    const totalImages = images.length + e.target.files.length;
    if (totalImages > MAX_IMAGES) {
      toast({
        title: 'Limite d\'images atteinte',
        description: `Vous pouvez télécharger au maximum ${MAX_IMAGES} images par produit.`,
        variant: 'destructive',
      });
      return;
    }
    
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
    
    // Create local preview URLs
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImageUrls]);
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newImageFiles = [...imageFiles];
    if (index < newImageFiles.length) {
      newImageFiles.splice(index, 1);
      setImageFiles(newImageFiles);
    }
  };

  // Upload images to Supabase Storage
  const uploadImages = async (artisanId: string): Promise<string[]> => {
    if (imageFiles.length === 0) return images;
    
    setUploading(true);
    const uploadPromises = imageFiles.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${artisanId}/${Date.now()}-${index}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const result = await uploadFile('products', filePath, file);
      if (result.success && result.url) {
        return result.url;
      }
      throw new Error(`Failed to upload image ${file.name}`);
    });
    
    try {
      const newImageUrls = await Promise.all(uploadPromises);
      setUploading(false);
      
      // Combine existing image URLs with new ones, excluding local preview URLs
      return [...images.filter(url => !url.startsWith('blob:')), ...newImageUrls];
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'upload des images',
        variant: 'destructive',
      });
      setUploading(false);
      return images.filter(url => !url.startsWith('blob:'));
    }
  };

  // Form submission handler
  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    
    try {
      // Get artisan ID
      const artisanId = await getCurrentArtisanId();
      if (!artisanId) {
        setLoading(false);
        return;
      }
      
      // Upload images
      const imageUrls = await uploadImages(artisanId);
      
      // Prepare product data
      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        discount_price: data.discount_price,
        stock: data.stock,
        category_id: data.category_id,
        subcategory_id: data.subcategory_id,
        material: data.material,
        origin: data.origin,
        artisan_id: artisanId,
        images: imageUrls.length > 0 ? imageUrls : null,
      };
      
      let result;
      
      if (productId) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId);
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert(productData)
          .select('id')
          .single();
      }
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      toast({
        title: 'Succès',
        description: productId 
          ? 'Le produit a été mis à jour avec succès' 
          : 'Le produit a été créé avec succès',
      });
      
      // Call onSuccess callback or redirect
      if (onSuccess && result.data?.id) {
        onSuccess(result.data.id);
      } else if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(isAdmin ? '/admin/products' : '/artisan/products');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue lors de l'enregistrement: ${error.message}`,
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{productId ? 'Modifier le produit' : 'Créer un nouveau produit'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Images */}
            <div className="space-y-2">
              <FormLabel>Images du produit ({images.length}/{MAX_IMAGES})</FormLabel>
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="w-24 h-24 border rounded overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < MAX_IMAGES && (
                  <label className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Formats acceptés: JPG, PNG. Max 5Mo par image. Maximum {MAX_IMAGES} images par produit.
              </p>
            </div>

            {/* Product Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre*</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du produit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description détaillée du produit" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (MAD)*</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="discount_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix remisé (MAD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="Optionnel"
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock*</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category Selection */}
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subcategory Selection - Added this field */}
            <FormField
              control={form.control}
              name="subcategory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sous-catégorie</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!form.watch('category_id') || filteredSubcategories.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !form.watch('category_id') 
                            ? "Sélectionnez d'abord une catégorie" 
                            : filteredSubcategories.length === 0 
                              ? "Aucune sous-catégorie disponible" 
                              : "Sélectionner une sous-catégorie"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSubcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Material and Origin Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matériau</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Céramique, Cuir, Bois..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origine</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Fès, Marrakech..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Artisan Selection (Admin only) */}
            {isAdmin && (
              <FormField
                control={form.control}
                name="artisan_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artisan*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un artisan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {artisans.map((artisan) => (
                          <SelectItem key={artisan.id} value={artisan.id}>
                            {artisan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <CardFooter className="px-0 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="mr-2"
                onClick={() => navigate(isAdmin ? '/admin/products' : '/artisan/products')}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading || uploading}>
                {loading || uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploading ? 'Upload des images...' : 'Enregistrement...'}
                  </>
                ) : productId ? 'Mettre à jour' : 'Créer'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
