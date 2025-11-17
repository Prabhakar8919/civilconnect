import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  LogOut, 
  Home, 
  Users, 
  MessageSquare, 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Send,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Profile, Connection, Notification } from "@/integrations/supabase/types";

type ConnectionWithProfile = Connection & {
  requester?: Profile;
  recipient?: Profile;
};

const Dashboard = ({ session }: { session: Session | null }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [connections, setConnections] = useState<ConnectionWithProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscriptions
    const connectionsSubscription = supabase
      .channel('connections_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'connections' }, () => {
        fetchConnections();
      })
      .subscribe();

    const notificationsSubscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      connectionsSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
    };
  }, [session]);

  const fetchDashboardData = async () => {
    if (!session?.user) {
      navigate("/auth");
      return;
    }

    await Promise.all([
      fetchProfile(),
      fetchConnections(),
      fetchNotifications()
    ]);
    
    setLoading(false);
  };

  const fetchProfile = async () => {
    if (!session?.user) return;

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile error:", error);
      toast({
        title: "Profile Error",
        description: "Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    if (!profileData) {
      // Create profile if it doesn't exist
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { error: insertError } = await supabase.from("profiles").upsert([{
          id: userData.user.id,
          full_name: userData.user.user_metadata?.full_name || "User",
          email: userData.user.email || "",
          user_type: userData.user.user_metadata?.user_type || "buyer",
        }]);
        
        if (!insertError) {
          // Fetch again
          const { data: newProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userData.user.id)
            .single();
          setProfile(newProfile);
        }
      }
    } else {
      setProfile(profileData);
    }
  };

  const fetchConnections = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("connections")
      .select(`
        *,
        requester:profiles!connections_requester_id_fkey(*),
        recipient:profiles!connections_recipient_id_fkey(*)
      `)
      .or(`requester_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setConnections(data as ConnectionWithProfile[]);
    }
  };

  const fetchNotifications = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setNotifications(data);
    }
  };

  const handleConnectionAction = async (connectionId: string, action: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from("connections")
      .update({ status: action })
      .eq("id", connectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update connection",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Connection ${action}`,
      });
      fetchConnections();
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);
    
    fetchNotifications();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getConnectionStats = () => {
    const pending = connections.filter(c => c.status === 'pending' && c.recipient_id === session?.user?.id).length;
    const accepted = connections.filter(c => c.status === 'accepted').length;
    const sent = connections.filter(c => c.status === 'pending' && c.requester_id === session?.user?.id).length;
    
    return { pending, accepted, sent };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = getConnectionStats();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CivilConnect</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/profile/edit")} className="shadow-lg">
                <Users className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="default" onClick={() => navigate("/")} className="shadow-lg">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-lg">
              {profile?.profile_image ? (
                <img 
                  src={profile.profile_image} 
                  alt={profile.full_name || "User"} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold">
                  {getInitials(profile?.full_name || "User")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name}!</h1>
              <p className="text-muted-foreground">
                <Badge variant="secondary" className="mt-1">
                  {profile?.user_type?.replace('_', ' ').toUpperCase()}
                </Badge>
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.accepted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sent Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{stats.sent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unread Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{unreadNotifications}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="connections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Connections</CardTitle>
                <CardDescription>
                  Manage your professional network and connection requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {connections.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No connections yet</p>
                    <Button className="mt-4" onClick={() => navigate("/services")}>
                      Explore Services
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connections.map((connection) => {
                      const isRequester = connection.requester_id === session?.user?.id;
                      const otherUser = isRequester ? connection.recipient : connection.requester;
                      
                      return (
                        <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(otherUser?.full_name || "User")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{otherUser?.full_name}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {otherUser?.user_type?.replace('_', ' ')}
                              </p>
                              {connection.message && (
                                <p className="text-sm text-muted-foreground italic mt-1">
                                  "{connection.message}"
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {connection.status === 'pending' && !isRequester && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleConnectionAction(connection.id, 'accepted')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleConnectionAction(connection.id, 'rejected')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {connection.status === 'pending' && isRequester && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                            {connection.status === 'accepted' && (
                              <>
                                <Badge className="bg-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Connected
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/chat/${connection.id}`)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Chat
                                </Button>
                              </>
                            )}
                            {connection.status === 'rejected' && (
                              <Badge variant="destructive">Rejected</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Chat with your connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 h-[500px]">
                  {/* Chat List */}
                  <div className="border-r pr-4">
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search conversations..." className="pl-10" />
                      </div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      {connections.filter(c => c.status === 'accepted').length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No active chats</p>
                        </div>
                      ) : (
                        connections
                          .filter(c => c.status === 'accepted')
                          .map((connection) => {
                            const isRequester = connection.requester_id === session?.user?.id;
                            const otherUser = isRequester ? connection.recipient : connection.requester;
                            
                            return (
                              <div
                                key={connection.id}
                                onClick={() => setSelectedChat(connection.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                                  selectedChat === connection.id ? 'bg-accent' : ''
                                }`}
                              >
                                <Avatar>
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {getInitials(otherUser?.full_name || "User")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{otherUser?.full_name}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    Click to start chatting
                                  </p>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </ScrollArea>
                  </div>

                  {/* Chat Window */}
                  <div className="md:col-span-2">
                    {selectedChat ? (
                      <div className="flex flex-col h-full justify-center items-center">
                        <MessageSquare className="h-16 w-16 text-primary mb-4" />
                        <p className="text-lg font-semibold mb-2">Open Full Chat</p>
                        <p className="text-sm text-muted-foreground mb-4">Click below to open the full chat experience</p>
                        <Button 
                          size="lg"
                          onClick={() => navigate(`/chat/${selectedChat}`)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Open Chat
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p>Select a conversation to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Stay updated with your activity</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                          className={`p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${
                            !notification.read ? 'bg-primary/5 border-primary/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold">{notification.title}</p>
                                {!notification.read && (
                                  <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
