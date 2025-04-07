
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Check, X, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

const ArtisanModifications = () => {
  const [modifications, setModifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMod, setSelectedMod] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchModifications();
  }, []);

  const fetchModifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('modification_logs')
        .select(`
          *,
          artisans:row_id (
            name,
            profile_photo
          )
        `)
        .eq('table_name', 'artisans')
        .order('modification_date', { ascending: false });

      if (error) throw error;
      
      // Organiser les données pour un meilleur affichage
      const processedData = data.map(mod => {
        // Extraire les champs modifiés en comparant old_values et new_values
        const changedFields = mod.new_values 
          ? Object.keys(mod.new_values).filter(key => 
              mod.old_values && 
              JSON.stringify(mod.old_values[key]) !== JSON.stringify(mod.new_values[key])
            )
          : [];
          
        return {
          ...mod,
          changedFields,
          artisanName: mod.artisans?.name || 'Inconnu'
        };
      });
      
      setModifications(processedData);
    } catch (error) {
      console.error('Error fetching modifications:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de récupérer les modifications des artisans.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (mod) => {
    setSelectedMod(mod);
    setShowDetails(true);
  };

  const handleApprove = async () => {
    if (!selectedMod) return;
    
    try {
      // Appliquer les modifications à la table artisans
      const { error } = await supabase
        .from('artisans')
        .update(selectedMod.new_values)
        .eq('id', selectedMod.row_id);
        
      if (error) throw error;
      
      // Marquer la modification comme validée
      await supabase
        .from('modification_logs')
        .update({ status: 'approved' })
        .eq('id', selectedMod.id);
        
      toast({
        title: 'Succès',
        description: "Les modifications ont été approuvées.",
      });
      
      setShowDetails(false);
      fetchModifications();
    } catch (error) {
      console.error('Error approving modification:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'approuver les modifications.",
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedMod) return;
    
    try {
      // Marquer la modification comme rejetée
      await supabase
        .from('modification_logs')
        .update({ status: 'rejected' })
        .eq('id', selectedMod.id);
        
      toast({
        title: 'Information',
        description: "Les modifications ont été rejetées.",
      });
      
      setShowDetails(false);
      fetchModifications();
    } catch (error) {
      console.error('Error rejecting modification:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de rejeter les modifications.",
        variant: 'destructive',
      });
    }
  };

  const formatFieldName = (field) => {
    const fieldMap = {
      name: 'Nom',
      bio: 'Biographie',
      location: 'Localisation',
      description: 'Description',
      profile_photo: 'Photo de profil',
      website: 'Site web',
      first_gallery_images: 'Galerie principale',
      second_gallery_images: 'Galerie secondaire'
    };
    
    return fieldMap[field] || field;
  };

  const renderFieldValue = (field, value) => {
    if (field === 'profile_photo' || field.includes('_images')) {
      return value ? (
        <div className="max-w-xs">
          {typeof value === 'string' ? (
            <img src={value} alt="Preview" className="w-20 h-20 object-cover rounded" />
          ) : Array.isArray(value) ? (
            <div className="flex gap-1 overflow-x-auto">
              {value.slice(0, 3).map((img, i) => (
                <img key={i} src={img} alt={`Preview ${i}`} className="w-20 h-20 object-cover rounded" />
              ))}
              {value.length > 3 && <span className="text-sm">+{value.length - 3} images</span>}
            </div>
          ) : (
            <span>Valeur invalide</span>
          )}
        </div>
      ) : <span className="text-muted-foreground italic">Aucune image</span>;
    }
    
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Non défini</span>;
    }
    
    if (typeof value === 'object') {
      return <pre className="text-xs max-w-xs overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>;
    }
    
    return value.toString();
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Modifications des Artisans</h1>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
          </div>
        ) : modifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune modification en attente</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Champs modifiés</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modifications.map((mod) => (
                  <TableRow key={mod.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {mod.artisans?.profile_photo && (
                          <img
                            src={mod.artisans.profile_photo}
                            alt={mod.artisanName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        {mod.artisanName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {mod.changedFields.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {mod.changedFields.map(field => (
                            <span key={field} className="bg-gray-100 text-xs px-2 py-1 rounded">
                              {formatFieldName(field)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Nouvelle entrée</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(mod.modification_date), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{mod.user_id || 'Système'}</TableCell>
                    <TableCell>{mod.user_role || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(mod)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Dialog pour afficher les détails de la modification */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la modification</DialogTitle>
            <DialogDescription>
              Artisan: {selectedMod?.artisanName} - {format(new Date(selectedMod?.modification_date || Date.now()), 'dd/MM/yyyy HH:mm')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMod && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Anciennes valeurs</h3>
                  {selectedMod.changedFields.length > 0 ? (
                    <div className="space-y-4 border p-4 rounded-md">
                      {selectedMod.changedFields.map(field => (
                        <div key={`old-${field}`} className="space-y-1">
                          <p className="text-sm font-medium">{formatFieldName(field)}</p>
                          <div className="text-sm">
                            {renderFieldValue(field, selectedMod.old_values?.[field])}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Nouvelle entrée</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Nouvelles valeurs</h3>
                  <div className="space-y-4 border p-4 rounded-md">
                    {selectedMod.changedFields.length > 0 ? (
                      selectedMod.changedFields.map(field => (
                        <div key={`new-${field}`} className="space-y-1">
                          <p className="text-sm font-medium">{formatFieldName(field)}</p>
                          <div className="text-sm">
                            {renderFieldValue(field, selectedMod.new_values?.[field])}
                          </div>
                        </div>
                      ))
                    ) : (
                      Object.keys(selectedMod.new_values || {}).map(field => (
                        <div key={`new-${field}`} className="space-y-1">
                          <p className="text-sm font-medium">{formatFieldName(field)}</p>
                          <div className="text-sm">
                            {renderFieldValue(field, selectedMod.new_values?.[field])}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Fermer
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Rejeter
                </Button>
                <Button 
                  onClick={handleApprove}
                  className="gap-1"
                >
                  <Check className="h-4 w-4" />
                  Approuver
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ArtisanModifications;
