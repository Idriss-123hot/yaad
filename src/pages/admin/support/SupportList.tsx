
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Check, X, MessageSquare, Eye } from 'lucide-react';
import { ArtisanModificationLog, ArtisanData } from '@/types/supabase-custom';

interface SupportMessage {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanEmail?: string;
  subject: string;
  message: string;
  status: string;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

const SupportList = () => {
  const [activeTab, setActiveTab] = useState('support');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [modifications, setModifications] = useState<ArtisanModificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [selectedMod, setSelectedMod] = useState<ArtisanModificationLog | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [supportFilter, setSupportFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'support') {
      fetchMessages();
    } else {
      fetchModifications();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('support_messages')
        .select(`
          *,
          artisans:artisan_id (
            name,
            user_id,
            profiles:user_id (
              email
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        artisanId: msg.artisan_id,
        artisanName: msg.artisans?.name || 'Unknown Artisan',
        artisanEmail: msg.artisans?.profiles?.email,
        subject: msg.subject,
        message: msg.message,
        status: msg.status,
        adminResponse: msg.admin_response,
        createdAt: new Date(msg.created_at),
        updatedAt: new Date(msg.updated_at),
        respondedAt: msg.responded_at ? new Date(msg.responded_at) : undefined
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching support messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch support messages.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
        .eq('status', 'pending')
        .order('modification_date', { ascending: false });

      if (error) throw error;
      
      const processedData = data.map(mod => {
        // Convert Json to Record<string, any> explicitly
        const oldValues = typeof mod.old_values === 'string' 
          ? JSON.parse(mod.old_values) 
          : mod.old_values as Record<string, any> | null;
          
        const newValues = typeof mod.new_values === 'string'
          ? JSON.parse(mod.new_values)
          : mod.new_values as Record<string, any> | null;
        
        // Identify which fields were changed
        const changedFields = newValues 
          ? Object.keys(newValues).filter(key => 
              oldValues && 
              JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])
            )
          : [];
        
        // Get artisan name from either the artisans relation or the new_values
        let artisanName = 'Inconnu';
        let artisanData: ArtisanData | null = null;
        
        if (mod.artisans !== null && mod.artisans !== undefined && typeof mod.artisans === 'object') {
          const artisansObj = mod.artisans as ArtisanData;
          
          if (artisansObj && 'error' in artisansObj) {
            console.log('Error in artisan data:', artisansObj.error);
          } else if (artisansObj) {
            if ('name' in artisansObj && typeof artisansObj.name === 'string') {
              artisanName = artisansObj.name;
            }
            artisanData = artisansObj;
          }
        } 
        
        if (artisanName === 'Inconnu' && newValues && typeof newValues === 'object') {
          if (newValues.name && typeof newValues.name === 'string') {
            artisanName = newValues.name;
          }
        }
        
        // Return the enhanced modification log
        const artisanMod: ArtisanModificationLog = {
          ...mod,
          old_values: oldValues,
          new_values: newValues,
          changedFields,
          artisanName,
          artisans: artisanData,
          status: (mod.status as 'pending' | 'approved' | 'rejected') || 'pending'
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

  const handleOpenSupportDialog = (message: SupportMessage) => {
    setSelectedMessage(message);
    setResponseText(message.adminResponse || '');
  };

  const handleOpenModDialog = (mod: ArtisanModificationLog) => {
    setSelectedMod(mod);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseText(e.target.value);
  };

  const handleSubmitResponse = async () => {
    if (!selectedMessage) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('support_messages')
        .update({
          admin_response: responseText,
          status: 'resolved',
          responded_at: new Date().toISOString(),
          responded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', selectedMessage.id);
      
      if (error) throw error;
      
      toast({
        title: 'Response Sent',
        description: 'Your response has been submitted successfully.',
      });
      
      // Close dialog and refresh messages
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your response.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('support_messages')
        .update({ status })
        .eq('id', messageId);
      
      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `Message status updated to ${status}.`,
      });
      
      fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message status.',
        variant: 'destructive',
      });
    }
  };

  const filterMessages = (status: string) => {
    if (status === 'all') return messages;
    return messages.filter(msg => msg.status === status);
  };

  const handleApproveModification = async () => {
    if (!selectedMod) return;
    
    try {
      setSubmitting(true);
      
      // Update the artisan with the new values
      const { error } = await supabase
        .from('artisans')
        .update(selectedMod.new_values as any)
        .eq('id', selectedMod.row_id);
        
      if (error) throw error;
      
      // Update the modification status
      await supabase
        .from('modification_logs')
        .update({ status: 'approved' })
        .eq('id', selectedMod.id);
        
      toast({
        title: 'Succès',
        description: "Les modifications ont été approuvées.",
      });
      
      // Close dialog and refresh messages
      setSelectedMod(null);
      fetchModifications();
    } catch (error: any) {
      console.error('Error approving modification:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'approuver les modifications.",
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectModification = async () => {
    if (!selectedMod) return;
    
    try {
      setSubmitting(true);
      
      // Update the modification status to rejected
      await supabase
        .from('modification_logs')
        .update({ status: 'rejected' })
        .eq('id', selectedMod.id);
        
      toast({
        title: 'Information',
        description: "Les modifications ont été rejetées.",
      });
      
      // Close dialog and refresh messages
      setSelectedMod(null);
      fetchModifications();
    } catch (error: any) {
      console.error('Error rejecting modification:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de rejeter les modifications.",
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Support & Modifications</h1>
          <p className="text-muted-foreground">
            Gérer les demandes de support et les modifications d'artisans
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="support">Messages Support</TabsTrigger>
              <TabsTrigger value="modifications">Modifications Artisans</TabsTrigger>
            </TabsList>
          </div>

          {/* Support Messages Tab */}
          <TabsContent value="support">
            <Tabs defaultValue="all" value={supportFilter} onValueChange={setSupportFilter}>
              <div className="mb-4">
                <TabsList>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="in_progress">En cours</TabsTrigger>
                  <TabsTrigger value="resolved">Résolus</TabsTrigger>
                </TabsList>
              </div>
            
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>
                    {supportFilter === 'all' 
                      ? 'Toutes les demandes de support' 
                      : supportFilter === 'pending' 
                      ? 'Demandes en attente' 
                      : supportFilter === 'in_progress'
                      ? 'Demandes en cours'
                      : 'Demandes résolues'}
                  </CardTitle>
                  <CardDescription>
                    {supportFilter === 'all' 
                      ? 'Voir toutes les demandes de support des artisans' 
                      : supportFilter === 'pending' 
                      ? 'Nouvelles demandes en attente de réponse' 
                      : supportFilter === 'in_progress'
                      ? 'Demandes que vous êtes en train de traiter'
                      : 'Demandes qui ont été résolues'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filterMessages(supportFilter).length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Artisan</TableHead>
                            <TableHead>Sujet</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterMessages(supportFilter).map((message) => (
                            <TableRow key={message.id}>
                              <TableCell>
                                {format(message.createdAt, 'dd/MM/yyyy')}
                              </TableCell>
                              <TableCell className="font-medium">
                                {message.artisanName}
                                {message.artisanEmail && (
                                  <div className="text-xs text-muted-foreground">
                                    {message.artisanEmail}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{message.subject}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    message.status === 'resolved'
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : message.status === 'in_progress'
                                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  }
                                  variant="outline"
                                >
                                  {message.status === 'resolved' ? 'Résolu' : 
                                   message.status === 'in_progress' ? 'En cours' : 'En attente'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenSupportDialog(message)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  {message.status === 'resolved' ? 'Voir' : 'Répondre'}
                                </Button>
                                {message.status === 'pending' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(message.id, 'in_progress')}
                                  >
                                    Prendre en charge
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Aucune demande trouvée</h3>
                      <p className="text-muted-foreground">
                        {supportFilter === 'all' 
                          ? "Il n'y a pas encore de demandes de support" 
                          : `Il n'y a pas de demandes ${supportFilter === 'pending' ? 'en attente' : 
                              supportFilter === 'in_progress' ? 'en cours' : 'résolues'}`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Tabs>
          </TabsContent>

          {/* Artisan Modifications Tab */}
          <TabsContent value="modifications">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Modifications des Artisans</CardTitle>
                <CardDescription>
                  Gérer les demandes de modifications des profils d'artisans
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : modifications.length > 0 ? (
                  <div className="bg-white rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Artisan</TableHead>
                          <TableHead>Champs modifiés</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Auteur</TableHead>
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
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenModDialog(mod)}
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune modification en attente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Message Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Détail de la demande de support</DialogTitle>
              <DialogDescription>
                De {selectedMessage?.artisanName} le {selectedMessage && format(selectedMessage.createdAt, 'dd MMMM yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div>
                <h3 className="font-medium mb-1">Sujet</h3>
                <p>{selectedMessage?.subject}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Message</h3>
                <div className="p-3 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
                </div>
              </div>
              
              {(selectedMessage?.status !== 'resolved' || selectedMessage?.adminResponse) && (
                <div>
                  <h3 className="font-medium mb-1">Votre réponse</h3>
                  {selectedMessage?.status === 'resolved' ? (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap">{selectedMessage?.adminResponse}</p>
                    </div>
                  ) : (
                    <Textarea
                      value={responseText}
                      onChange={handleResponseChange}
                      placeholder="Tapez votre réponse ici..."
                      rows={5}
                    />
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
              >
                Fermer
              </Button>
              {selectedMessage?.status !== 'resolved' && (
                <Button
                  onClick={handleSubmitResponse}
                  disabled={submitting || !responseText.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> 
                      Envoyer la réponse
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Artisan Modification Dialog */}
        <Dialog open={!!selectedMod} onOpenChange={(open) => !open && setSelectedMod(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails de la modification</DialogTitle>
              <DialogDescription>
                Artisan: {selectedMod?.artisanName} - {selectedMod && format(new Date(selectedMod.modification_date), 'dd/MM/yyyy HH:mm')}
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
                  <Button variant="outline" onClick={() => setSelectedMod(null)}>
                    Fermer
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleRejectModification}
                    disabled={submitting}
                    className="gap-1"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Rejeter
                  </Button>
                  <Button 
                    onClick={handleApproveModification}
                    disabled={submitting}
                    className="gap-1"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approuver
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default SupportList;
