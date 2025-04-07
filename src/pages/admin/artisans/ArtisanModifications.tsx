
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
import { ModificationLog, ArtisanModificationLog, ArtisanData, QueryError } from '@/types/supabase-custom';

const ArtisanModifications = () => {
  const [modifications, setModifications] = useState<ArtisanModificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMod, setSelectedMod] = useState<ArtisanModificationLog | null>(null);
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
      
      // Process data for better display
      const processedData = data.map(mod => {
        // Extract changed fields by comparing old_values and new_values
        const changedFields = mod.new_values 
          ? Object.keys(mod.new_values).filter(key => 
              mod.old_values && 
              JSON.stringify(mod.old_values[key]) !== JSON.stringify(mod.new_values[key])
            )
          : [];
        
        // Safe type checking for artisans data
        let artisanName = 'Inconnu';
        let artisanData = null;
        
        // Check if artisans exists and is a valid object (not an error)
        if (mod.artisans !== null && mod.artisans !== undefined && typeof mod.artisans === 'object') {
          // Create a local variable that TypeScript knows is non-null
          const artisansObj = mod.artisans;
          
          // TypeScript still thinks artisansObj could be null here despite our checks above
          // We need to use a type assertion to tell TypeScript it's definitely not null
          // First we check if it's an error object
          if ('error' in artisansObj!) {
            // It's an error object, don't try to access name
            console.log('Error in artisan data:', (artisansObj as QueryError).error);
          } else {
            // Safe type cast - we've verified it's a valid object with name property
            // First assert that artisansObj is definitely not null, then cast to ArtisanData
            const safeArtisanData = artisansObj! as ArtisanData;
            if (safeArtisanData.name && typeof safeArtisanData.name === 'string') {
              artisanName = safeArtisanData.name;
            }
            artisanData = safeArtisanData;
          }
        } 
        
        // Fallback to new_values.name if available
        if (artisanName === 'Inconnu' && mod.new_values && typeof mod.new_values === 'object') {
          const newValues = mod.new_values as Record<string, any>;
          if (newValues.name && typeof newValues.name === 'string') {
            artisanName = newValues.name;
          }
        }
        
        // Create a safe artisan modification log object
        const artisanMod: ArtisanModificationLog = {
          ...mod,
          changedFields,
          artisanName,
          artisans: artisanData
        };
        
        return artisanMod;
      });
      
      setModifications(processedData);
    } catch (error: any) {
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

  const handleViewDetails = (mod: ArtisanModificationLog) => {
    setSelectedMod(mod);
    setShowDetails(true);
  };

  const handleApprove = async () => {
    if (!selectedMod) return;
    
    try {
      // Apply changes to artisans table
      const { error } = await supabase
        .from('artisans')
        .update(selectedMod.new_values as any)
        .eq('id', selectedMod.row_id);
        
      if (error) throw error;
      
      // Mark the modification as approved
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
    } catch (error: any) {
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
      // Mark the modification as rejected
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
    } catch (error: any) {
      console.error('Error rejecting modification:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de rejeter les modifications.",
        variant: 'destructive',
      });
    }
  };

  const formatFieldName = (field: string) => {
    const fieldMap: Record<string, string> = {
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

  const renderFieldValue = (field: string, value: any) => {
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
                        {mod.artisans && 'profile_photo' in mod.artisans && mod.artisans.profile_photo && (
                          <img
                            src={mod.artisans.profile_photo}
                            alt={mod.artisanName || "Artisan"}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        {mod.artisanName || "Artisan inconnu"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {mod.changedFields && mod.changedFields.length > 0 ? (
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

      {/* Dialog for modification details */}
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
                  {selectedMod.changedFields && selectedMod.changedFields.length > 0 ? (
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
                    {selectedMod.changedFields && selectedMod.changedFields.length > 0 ? (
                      selectedMod.changedFields.map(field => (
                        <div key={`new-${field}`} className="space-y-1">
                          <p className="text-sm font-medium">{formatFieldName(field)}</p>
                          <div className="text-sm">
                            {renderFieldValue(field, selectedMod.new_values?.[field])}
                          </div>
                        </div>
                      ))
                    ) : (
                      selectedMod.new_values && Object.keys(selectedMod.new_values).map(field => (
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
