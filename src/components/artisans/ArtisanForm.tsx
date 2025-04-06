import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { checkAdminRole } from '@/utils/authUtils';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères.",
  }),
  email: z.string().email("Adresse e-mail invalide").optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().min(10, {
    message: "La bio doit comporter au moins 10 caractères.",
  }),
  description: z.string().optional(),
  location: z.string().min(3, {
    message: "La localisation doit comporter au moins 3 caractères.",
  }),
  profilePhoto: z.string().url("URL de photo de profil invalide").optional(),
  website: z.string().url("URL de site web invalide").optional(),
  featured: z.boolean().default(false),
});

interface ArtisanFormProps {
  existingArtisan?: any;
  redirectPath?: string;
}

export function ArtisanForm({ 
  existingArtisan, 
  redirectPath = "/artisan/dashboard" 
}: ArtisanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingArtisan?.name || "",
      email: "",
      firstName: "",
      lastName: "",
      bio: existingArtisan?.bio || "",
      description: existingArtisan?.description || "",
      location: existingArtisan?.location || "",
      profilePhoto: existingArtisan?.profile_photo || "",
      website: existingArtisan?.website || "",
      featured: existingArtisan?.featured || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Vous devez être connecté pour effectuer cette action.");
      }

      const isAdmin = await checkAdminRole();
      const userId = session.user.id;

      // Prepare the artisan data
      const artisanData: any = {
        name: values.name,
        bio: values.bio,
        description: values.description || null,
        location: values.location,
        profile_photo: values.profilePhoto || null,
        website: values.website || null,
        featured: values.featured,
      };

      if (existingArtisan) {
        // Update existing artisan
        const { error: updateError } = await supabase
          .from('artisans')
          .update(artisanData)
          .eq('id', existingArtisan.id);

        if (updateError) throw updateError;

        toast({
          title: "Succès",
          description: "Artisan mis à jour avec succès",
        });
      } else {
        // For new artisans, we need to handle the user/profile creation differently
        // If admin is creating a new artisan
        if (isAdmin) {
          // Check if email already exists
          const { data: existingUser, error: emailCheckError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', values.email)
            .maybeSingle();

          if (emailCheckError) throw emailCheckError;

          let profileId;
          
          if (existingUser) {
            // Use existing profile
            profileId = existingUser.id;
          } else {
            // Create new profile
            const { data: newProfile, error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: uuidv4(), // Generate a UUID for the profile
                email: values.email,
                role: 'artisan',
                first_name: values.firstName || null,
                last_name: values.lastName || null
              })
              .select('id')
              .single();

            if (profileError) throw profileError;
            profileId = newProfile.id;
          }

          // Create artisan with user_id
          artisanData.user_id = profileId;
          
          const { error: insertError } = await supabase
            .from('artisans')
            .insert(artisanData);

          if (insertError) throw insertError;

          toast({
            title: "Succès",
            description: "Artisan créé avec succès",
          });
        } else {
          // Regular artisan creating their profile
          artisanData.user_id = userId;
          
          const { error: insertError } = await supabase
            .from('artisans')
            .insert(artisanData);

          if (insertError) throw insertError;

          toast({
            title: "Succès",
            description: "Votre profil d'artisan a été créé avec succès",
          });
        }
      }
      
      navigate(redirectPath);
    } catch (error: any) {
      console.error('Error saving artisan:', error);
      setError(error.message || "Une erreur est survenue lors de l'enregistrement");
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'artisan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Only show email, firstname, lastname if admin is creating the artisan */}
          {checkAdminRole() && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="Email de l'artisan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom de l'artisan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'artisan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localisation *</FormLabel>
                <FormControl>
                  <Input placeholder="Ville, Pays" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profilePhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la photo de profil</FormLabel>
                <FormControl>
                  <Input placeholder="URL de la photo de profil" {...field} />
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
                <FormLabel>Site web</FormLabel>
                <FormControl>
                  <Input placeholder="URL du site web" {...field} />
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
              <FormLabel>Bio *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Courte biographie de l'artisan"
                  className="resize-none"
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description détaillée de l'artisan"
                  className="resize-none"
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Mettre en avant</FormLabel>
                <FormDescription>
                  Mettre en avant cet artisan sur la page d'accueil.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>
      </form>
    </Form>
  );
}
