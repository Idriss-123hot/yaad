
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Upload, Image, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadFile } from '@/utils/storageUtils';

// Form validation schema
const artisanSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  bio: z.string().min(10, { message: 'La biographie doit contenir au moins 10 caractères' }),
  location: z.string().min(2, { message: 'La localisation doit être spécifiée' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères' }),
  website: z.string().url({ message: 'Le site web doit être une URL valide' }).optional().or(z.literal('')),
  user_email: z.string().email({ message: 'L\'email doit être valide' }),
  user_password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }).optional(),
  featured: z.boolean().default(false),
});

type ArtisanFormValues = z.infer<typeof artisanSchema>;

interface ArtisanFormProps {
  artisanId?: string;
  onSuccess?: (artisanId: string) => void;
  defaultValues?: Partial<ArtisanFormValues>;
  redirectPath?: string;
}

export function ArtisanForm({ 
  artisanId, 
  onSuccess, 
  defaultValues,
  redirectPath 
}: ArtisanFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<ArtisanFormValues>({
    resolver: zodResolver(artisanSchema),
    defaultValues: defaultValues || {
      name: '',
      bio: '',
      location: '',
      description: '',
      website: '',
      user_email: '',
      user_password: '',
      featured: false,
    }
  });

  // Fetch artisan data for editing
  useEffect(() => {
    if (artisanId) {
      const fetchArtisan = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('artisans')
          .select(`
            *,
            user:profiles!inner(
              email
            )
          `)
          .eq('id', artisanId)
          .single();
        
        if (error) {
          console.error('Error fetching artisan:', error);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les données de l\'artisan',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        if (data) {
          // Update form with fetched data
          form.reset({
            name: data.name,
            bio: data.bio || '',
            location: data.location || '',
            description: data.description || '',
            website: data.website || '',
            user_email: data.user.email,
            featured: data.featured || false,
          });
          
          // Set images
          setProfilePhoto(data.profile_photo);
          setGalleryImages(data.first_gallery_images || []);
        }
        
        setLoading(false);
      };
      
      fetchArtisan();
    }
  }, [artisanId, form, toast]);

  // Handle profile photo upload
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    setProfilePhotoFile(file);
    setProfilePhoto(URL.createObjectURL(file));
  };

  // Handle gallery images upload
  const handleGalleryImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const files = Array.from(e.target.files);
    setGalleryImageFiles(prevFiles => [...prevFiles, ...files]);
    
    // Create local preview URLs
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setGalleryImages(prevImages => [...prevImages, ...newImageUrls]);
  };

  // Remove profile photo
  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoFile(null);
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    const newImages = [...galleryImages];
    newImages.splice(index, 1);
    setGalleryImages(newImages);
    
    const newImageFiles = [...galleryImageFiles];
    if (index < newImageFiles.length) {
      newImageFiles.splice(index, 1);
      setGalleryImageFiles(newImageFiles);
    }
  };

  // Upload images to Supabase Storage
  const uploadImages = async (artisanId: string): Promise<{ profileUrl: string | null; galleryUrls: string[] }> => {
    setUploading(true);
    
    try {
      // Upload profile photo if exists
      let profileUrl = profilePhoto;
      if (profilePhotoFile) {
        const fileExt = profilePhotoFile.name.split('.').pop();
        const fileName = `${artisanId}/profile.${fileExt}`;
        const filePath = `artisans/${fileName}`;
        
        const result = await uploadFile('products', filePath, profilePhotoFile);
        if (result.success && result.url) {
          profileUrl = result.url;
        } else {
          throw new Error('Failed to upload profile photo');
        }
      }
      
      // Upload gallery images if exist
      let galleryUrls = galleryImages.filter(url => !url.startsWith('blob:'));
      
      if (galleryImageFiles.length > 0) {
        const uploadPromises = galleryImageFiles.map(async (file, index) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${artisanId}/gallery-${Date.now()}-${index}.${fileExt}`;
          const filePath = `artisans/${fileName}`;
          
          const result = await uploadFile('products', filePath, file);
          if (result.success && result.url) {
            return result.url;
          }
          throw new Error(`Failed to upload gallery image ${file.name}`);
        });
        
        const newGalleryUrls = await Promise.all(uploadPromises);
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }
      
      setUploading(false);
      return { profileUrl, galleryUrls };
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'upload des images',
        variant: 'destructive',
      });
      setUploading(false);
      throw error;
    }
  };

  // Create user and artisan profile
  const createUserAndArtisan = async (data: ArtisanFormValues): Promise<string> => {
    // First create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.user_email,
      password: data.user_password!,
      options: {
        data: {
          role: 'artisan',
        },
      },
    });
    
    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Erreur lors de la création du compte');
    }
    
    // Then update the user's role and add to artisans
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: 'artisan',
      })
      .eq('id', authData.user.id);
    
    if (profileError) {
      throw new Error(profileError.message);
    }
    
    // Upload images
    const { profileUrl, galleryUrls } = await uploadImages(authData.user.id);
    
    // Create artisan profile
    const { data: artisanData, error: artisanError } = await supabase
      .from('artisans')
      .insert({
        name: data.name,
        bio: data.bio,
        location: data.location,
        description: data.description,
        website: data.website || null,
        profile_photo: profileUrl,
        first_gallery_images: galleryUrls,
        featured: data.featured,
        user_id: authData.user.id,
      })
      .select('id')
      .single();
    
    if (artisanError) {
      throw new Error(artisanError.message);
    }
    
    return artisanData.id;
  };

  // Update existing artisan
  const updateArtisan = async (data: ArtisanFormValues): Promise<string> => {
    if (!artisanId) {
      throw new Error('Artisan ID is missing');
    }
    
    // First get the artisan details to get user_id
    const { data: artisanData, error: artisanFetchError } = await supabase
      .from('artisans')
      .select('user_id, id')
      .eq('id', artisanId)
      .single();
    
    if (artisanFetchError || !artisanData) {
      throw new Error(artisanFetchError?.message || 'Artisan not found');
    }
    
    // Upload images
    const { profileUrl, galleryUrls } = await uploadImages(artisanData.id);
    
    // Update artisan profile
    const { error: artisanError } = await supabase
      .from('artisans')
      .update({
        name: data.name,
        bio: data.bio,
        location: data.location,
        description: data.description,
        website: data.website || null,
        profile_photo: profileUrl,
        first_gallery_images: galleryUrls,
        featured: data.featured,
      })
      .eq('id', artisanId);
    
    if (artisanError) {
      throw new Error(artisanError.message);
    }
    
    // Update user email if it's different
    const { data: userData, error: userFetchError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', artisanData.user_id)
      .single();
    
    if (!userFetchError && userData && userData.email !== data.user_email) {
      // Email changed, update it
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          email: data.user_email,
        })
        .eq('id', artisanData.user_id);
      
      if (profileError) {
        throw new Error(profileError.message);
      }
    }
    
    return artisanId;
  };

  // Form submission handler
  const onSubmit = async (data: ArtisanFormValues) => {
    setLoading(true);
    
    try {
      let artisanId;
      
      if (artisanId) {
        // Update existing artisan
        artisanId = await updateArtisan(data);
      } else {
        // Create new artisan
        if (!data.user_password) {
          toast({
            title: 'Erreur',
            description: 'Le mot de passe est requis pour créer un nouvel artisan',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        artisanId = await createUserAndArtisan(data);
      }
      
      toast({
        title: 'Succès',
        description: artisanId 
          ? 'L\'artisan a été mis à jour avec succès' 
          : 'L\'artisan a été créé avec succès',
      });
      
      // Call onSuccess callback or redirect
      if (onSuccess && artisanId) {
        onSuccess(artisanId);
      } else if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate('/admin/artisans');
      }
    } catch (error) {
      console.error('Error saving artisan:', error);
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
        <CardTitle>{artisanId ? 'Modifier l\'artisan' : 'Créer un nouvel artisan'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Photo */}
            <div className="space-y-2">
              <FormLabel>Photo de profil</FormLabel>
              <div className="flex items-center space-x-4">
                {profilePhoto ? (
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border overflow-hidden">
                      <img 
                        src={profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeProfilePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Formats acceptés: JPG, PNG. Max 2Mo.
              </p>
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <FormLabel>Images de galerie</FormLabel>
              <div className="flex flex-wrap gap-4 mb-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="w-24 h-24 border rounded overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <label className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleGalleryImagesUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Formats acceptés: JPG, PNG. Max 5Mo par image.
              </p>
            </div>

            {/* Basic Information */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'artisan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Fès, Marrakech..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Web</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biographie*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Biographie courte de l'artisan" 
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description détaillée du travail et de l'histoire de l'artisan" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Mettre en avant cet artisan
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Les artisans mis en avant apparaissent sur la page d'accueil et sont mis en évidence dans les listes.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Account Information */}
            <div className="p-4 bg-gray-50 rounded-md space-y-4">
              <h3 className="font-medium text-gray-700">Informations de compte</h3>
              
              <FormField
                control={form.control}
                name="user_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!artisanId && (
                <FormField
                  control={form.control}
                  name="user_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe*</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Mot de passe (min. 6 caractères)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <CardFooter className="px-0 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="mr-2"
                onClick={() => navigate('/admin/artisans')}
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
                ) : artisanId ? 'Mettre à jour' : 'Créer'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
