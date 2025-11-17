import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ProfileCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, Hammer, Home, ShoppingBag, User, MapPin, Maximize2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Services = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [landListings, setLandListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    { name: "All", icon: Users },
    { name: "Engineers", icon: Building2, userType: "engineer" },
    { name: "Architects", icon: Building2, userType: "architect" },
    { name: "Civil Workers", icon: Hammer, userType: "worker" },
    { name: "Contractors", icon: Building2, userType: "contractor" },
    { name: "Builders", icon: Building2, userType: "builder" },
    { name: "Land Owners", icon: Home, userType: "land_owner" },
    { name: "Material Sellers", icon: ShoppingBag, userType: "material_seller" },
    { name: "Land Records", icon: MapPin, type: "land" },
  ];

  useEffect(() => {
    checkAuth();
    fetchProfiles();
    fetchLandListings();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
    if (user?.id) {
      fetchConnections(user.id);
    }
  };

  const fetchConnections = async (userId: string) => {
    const { data } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
    
    setConnections(data || []);
  };

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      
      setProfiles(data || []);
    } catch (err: any) {
      console.error("Error fetching profiles:", err);
      setError(err.message || "Failed to load profiles");
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLandListings = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("land_listings")
        .select(`
          *,
          owner:profiles!land_listings_owner_id_fkey(id, full_name, email, phone)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      
      setLandListings(data || []);
    } catch (err: any) {
      console.error("Error fetching land listings:", err);
    }
  };

  const filteredProfiles = selectedCategory === "All" 
    ? profiles 
    : profiles.filter(p => {
        const category = categories.find(c => c.name === selectedCategory);
        return category && p.user_type === category.userType;
      });

  const getConnectionStatus = (profileId: string) => {
    if (!currentUserId) return { status: 'none' as const, connectionId: undefined };
    
    const connection = connections.find(
      (c) =>
        (c.requester_id === currentUserId && c.recipient_id === profileId) ||
        (c.recipient_id === currentUserId && c.requester_id === profileId)
    );

    if (!connection) return { status: 'none' as const, connectionId: undefined };
    
    return {
      status: connection.status as 'pending' | 'accepted',
      connectionId: connection.id,
    };
  };

  const handleConnect = async (profileId: string) => {
    if (!currentUserId) {
      toast({
        title: "Authentication Required",
        description: "Please login to connect with professionals.",
        variant: "destructive",
      });
      navigate("/auth?mode=login");
      return;
    }

    try {
      const { error } = await supabase.from('connections').insert({
        requester_id: currentUserId,
        recipient_id: profileId,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully.",
      });

      // Refresh connections
      fetchConnections(currentUserId);
    } catch (err: any) {
      console.error("Error sending connection request:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to send connection request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse and connect with construction professionals, land owners, and material suppliers all in one place.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className="whitespace-nowrap flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading services...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-destructive mb-2">Error Loading Services</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchProfiles}>Try Again</Button>
              </div>
            </div>
          )}

          {/* Services Grid or Land Listings */}
          {!loading && !error && (
            <>
              {selectedCategory === "Land Records" ? (
                <>
                  {landListings.length > 0 ? (
                    <>
                      <div className="mb-6">
                        <p className="text-muted-foreground">
                          Showing {landListings.length} land listing{landListings.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {landListings.map((land) => (
                          <Card key={land.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardHeader className="p-0">
                              {land.images && land.images.length > 0 ? (
                                <img
                                  src={land.images[0]}
                                  alt={land.title}
                                  className="w-full h-48 object-cover"
                                />
                              ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                                  <Home className="h-16 w-16 text-green-600 opacity-50" />
                                </div>
                              )}
                            </CardHeader>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-lg mb-2 line-clamp-1">{land.title}</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span className="line-clamp-1">{land.city}, {land.state}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-semibold">{land.area_sqft} sq ft</span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Total Price</p>
                                    <p className="text-xl font-bold text-primary">₹{land.price.toLocaleString()}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Per sq ft</p>
                                    <p className="text-sm font-semibold">₹{land.price_per_sqft}</p>
                                  </div>
                                </div>
                              </div>
                              {land.status && (
                                <Badge className="mt-3" variant={land.status === 'active' ? 'default' : 'secondary'}>
                                  {land.status}
                                </Badge>
                              )}
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <Button 
                                className="w-full" 
                                onClick={() => navigate(`/land/${land.id}`)}
                              >
                                View Details
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <Home className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-2xl font-semibold mb-2">No Land Listings Available</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        No land listings are currently available. Check back later!
                      </p>
                    </div>
                  )}
                </>
              ) : (filteredProfiles.length > 0 || (selectedCategory === "All" && landListings.length > 0)) ? (
                <>
                  <div className="mb-6">
                    <p className="text-muted-foreground">
                      Showing {filteredProfiles.length} {selectedCategory === "All" ? "professional" : selectedCategory.toLowerCase()}{filteredProfiles.length !== 1 ? 's' : ''}
                      {selectedCategory === "All" && landListings.length > 0 && ` and ${landListings.length} land listing${landListings.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  
                  {/* Professionals Grid */}
                  {filteredProfiles.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Professionals</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                        {filteredProfiles.map((profile) => {
                          const { status, connectionId } = getConnectionStatus(profile.id);
                          return (
                            <ProfileCard
                              key={profile.id}
                              profile={profile}
                              currentUserId={currentUserId || undefined}
                              connectionStatus={status}
                              connectionId={connectionId}
                              onConnect={() => handleConnect(profile.id)}
                              onRatingSubmitted={() => {
                                toast({
                                  title: "Rating Submitted",
                                  description: "Thank you for your feedback!",
                                });
                              }}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Land Listings Grid - Show in "All" category */}
                  {selectedCategory === "All" && landListings.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Land Listings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {landListings.map((land) => (
                          <Card key={land.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardHeader className="p-0">
                              {land.images && land.images.length > 0 ? (
                                <img
                                  src={land.images[0]}
                                  alt={land.title}
                                  className="w-full h-48 object-cover"
                                />
                              ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                                  <Home className="h-16 w-16 text-green-600 opacity-50" />
                                </div>
                              )}
                            </CardHeader>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-lg mb-2 line-clamp-1">{land.title}</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span className="line-clamp-1">{land.city}, {land.state}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-semibold">{land.area_sqft} sq ft</span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Total Price</p>
                                    <p className="text-xl font-bold text-primary">₹{land.price.toLocaleString()}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Per sq ft</p>
                                    <p className="text-sm font-semibold">₹{land.price_per_sqft}</p>
                                  </div>
                                </div>
                              </div>
                              {land.status && (
                                <Badge className="mt-3" variant={land.status === 'active' ? 'default' : 'secondary'}>
                                  {land.status}
                                </Badge>
                              )}
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <Button 
                                className="w-full" 
                                onClick={() => navigate(`/land/${land.id}`)}
                              >
                                View Details
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <Users className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-2xl font-semibold mb-2">No Services Available</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {selectedCategory === "All" 
                      ? "No professionals have registered yet. Be the first to join our platform!" 
                      : `No ${selectedCategory.toLowerCase()} have registered yet.`}
                  </p>
                  <Button onClick={() => navigate("/auth?mode=signup")} size="lg">
                    Create Your Profile
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
