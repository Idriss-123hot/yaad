
import { useState, useEffect } from 'react';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare } from 'lucide-react';

interface SupportMessage {
  id: string;
  subject: string;
  message: string;
  status: string;
  adminResponse?: string;
  createdAt: Date;
  respondedAt?: Date;
}

const ArtisanMessages = () => {
  const [artisanId, setArtisanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const { toast } = useToast();

  // Fetch artisan ID and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user's artisan ID
        const { data: artisanData, error: artisanError } = await supabase.rpc('get_artisan_id');
        
        if (artisanError) throw artisanError;
        if (!artisanData) {
          toast({
            title: "Account Error",
            description: "Could not find your artisan account information.",
            variant: "destructive"
          });
          return;
        }
        
        setArtisanId(artisanData);
        
        // Fetch support messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('support_messages')
          .select('*')
          .eq('artisan_id', artisanData)
          .order('created_at', { ascending: false });
          
        if (messagesError) throw messagesError;
        
        const formattedMessages = messagesData.map(msg => ({
          id: msg.id,
          subject: msg.subject,
          message: msg.message,
          status: msg.status,
          adminResponse: msg.admin_response,
          createdAt: new Date(msg.created_at),
          respondedAt: msg.responded_at ? new Date(msg.responded_at) : undefined
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load your messages.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // View message details
  const handleViewMessage = (message: SupportMessage) => {
    setSelectedMessage(message);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <ArtisanLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Your Messages</h1>
          <p className="text-muted-foreground">
            View your communication history with customer support
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Message History</CardTitle>
            <CardDescription>
              View your previous messages and support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((msg) => (
                      <TableRow key={msg.id}>
                        <TableCell>{format(msg.createdAt, 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="font-medium">{msg.subject}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(msg.status)}`}
                          >
                            {msg.status === 'resolved' ? 'Resolved' :
                             msg.status === 'in_progress' ? 'In Progress' : 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewMessage(msg)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No messages yet</h3>
                <p className="text-muted-foreground">
                  You haven't sent any messages to support yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Message Details Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedMessage?.subject}</DialogTitle>
              <DialogDescription>
                Sent on {selectedMessage && format(selectedMessage.createdAt, 'dd MMMM yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div>
                <h3 className="font-medium mb-1">Your Message</h3>
                <div className="p-3 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
                </div>
              </div>
              
              {selectedMessage?.adminResponse && (
                <div>
                  <h3 className="font-medium mb-1">Response</h3>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="whitespace-pre-wrap">{selectedMessage.adminResponse}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedMessage.respondedAt && 
                      `Responded on ${format(selectedMessage.respondedAt, 'dd MMMM yyyy')}`}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanMessages;
