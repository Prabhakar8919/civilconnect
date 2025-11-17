import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBackground } from "@/context/BackgroundContext";
import { ProfileCard } from "@/components/ProfileCard";

const MaterialSellers = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchSellers();
  }, []);

  const { setBackground } = useBackground();

  useEffect(() => {
    setBackground('/images/materials-hero.jpg', false);
    return () => setBackground(null, false);
  }, [setBackground]);

  const fetchSellers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_type", "material_seller")
      .limit(20);

    if (data) {
      setSellers(data);
    }
    setLoading(false);
  };

  const fetchConnections = async (userId: string) => {
    const { data } = await supabase
      .from("connections")
      .select("*")
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

    if (data) {
      setConnections(data);
    }
  };

  const getConnectionStatus = (sellerId: string) => {
    if (!user) return null;
    return connections.find(
      (conn) =>
        (conn.requester_id === user.id && conn.recipient_id === sellerId) ||
        (conn.recipient_id === user.id && conn.requester_id === sellerId)
    );
  };

  const handleConnect = async (sellerId: string) => {
    if (!user) {
      toast.error("Please login to connect with material sellers");
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("connections").insert({
      requester_id: user.id,
      recipient_id: sellerId,
      message: "I would like to inquire about your materials",
    });

    if (error) {
      toast.error("Failed to send connection request");
    } else {
      toast.success("Connection request sent successfully!");
      if (user) {
        fetchConnections(user.id);
      }
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
            Material Sellers
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
             style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
            Quality construction materials from verified suppliers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-white/80 font-medium drop-shadow-md">Loading material sellers...</p>
            </div>
          ) : sellers.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-white/60 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">No Material Sellers Available Yet</h3>
              <p className="text-lg text-white/80 mb-6 font-medium">Be the first material seller to join our platform!</p>
              <Button 
                onClick={() => navigate("/auth?mode=signup")} 
                className="shadow-2xl font-semibold text-base px-6 py-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
              >
                Create Your Profile
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellers.map((seller) => {
                const connection = getConnectionStatus(seller.id);
                return (
                  <ProfileCard
                    key={seller.id}
                    profile={seller}
                    currentUserId={user?.id}
                    connectionStatus={
                      connection?.status === 'accepted' ? 'accepted' :
                      connection?.status === 'pending' ? 'pending' : 'none'
                    }
                    connectionId={connection?.id}
                    onConnect={() => handleConnect(seller.id)}
                    onRatingSubmitted={() => fetchSellers()}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialSellers;
