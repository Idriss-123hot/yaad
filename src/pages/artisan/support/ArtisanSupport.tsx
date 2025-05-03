
import { useState, useEffect } from 'react';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Loader2, Send, MessageSquare } from 'lucide-react';

const formSchema = z.object({
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type FormValues = z.infer<typeof formSchema>;

interface SupportMessage {
  id: string;
  subject: string;
  message: string;
  status: string;
  adminResponse?: string;
  createdAt: Date;
  respondedAt?: Date;
}

const ArtisanSupport = () => {
  const [artisanId, setArtisanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      message: ''
    }
  });

  // Fetch artisan ID and previous messages
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
        
        // Fetch previous support messages
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
          description: "Failed to load your support information.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const onSubmit = async (values: FormValues) => {
    if (!artisanId) {
      toast({
        title: "Error",
        description: "Could not determine your artisan account.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('support_messages')
        .insert({
          artisan_id: artisanId,
          subject: values.subject,
          message: values.message
        });
        
      if (error) throw error;
      
      toast({
        title: "Message Sent",
        description: "Your support request has been submitted successfully."
      });
      
      // Reset form
      form.reset();
      
      // Refresh messages list
      const { data, error: fetchError } = await supabase
        .from('support_messages')
        .select('*')
        .eq('artisan_id', artisanId)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      const formattedMessages = data.map(msg => ({
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
      console.error('Error submitting support message:', error);
      toast({
        title: "Error",
        description: "Failed to submit your support request.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ArtisanLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
            <p className="text-muted-foreground">
              Contact our team with any questions or issues you're facing
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Support Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>New Support Request</CardTitle>
              <CardDescription>
                Fill out the form below to submit a new support ticket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. Product listing issue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your issue in detail..." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Please provide as much detail as possible
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto" 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> 
                        Submit Request
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Previous Support Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Previous Requests</CardTitle>
              <CardDescription>
                View status and responses to your previous support requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((msg) => (
                      <TableRow key={msg.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>{format(msg.createdAt, 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="font-medium">{msg.subject}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              msg.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : msg.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {msg.status === 'resolved' ? 'Resolved' :
                             msg.status === 'in_progress' ? 'In Progress' : 'Pending'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No requests yet</h3>
                  <p className="text-muted-foreground">
                    Your previous support requests will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanSupport;
