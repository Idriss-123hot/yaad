
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Artisan } from '@/models/types';
import { mapDatabaseArtisanToArtisan } from '@/utils/mapDatabaseModels';
import { Loader2, Plus, Edit, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { populateProductsForSubcategories } from '@/utils/productPopulation';

const ArtisansList = () => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopulating, setIsPopulating] = useState(false);
  
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('artisans')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        const mappedArtisans = data.map(mapDatabaseArtisanToArtisan);
        setArtisans(mappedArtisans);
      } catch (error) {
        console.error('Error fetching artisans:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtisans();
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredArtisans = artisans.filter(artisan => 
    artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artisan.location && artisan.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handlePopulateProducts = async () => {
    setIsPopulating(true);
    await populateProductsForSubcategories();
    setIsPopulating(false);
  };
  
  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Gestion des Artisans</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/admin/artisans/new')}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un artisan
            </Button>
            <Button 
              variant="outline"
              onClick={handlePopulateProducts}
              disabled={isPopulating}
              className="w-full sm:w-auto"
            >
              {isPopulating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer produits par sous-catégorie
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Rechercher des artisans..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-md"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredArtisans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map(artisan => (
              <Card key={artisan.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="h-48 bg-gray-100 relative">
                      {artisan.profileImage ? (
                        <img 
                          src={artisan.profileImage} 
                          alt={artisan.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          Aucune image
                        </div>
                      )}
                      {artisan.featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          En vedette
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{artisan.name}</h3>
                          {artisan.location && (
                            <p className="text-sm text-muted-foreground">{artisan.location}</p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{artisan.rating.toFixed(1)}</span>
                          <span className="ml-1 text-xs text-muted-foreground">({artisan.reviewCount})</span>
                        </div>
                      </div>
                      {artisan.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{artisan.bio}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Inscrit le {format(new Date(artisan.joinedDate), 'dd/MM/yyyy')}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/artisans/${artisan.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun artisan trouvé</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ArtisansList;
