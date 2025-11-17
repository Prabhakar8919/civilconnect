import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  ArrowLeft, 
  Paperclip,
  File,
  Download
} from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { notifyNewMessage } from "@/lib/notifications";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  attachment_url?: string;
  attachment_type?: string;
  created_at: string;
  sender?: {
    full_name: string;
    profile_image?: string;
  };
}

const Chat = () => {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [connection, setConnection] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchChatData();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat_${connectionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `connection_id=eq.${connectionId}`
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [connectionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    // Fetch connection details
    const { data: connectionData } = await supabase
      .from("connections")
      .select(`
        *,
        requester:profiles!connections_requester_id_fkey(*),
        recipient:profiles!connections_recipient_id_fkey(*)
      `)
      .eq("id", connectionId)
      .single();

    if (connectionData) {
      setConnection(connectionData);
      setIsConnected(connectionData.status === 'accepted');
      
      // Determine the other user
      const other = connectionData.requester_id === user.id 
        ? connectionData.recipient 
        : connectionData.requester;
      setOtherUser(other);
    }

    fetchMessages();
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select(`
        *,
        sender:profiles!chat_messages_sender_id_fkey(full_name, profile_image)
      `)
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data as Message[]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !isConnected) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage(""); // Clear immediately for better UX

    try {
      const receiverId = connection.requester_id === user.id 
        ? connection.recipient_id 
        : connection.requester_id;

      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          connection_id: connectionId,
          sender_id: user.id,
          receiver_id: receiverId,
          message: messageText,
        })
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name, profile_image)
        `)
        .single();

      if (error) throw error;

      // Add message immediately to state for instant feedback
      if (data) {
        setMessages(prev => [...prev, data as any]);
        
        // Send notification to receiver
        const { data: senderProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (senderProfile && otherUser) {
          await notifyNewMessage(
            receiverId,
            senderProfile.full_name,
            user.id,
            messageText,
            connectionId!,
            otherUser.email,
            otherUser.phone
          );
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isConnected) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(data.path);

      // Determine file type
      let attachmentType = 'file';
      if (file.type.startsWith('image/')) {
        attachmentType = 'image';
      } else if (file.type.startsWith('video/')) {
        attachmentType = 'video';
      }

      // Send message with attachment
      const receiverId = connection.requester_id === user.id 
        ? connection.recipient_id 
        : connection.requester_id;

      const { data: messageData, error } = await supabase
        .from("chat_messages")
        .insert({
          connection_id: connectionId,
          sender_id: user.id,
          receiver_id: receiverId,
          message: file.name,
          attachment_url: publicUrl,
          attachment_type: attachmentType,
        })
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name, profile_image)
        `)
        .single();

      if (error) throw error;

      // Add message immediately to state
      if (messageData) {
        setMessages(prev => [...prev, messageData as any]);
      }

      toast.success("File uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderAttachment = (message: Message) => {
    if (!message.attachment_url) return null;

    const isOwn = message.sender_id === user.id;

    if (message.attachment_type === 'image') {
      return (
        <div className="mt-1">
          <img 
            src={message.attachment_url} 
            alt={message.message}
            className="max-w-[280px] md:max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity border-2 border-white/10"
            onClick={() => window.open(message.attachment_url, '_blank')}
            onError={(e) => {
              console.error('Image load error:', message.attachment_url);
              e.currentTarget.style.display = 'none';
            }}
          />
          <p className="text-xs mt-2 opacity-70">Click to view full size</p>
        </div>
      );
    }

    return (
      <div className={`mt-1 flex items-center gap-3 p-3 rounded-lg border-2 ${
        isOwn 
          ? 'bg-primary-foreground/10 border-primary-foreground/20' 
          : 'bg-muted border-border'
      }`}>
        <File className="h-5 w-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{message.message}</p>
          <p className="text-xs opacity-70">Click to download</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.open(message.attachment_url, '_blank')}
          className="shrink-0"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (!connection || !otherUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="flex-1 flex flex-col container mx-auto px-4 pt-20 pb-4 max-w-5xl overflow-hidden">
        {/* Header - Compact and Modern */}
        <div className="bg-card border border-border rounded-t-2xl shadow-lg">
          <div className="flex items-center gap-3 p-4 md:p-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-accent rounded-full shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-primary/20 shrink-0 shadow-md">
                <AvatarImage src={otherUser.profile_image} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-lg font-semibold">
                  {getInitials(otherUser.full_name)}
                </AvatarFallback>
              </Avatar>
              {isConnected && (
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 border-2 border-card rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold truncate">{otherUser.full_name}</h2>
                {isConnected && (
                  <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    Online
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground capitalize truncate">
                {otherUser.user_type?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area - Flexible height */}
        <div className="flex-1 bg-card border-x border-border overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4 md:p-6">
            {!isConnected ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md mx-auto p-8 bg-muted/50 rounded-2xl">
                  <div className="h-16 w-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Connection Pending</h3>
                  <p className="text-sm text-muted-foreground">
                    Wait for {otherUser.full_name} to accept your connection request to start chatting.
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start the Conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Send a message to {otherUser.full_name} to get started!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => {
                  const isOwn = message.sender_id === user.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 md:gap-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="h-10 w-10 md:h-12 md:w-12 shrink-0 ring-2 ring-background shadow-md">
                        <AvatarImage src={message.sender?.profile_image} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-bold">
                          {getInitials(message.sender?.full_name || "User")}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%] md:max-w-[65%]`}>
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-md ${
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-tr-md'
                              : 'bg-card border border-border rounded-tl-md'
                          }`}
                        >
                          {message.attachment_url ? (
                            <>
                              {renderAttachment(message)}
                              {message.message && message.attachment_type !== 'image' && (
                                <p className="text-sm md:text-base break-words leading-relaxed mt-2">{message.message}</p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm md:text-base break-words leading-relaxed">{message.message}</p>
                          )}
                        </div>
                        <span className="text-[10px] md:text-xs text-muted-foreground/70 mt-1.5 px-2">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="bg-card border border-border rounded-b-2xl shadow-lg">
          <div className="p-4 md:p-5">
            {!isConnected ? (
              <div className="text-center py-3 text-muted-foreground">
                <p className="text-sm">Connection required to send messages</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="hover:bg-accent rounded-full shrink-0 h-11 w-11 border-2"
                  title="Attach file"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  ) : (
                    <Paperclip className="h-5 w-5" />
                  )}
                </Button>

                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1 rounded-full h-11 px-5 text-base border-2 focus-visible:ring-2"
                />

                <Button 
                  type="submit" 
                  disabled={sending || !newMessage.trim()}
                  className="rounded-full shrink-0 h-11 w-11 shadow-lg hover:shadow-xl transition-shadow"
                  size="icon"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
