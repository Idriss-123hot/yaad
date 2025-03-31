
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { isSessionExpired, updateLastActivity } from '@/utils/authUtils';

interface SessionTimeoutProps {
  redirectPath: string;
}

export function SessionTimeout({ redirectPath }: SessionTimeoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Update last activity on mount
    updateLastActivity();

    // Add event listeners to update last activity timestamp
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      updateLastActivity();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Check for session timeout every minute
    const checkSessionInterval = setInterval(() => {
      if (isSessionExpired(localStorage.getItem('lastActivity'))) {
        clearInterval(checkSessionInterval);
        
        // Logout the user
        supabase.auth.signOut().then(() => {
          toast({
            title: 'Session expirée',
            description: 'Vous avez été déconnecté après 30 minutes d\'inactivité',
          });
          
          navigate(redirectPath);
        });
      }
    }, 60000); // Check every minute

    return () => {
      // Clean up event listeners and interval
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      
      clearInterval(checkSessionInterval);
    };
  }, [navigate, redirectPath, toast]);

  return null;
}
