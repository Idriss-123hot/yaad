
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2, ImagePlus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewArtisan() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bio: '',
      location: '',
      email: '',
      password: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file type
      if (!file.type.match('image/jpeg') && !file.type.match('image/webp')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPEG or WebP image',
          variant: 'destructive',
        });
        return;
      }
      
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // 1. Create the user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.name.split(' ')[0],
            last_name: data.name.split(' ').slice(1).join(' '),
            role: 'artisan',
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      const userId = authData.user.id;

      // 2. Upload profile image if provided
      let profileImageUrl = null;
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, profileImage);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        profileImageUrl = urlData.publicUrl;
      }

      // 3. Create the artisan profile
      const { error: artisanError } = await supabase
        .from('artisans')
        .insert({
          user_id: userId,
          name: data.name,
          bio: data.bio || null,
          location: data.location || null,
          profile_photo: profileImageUrl,
          joined_date: new Date().toISOString(),
        });

      if (artisanError) throw artisanError;

      // 4. Update the user's role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'artisan' })
        .eq('id', userId);

      if (profileError) throw profileError;

      toast({
        title: 'Artisan created successfully',
        description: `New artisan account created for ${data.name}`,
      });

      navigate('/admin/artisans');
    } catch (error) {
      console.error('Error creating artisan:', error);
      toast({
        title: 'Error creating artisan',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/artisans')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Artisans
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Artisan</h1>
          <p className="text-muted-foreground">
            Add a new artisan to the platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Artisan Information</CardTitle>
              <CardDescription>
                Enter the basic details for the new artisan
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
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The artisan's full name (max 50 characters)
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
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the artisan and their work"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A short bio about the artisan (max 500 characters)
                        </FormDescription>
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
                          <Input placeholder="City, Region" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where the artisan is based
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Profile Picture</FormLabel>
                    <div className="flex items-center space-x-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-gray-100">
                        {profileImagePreview ? (
                          <img
                            src={profileImagePreview}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImagePlus className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept=".jpg,.jpeg,.webp"
                          onChange={handleImageChange}
                          className="text-sm"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          JPEG or WebP, max 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Create login credentials for the artisan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="artisan@example.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This will be used as the login username
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Temporary password (min 8 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-6">
                    <Button
                      type="button"
                      onClick={form.handleSubmit(onSubmit)}
                      className="w-full bg-terracotta-600 hover:bg-terracotta-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Artisan'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
