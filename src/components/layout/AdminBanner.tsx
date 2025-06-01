
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminMessage {
  id: string;
  message: string;
  is_active: boolean;
  display_order: number;
}

export function AdminBanner() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_messages')
          .select('*')
          .eq('is_active', true)
          .order('display_order')
          .limit(3);

        if (error) {
          console.error('Error fetching admin messages:', error);
          return;
        }

        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching admin messages:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="bg-black text-white text-center py-2 px-4 text-sm font-medium">
      <div className="max-w-7xl mx-auto">
        {messages[currentMessageIndex]?.message}
      </div>
    </div>
  );
}

export default AdminBanner;
