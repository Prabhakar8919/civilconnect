import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Check, X, Clock, Users } from "lucide-react";
import { Connection, Profile } from "@/integrations/supabase/types";
import { notifyConnection } from "@/lib/notifications";

type ConnectionWithProfiles = Connection & {
  requester: Profile;
  recipient: Profile;
};

const Connections = () => {
  const [connections, setConnections] = useState<ConnectionWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    fetchConnections(user.id);
  };

  const fetchConnections = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("connections")
        .select(`
          *,
          requester:profiles!connections_requester_id_fkey(*),
          recipient:profiles!connections_recipient_id_fkey(*)
        `)
        .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConnections(data as ConnectionWithProfiles[] || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId: string) => {
    try {
      // Get connection details before updating
      const connection = connections.find(c => c.id === connectionId);
      if (!connection) return;

      const { error } = await supabase
        .from("connections")
        .update({ status: "accepted" })
        .eq("id", connectionId);

      if (error) throw error;

      toast({
        title: "Connection Accepted",
        description: "You can now chat with this user.",
      });

      // Send notification to the requester
      const requesterId = connection.requester_id;
      const requesterProfile = connection.requester;
      
      if (requesterId !== user.id) {
        // Get current user's profile
        const { data: currentUserProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (currentUserProfile) {
          await notifyConnection(
            requesterId,
            'accepted',
            currentUserProfile.full_name,
            user.id,
            requesterProfile.email,
            requesterProfile.phone
          );
        }
      }

      fetchConnections(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from("connections")
        .update({ status: "rejected" })
        .eq("id", connectionId);

      if (error) throw error;

      toast({
        title: "Connection Rejected",
        description: "The connection request has been declined.",
      });

      fetchConnections(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const pendingReceived = connections.filter(
    (c) => c.status === "pending" && c.recipient_id === user?.id
  );
  const pendingSent = connections.filter(
    (c) => c.status === "pending" && c.requester_id === user?.id
  );
  const accepted = connections.filter((c) => c.status === "accepted");

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading connections...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Connections</h1>
          <p className="text-muted-foreground">
            Manage your connection requests and chat with connected users
          </p>
        </div>

        <Tabs defaultValue="accepted" className="space-y-6">
          <TabsList>
            <TabsTrigger value="accepted">
              <Users className="h-4 w-4 mr-2" />
              Connected ({accepted.length})
            </TabsTrigger>
            <TabsTrigger value="received">
              <Clock className="h-4 w-4 mr-2" />
              Received ({pendingReceived.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              <Clock className="h-4 w-4 mr-2" />
              Sent ({pendingSent.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accepted" className="space-y-4">
            {accepted.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No connections yet</p>
                </CardContent>
              </Card>
            ) : (
              accepted.map((connection) => {
                const otherUser =
                  connection.requester_id === user?.id
                    ? connection.recipient
                    : connection.requester;
                return (
                  <Card key={connection.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{otherUser.full_name}</CardTitle>
                          <CardDescription className="capitalize">
                            {otherUser.user_type?.replace("_", " ")}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => navigate(`/chat/${connection.id}`)}
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="received" className="space-y-4">
            {pendingReceived.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingReceived.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{connection.requester.full_name}</CardTitle>
                        <CardDescription className="capitalize">
                          {connection.requester.user_type?.replace("_", " ")}
                        </CardDescription>
                        {connection.message && (
                          <p className="text-sm mt-2">{connection.message}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAccept(connection.id)}
                          size="sm"
                          variant="default"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(connection.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {pendingSent.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingSent.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{connection.recipient.full_name}</CardTitle>
                        <CardDescription className="capitalize">
                          {connection.recipient.user_type?.replace("_", " ")}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Connections;
