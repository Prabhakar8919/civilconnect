import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBackground } from "@/context/BackgroundContext";
import { Profile, ProfessionalProfile, Connection } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";
import { ProfileCard } from "@/components/ProfileCard";

type ArchitectProfile = Profile & {
  professional_profiles: ProfessionalProfile[];
};

const Architects = () => {
  const [architects, setArchitects] = useState<ArchitectProfile[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
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
    fetchArchitects();
  }, []);

  const { setBackground } = useBackground();

  // Set page background - fixed for non-home pages
  useEffect(() => {
    setBackground('/images/architects-hero.jpg', false);
    return () => setBackground(null, false);
  }, [setBackground]);

  const fetchArchitects = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*, professional_profiles(*)")
      .eq("user_type", "architect")
      .limit(20);

    if (profiles) {
      setArchitects(profiles as ArchitectProfile[]);
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

  const getConnectionStatus = (architectId: string) => {
    if (!user) return null;
    
    return connections.find(
      c => (c.requester_id === user.id && c.recipient_id === architectId) ||
           (c.recipient_id === user.id && c.requester_id === architectId)
    );
  };

  const handleConnect = async (architectId: string) => {
    if (!user) {
      toast.error("Please login to connect with architects");
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("connections").insert({
      requester_id: user.id,
      recipient_id: architectId,
      message: "I would like to discuss my architectural needs",
    });

    if (error) {
      toast.error("Failed to send connection request");
    } else {
      toast.success("Connection request sent successfully!");
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
            Architects
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
             style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
            Professional architects for interior and exterior design
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-white/80 font-medium drop-shadow-md">Loading architects...</p>
            </div>
          ) : architects.length === 0 ? (
            <div className="text-center py-16">
              <Palette className="h-16 w-16 text-white/60 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">No Architects Available Yet</h3>
              <p className="text-lg text-white/80 mb-6 font-medium">Be the first architect to create a profile and showcase your work!</p>
              <Button 
                onClick={() => navigate("/auth?mode=signup")} 
                className="shadow-2xl font-semibold text-base px-6 py-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
              >
                Create Your Profile
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architects.map((architect) => {
                const connection = getConnectionStatus(architect.id);
                return (
                  <ProfileCard
                    key={architect.id}
                    profile={{
                      ...architect,
                      experience_years: architect.professional_profiles?.[0]?.experience_years,
                      cost_per_sqft: architect.professional_profiles?.[0]?.price_per_sqft,
                      total_projects: architect.professional_profiles?.[0]?.total_projects,
                    }}
                    currentUserId={user?.id}
                    connectionStatus={
                      connection?.status === 'accepted' ? 'accepted' :
                      connection?.status === 'pending' ? 'pending' : 'none'
                    }
                    connectionId={connection?.id}
                    onConnect={() => handleConnect(architect.id)}
                    onRatingSubmitted={() => fetchArchitects()}
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

export default Architects;
