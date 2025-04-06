
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Artisan } from '@/models/types';

const EditArtisan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [artisan, setArtisan] = useState<Partial<Artisan>>({});
  
  // Fetch artisan details on component mount
  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        
        if (!id) return;
        
        const { data, error } = await supabase
          .from('artisans')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Map database fields to our Artisan model
        setArtisan({
          id: data.id,
          name: data.name,
          bio: data.bio || '',
          location: data.location || '',
          profileImage: data.profile_photo || '',
          description: data.description || '',
          website: data.website || '',
          rating: data.rating || 0,
          reviewCount: data.review_count || 0,
          featured: data.featured || false,
          joinedDate: new Date(data.joined_date),
          galleryImages: data.first_gallery_images || []
        });
      } catch (error) {
        console.error('Error fetching artisan:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch artisan details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtisan();
  }, [id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArtisan((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setArtisan((prev) => ({ ...prev, featured: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Map our model back to database fields
      const { data, error } = await supabase
        .from('artisans')
        .update({
          name: artisan.name,
          bio: artisan.bio,
          location: artisan.location,
          profile_photo: artisan.profileImage,
          description: artisan.description,
          website: artisan.website,
          rating: artisan.rating,
          review_count: artisan.reviewCount,
          featured: artisan.featured
          // Note: We don't update joined_date as it should be immutable
        })
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Artisan information updated successfully'
      });
      
      navigate('/admin/artisans');
    } catch (error) {
      console.error('Error updating artisan:', error);
      toast({
        title: 'Error',
        description: 'Failed to update artisan information',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/artisans')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Artisans
          </Button>
          <h1 className="text-2xl font-bold">Edit Artisan</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Edit the basic details of the artisan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={artisan.name || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={artisan.location || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={artisan.bio || ''}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={artisan.description || ''}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={artisan.website || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image URL</Label>
                    <Input
                      id="profileImage"
                      name="profileImage"
                      value={artisan.profileImage || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    {artisan.profileImage && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">Image Preview:</p>
                        <img 
                          src={artisan.profileImage} 
                          alt={artisan.name} 
                          className="h-24 w-24 object-cover rounded-full border"
                          onError={(e) => {
                            e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistics & Status</CardTitle>
                <CardDescription>
                  Edit the artisan's statistics and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (0-5)</Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={artisan.rating || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reviewCount">Review Count</Label>
                      <Input
                        id="reviewCount"
                        name="reviewCount"
                        type="number"
                        min="0"
                        value={artisan.reviewCount || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="featured" 
                      checked={artisan.featured || false}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="featured">Featured Artisan</Label>
                  </div>
                  
                  {artisan.joinedDate && (
                    <div className="pt-4">
                      <Label className="text-muted-foreground">Joined Date</Label>
                      <p className="mt-1 text-sm">
                        {format(new Date(artisan.joinedDate), 'PPP')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        (Joined date cannot be edited)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditArtisan;
