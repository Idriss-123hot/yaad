
import { useState, useEffect } from 'react';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(150, 'Bio must be 150 characters or less').optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  location: z.string().optional(),
  website: z.string().url('Must be a valid URL').or(z.string().length(0)).optional(),
});

const ArtisanSettings = () => {
  const [artisanData, setArtisanData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Setup the form with the schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bio: '',
      description: '',
      location: '',
      website: '',
    },
  });
  
  // Fetch artisan data on component mount
  useEffect(() => {
    fetchArtisanData();
  }, []);
  
  // Set form values when artisan data is loaded
  useEffect(() => {
    if (artisanData) {
      form.reset({
        name: artisanData.name || '',
        bio: artisanData.bio || '',
        description: artisanData.description || '',
        location: artisanData.location || '',
        website: artisanData.website || '',
      });
      
      setProfilePhotoUrl(artisanData.profile_photo);
    }
  }, [artisanData, form]);
  
  const fetchArtisanData = async () => {
    try {
      setLoading(true);
      
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      // Fetch artisan data
      const { data: artisanData, error: artisanError } = await supabase
        .from('artisans')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (artisanError) {
        throw artisanError;
      }
      
      if (!artisanData) {
        throw new Error('No artisan profile found');
      }
      
      setArtisanData(artisanData);
      
      // Fetch user profile for completeness
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }
      
      // We don't need to do anything with profileData right now
      // as we're primarily working with the artisan record
      
    } catch (error: any) {
      console.error('Error fetching artisan data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load your profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Profile photo must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      setProfilePhotoFile(file);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setProfilePhotoUrl(objectUrl);
    }
  };
  
  const uploadProfilePhoto = async (): Promise<string | null> => {
    if (!profilePhotoFile || !artisanData) return null;
    
    try {
      // Generate a unique filename
      const fileExt = profilePhotoFile.name.split('.').pop();
      const fileName = `${artisanData.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('artisans')
        .upload(filePath, profilePhotoFile, {
          cacheControl: '3600',
          upsert: false,
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('artisans')
        .getPublicUrl(filePath);
        
      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload profile photo',
        variant: 'destructive',
      });
      return null;
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!artisanData) return;
    
    try {
      setIsSaving(true);
      
      // Upload profile photo if changed
      let profilePhotoPath = artisanData.profile_photo;
      if (profilePhotoFile) {
        const uploadedUrl = await uploadProfilePhoto();
        if (uploadedUrl) {
          profilePhotoPath = uploadedUrl;
        }
      }
      
      // Update the artisan record
      const { error: updateError } = await supabase
        .from('artisans')
        .update({
          name: values.name,
          bio: values.bio,
          description: values.description,
          location: values.location,
          website: values.website,
          profile_photo: profilePhotoPath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', artisanData.id);
        
      if (updateError) throw updateError;
      
      // Update the profiles table first_name field for consistency
      // Assuming the name field could be split into first and last name
      const nameParts = values.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq('id', artisanData.user_id);
        
      if (profileUpdateError) {
        console.error('Error updating profile:', profileUpdateError);
        // Don't throw, as the main update succeeded
      }
      
      toast({
        title: 'Settings updated',
        description: 'Your profile has been successfully updated',
      });
      
      // Refresh artisan data
      fetchArtisanData();
    } catch (error: any) {
      console.error('Error updating artisan settings:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update your profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };
  
  if (loading) {
    return (
      <ArtisanLayout>
        <div className="container mx-auto py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
        </div>
      </ArtisanLayout>
    );
  }
  
  return (
    <ArtisanLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Photo */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                Your profile photo will be displayed on your public profile and products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted mb-4">
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Photo
                    </div>
                  )}
                </div>
                
                <Label htmlFor="profile-photo" className="cursor-pointer">
                  <div className="flex items-center gap-2 border rounded-md px-4 py-2 hover:bg-muted transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                  </div>
                  <Input 
                    id="profile-photo" 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                </Label>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Max size: 5MB. Formats: JPEG, PNG
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Settings */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Your name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Marrakech, Morocco" />
                        </FormControl>
                        <FormDescription>
                          City, country, or region where you're based
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Brief description of your craft (150 chars max)"
                            className="resize-none"
                            rows={2}
                          />
                        </FormControl>
                        <FormDescription>
                          A short tagline that appears on your profile card
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Tell your story, describe your craft, and share your expertise"
                            className="resize-none"
                            rows={6}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description shown on your full profile page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://yourwebsite.com" type="url" />
                        </FormControl>
                        <FormDescription>
                          Your personal or business website (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-terracotta-600 hover:bg-terracotta-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanSettings;
