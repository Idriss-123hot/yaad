
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
import { Loader2, Check, MessageSquare } from 'lucide-react';

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
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

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

  const handleOpenDialog = (message: SupportMessage) => {
    setSelectedMessage(message);
    setResponseText(message.adminResponse || '');
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

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Support Requests</h1>
          <p className="text-muted-foreground">
            Manage and respond to artisan support requests
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>
                  {activeTab === 'all' 
                    ? 'All Support Requests' 
                    : activeTab === 'pending' 
                    ? 'Pending Requests' 
                    : activeTab === 'in_progress'
                    ? 'In Progress Requests'
                    : 'Resolved Requests'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'all' 
                    ? 'View all support requests from artisans' 
                    : activeTab === 'pending' 
                    ? 'New requests awaiting response' 
                    : activeTab === 'in_progress'
                    ? 'Requests you are currently handling'
                    : 'Requests that have been resolved'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filterMessages(activeTab).length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Artisan</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterMessages(activeTab).map((message) => (
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
                                {message.status === 'resolved' ? 'Resolved' : 
                                 message.status === 'in_progress' ? 'In Progress' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(message)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {message.status === 'resolved' ? 'View' : 'Respond'}
                              </Button>
                              {message.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(message.id, 'in_progress')}
                                >
                                  Take
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
                    <h3 className="text-lg font-medium mb-1">No requests found</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'all' 
                        ? 'There are no support requests yet' 
                        : `There are no ${activeTab.replace('_', ' ')} requests`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Response Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Support Request</DialogTitle>
              <DialogDescription>
                From {selectedMessage?.artisanName} on {selectedMessage && format(selectedMessage.createdAt, 'dd MMMM yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div>
                <h3 className="font-medium mb-1">Subject</h3>
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
                  <h3 className="font-medium mb-1">Your Response</h3>
                  {selectedMessage?.status === 'resolved' ? (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap">{selectedMessage?.adminResponse}</p>
                    </div>
                  ) : (
                    <Textarea
                      value={responseText}
                      onChange={handleResponseChange}
                      placeholder="Type your response here..."
                      rows={5}
                    />
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              {selectedMessage?.status !== 'resolved' && (
                <Button
                  onClick={handleSubmitResponse}
                  disabled={submitting || !responseText.trim()}
                  className="w-full sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Sending...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> 
                      Send Response
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default SupportList;
