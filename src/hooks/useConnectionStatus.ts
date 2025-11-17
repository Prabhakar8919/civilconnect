import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { notifyConnection } from '@/lib/notifications';

interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface ConnectionStatus {
  status: 'none' | 'pending' | 'accepted';
  connectionId?: string;
}

export const useConnectionStatus = (currentUserId: string | null, targetUserId: string) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchConnections = async () => {
    if (!currentUserId) return;

    setLoading(true);
    const { data } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`);

    setConnections(data || []);
    setLoading(false);
  };

  const getStatus = (): ConnectionStatus => {
    if (!currentUserId) return { status: 'none' };

    const connection = connections.find(
      (c) =>
        (c.requester_id === currentUserId && c.recipient_id === targetUserId) ||
        (c.recipient_id === currentUserId && c.requester_id === targetUserId)
    );

    if (!connection) return { status: 'none' };

    return {
      status: connection.status as 'pending' | 'accepted',
      connectionId: connection.id,
    };
  };

  const handleConnect = async () => {
    if (!currentUserId) {
      toast.error('Please login to connect', {
        description: 'You need to login to connect with professionals.',
      });
      navigate('/auth?mode=login');
      return;
    }

    // Prevent self-connection
    if (currentUserId === targetUserId) {
      toast.error('Cannot connect with yourself', {
        description: 'This is your own profile.',
      });
      return;
    }

    // Check if connection already exists
    const existingConnection = connections.find(
      (c) =>
        (c.requester_id === currentUserId && c.recipient_id === targetUserId) ||
        (c.recipient_id === currentUserId && c.requester_id === targetUserId)
    );

    if (existingConnection) {
      toast.error('Connection already exists', {
        description:
          existingConnection.status === 'pending'
            ? 'Your connection request is pending.'
            : 'You are already connected.',
      });
      return;
    }

    const { error } = await supabase.from('connections').insert({
      requester_id: currentUserId,
      recipient_id: targetUserId,
      status: 'pending',
    });

    if (error) {
      console.error('Connection error:', error);
      toast.error('Failed to send connection request', {
        description: error.message || 'Please try again later.',
      });
    } else {
      toast.success('Connection request sent!', {
        description: 'The user will be notified of your request.',
      });
      
      // Get current user's profile to send notification
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', currentUserId)
        .single();
      
      // Get target user's profile for email/phone
      const { data: targetUserProfile } = await supabase
        .from('profiles')
        .select('email, phone, full_name')
        .eq('id', targetUserId)
        .single();
      
      // Send notification to target user
      if (currentUserProfile && targetUserProfile) {
        await notifyConnection(
          targetUserId,
          'request',
          currentUserProfile.full_name,
          currentUserId,
          targetUserProfile.email,
          targetUserProfile.phone
        );
      }
      
      fetchConnections();
    }
  };

  const handleChat = (connectionId?: string) => {
    if (!currentUserId) {
      toast.error('Please login to chat', {
        description: 'You need to login to chat with professionals.',
      });
      navigate('/auth?mode=login');
      return;
    }

    const { status, connectionId: connId } = getStatus();

    if (status === 'accepted' && connId) {
      navigate(`/chat/${connId}`);
    } else if (status === 'pending') {
      toast.error('Connection request is pending', {
        description: 'Please wait for the user to accept your connection request.',
      });
    } else {
      toast.error('Not connected', {
        description: 'You need to connect first. Click the Connect button.',
      });
    }
  };

  return {
    ...getStatus(),
    loading,
    handleConnect,
    handleChat,
    refreshConnections: fetchConnections,
  };
};
