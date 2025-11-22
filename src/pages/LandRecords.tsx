import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Maximize, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useBackground } from "@/context/BackgroundContext";
import { LandListing } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";
import { LandViewModal } from "@/components/LandViewModal";

const LandRecords = () => {
  const [lands, setLands] = useState<LandListing[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [showLandModal, setShowLandModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
      if (user) {
        fetchConnections(user.id);
      }
    };
    checkUser();
    fetchLands();
  }, []);

  const fetchConnections = async (userId: string) => {
    const { data } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
    
    setConnections(data || []);
  };

  const getConnectionStatus = (ownerId: string) => {
    if (!user) return { status: 'none' as const, connectionId: undefined };
    
    const connection = connections.find(
      (c) =>
        (c.requester_id === user.id && c.recipient_id === ownerId) ||
        (c.recipient_id === user.id && c.requester_id === ownerId)
    );

    if (!connection) return { status: 'none' as const, connectionId: undefined };
    
    return {
      status: connection.status as 'pending' | 'accepted',
      connectionId: connection.id,
    };
  };

  const { setBackground } = useBackground();

  // Set page background - fixed for non-home pages
  useEffect(() => {
    setBackground('/images/land-hero.jpg', false);
    return () => setBackground(null, false);
  }, [setBackground]);

  const fetchLands = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("land_listings")
      .select("*, profiles(*)")
      .eq("status", "active")
      .limit(20);

    if (data) {
      setLands(data as LandListing[]);
    }
    setLoading(false);
  };

  const handleConnect = async (ownerId: string) => {
    if (!user) {
      toast.error("Please login to connect with land owners");
      navigate("/auth");
      return;
    }

    // Prevent self-connection
    if (user.id === ownerId) {
      toast.error("Cannot connect with yourself", {
        description: "This is your own property listing.",
      });
      return;
    }

    // Check if connection already exists
    const existingConnection = connections.find(
      (c) =>
        (c.requester_id === user.id && c.recipient_id === ownerId) ||
        (c.recipient_id === user.id && c.requester_id === ownerId)
    );

    if (existingConnection) {
      toast.error("Connection already exists", {
        description: existingConnection.status === 'pending' 
          ? "Your connection request is pending." 
          : "You are already connected with this owner.",
      });
      return;
    }

    const { error } = await supabase.from("connections").insert({
      requester_id: user.id,
      recipient_id: ownerId,
      status: 'pending',
    });

    if (error) {
      console.error("Connection error:", error);
      toast.error("Failed to send connection request", {
        description: error.message || "Please try again later.",
      });
    } else {
      toast.success("Connection request sent successfully!", {
        description: "The owner will be notified of your request.",
      });
      if (user) {
        fetchConnections(user.id);
      }
    }
  };

  const handleChat = async (ownerId: string) => {
    if (!user) {
      toast.error("Please login to chat with land owners");
      navigate("/auth");
      return;
    }

    if (user.id === ownerId) {
      toast.error("Cannot chat with yourself");
      return;
    }

    try {
      // Check if connection already exists
      const { data: existingConnection } = await supabase
        .from('connections')
        .select('*')
        .or(`and(requester_id.eq.${user.id},recipient_id.eq.${ownerId}),and(requester_id.eq.${ownerId},recipient_id.eq.${user.id})`)
        .single();

      if (existingConnection) {
        // Connection exists, navigate to chat
        setShowLandModal(false);
        navigate(`/chat/${existingConnection.id}`);
        return;
      }

      // Create new connection
      const { data: newConnection, error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          recipient_id: ownerId,
          status: 'accepted', // Auto-accept for land owner chats
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Chat started successfully!");

      setShowLandModal(false);
      navigate(`/chat/${newConnection.id}`);
    } catch (err: any) {
      console.error("Error starting chat:", err);
      toast.error("Failed to start chat", {
        description: err.message || "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section with gradient overlay */}
      <div className="relative pt-20 pb-12 mb-8">
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" 
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}>
            Land Records
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
             style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
            Browse available land listings and connect with owners
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-white/80 font-medium drop-shadow-md">Loading land listings...</p>
            </div>
          ) : lands.length === 0 ? (
            <div className="text-center py-16">
              <Maximize className="h-16 w-16 text-white/60 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">No Land Listings Available Yet</h3>
              <p className="text-lg text-white/80 mb-6 font-medium">Be the first to list your property on our platform!</p>
              <Button 
                onClick={() => navigate("/auth?mode=signup")} 
                className="shadow-2xl font-semibold text-base px-6 py-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
              >
                List Your Property
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lands.map((land) => (
            <Card key={land.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-white/20 bg-black/80 backdrop-blur-md">
              {/* Property Image */}
              {land.cover_image ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={land.cover_image} 
                    alt={land.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <Badge className="absolute top-3 right-3 shadow-lg">{land.status}</Badge>
                </div>
              ) : (
                <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Maximize className="h-16 w-16 text-white/40" />
                  <Badge className="absolute top-3 right-3 shadow-lg">{land.status}</Badge>
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl font-bold text-white truncate">{land.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-2 text-white/80">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate">{land.city}, {land.state}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">{land.description}</p>

                {/* Property Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/20 border border-primary/30">
                    <Maximize className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-white">{land.area_sqft} sq ft</span>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gradient-to-r from-primary/30 to-accent/30 border border-primary/40">
                    <div className="text-2xl font-bold text-white">
                      ₹{Number(land.price).toLocaleString("en-IN")}
                    </div>
                    <p className="text-sm text-white/70 mt-1">
                      ₹{land.price_per_sqft}/sq ft
                    </p>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20">
                  {land.profiles?.profile_image ? (
                    <img 
                      src={land.profiles.profile_image} 
                      alt={land.profiles.full_name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-primary/50"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm border-2 border-primary/50">
                      {land.profiles?.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/60 font-medium">Property Owner</p>
                    <p className="text-sm font-semibold text-white truncate">{land.profiles?.full_name}</p>
                  </div>
                </div>

                {/* Action Buttons - Only show if not own listing */}
                {user && user.id !== land.owner_id ? (
                  <div className="space-y-2">
                    {/* View Details Button */}
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl transition-all py-6"
                      onClick={() => {
                        setSelectedLand(land);
                        setShowLandModal(true);
                      }}
                    >
                      View Details
                    </Button>

                    {/* Chat Button */}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xl hover:shadow-blue-500/50 transition-all py-6"
                      onClick={() => handleChat(land.owner_id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with Owner
                    </Button>

                    {/* Connect Button - Only show if not connected */}
                    {(() => {
                      const { status } = getConnectionStatus(land.owner_id);
                      if (status === 'none') {
                        return (
                          <Button
                            variant="outline"
                            className="w-full border-2 border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50 text-white font-semibold transition-all backdrop-blur-sm py-6"
                            onClick={() => handleConnect(land.owner_id)}
                          >
                            Connect with Owner
                          </Button>
                        );
                      } else if (status === 'pending') {
                        return (
                          <Button 
                            variant="outline"
                            className="w-full bg-white/10 border-2 border-white/30 text-white font-semibold backdrop-blur-sm py-6" 
                            disabled
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                              Connection Pending
                            </div>
                          </Button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                ) : user && user.id === land.owner_id ? (
                  <div className="p-4 rounded-lg bg-primary/20 border-2 border-primary/40 text-center">
                    <p className="text-sm font-semibold text-white">
                      📋 This is your property listing
                    </p>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xl hover:shadow-blue-500/50 transition-all py-6"
                    onClick={() => {
                      toast.error("Please login", {
                        description: "You need to login to connect with property owners.",
                      });
                      navigate("/auth?mode=login");
                    }}
                  >
                    Login to Connect
                  </Button>
                )}
              </CardContent>
            </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Land View Modal */}
      {selectedLand && (
        <LandViewModal
          open={showLandModal}
          onOpenChange={setShowLandModal}
          land={selectedLand}
          onChatWithOwner={() => handleChat(selectedLand.owner_id)}
        />
      )}
    </div>
  );
};

export default LandRecords;
