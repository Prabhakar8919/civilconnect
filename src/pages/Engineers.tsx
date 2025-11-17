import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBackground } from "@/context/BackgroundContext";
import { Profile, ProfessionalProfile, Connection } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";
import { ProfileCard } from "@/components/ProfileCard";

type EngineerProfile = Profile & {
  professional_profiles: ProfessionalProfile[];
};

const Engineers = () => {
  const [engineers, setEngineers] = useState<EngineerProfile[]>([]);
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
    fetchEngineers();
  }, []);

  const { setBackground } = useBackground();

  // Set page background - fixed for non-home pages
  useEffect(() => {
    setBackground('/images/engineers-hero.jpg', false);
    return () => setBackground(null, false);
  }, [setBackground]);

  const fetchEngineers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*, professional_profiles(*)")
      .eq("user_type", "engineer")
      .limit(20);

    if (profiles) {
      setEngineers(profiles as EngineerProfile[]);
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

  const getConnectionStatus = (engineerId: string) => {
    if (!user) return null;
    
    return connections.find(
      c => (c.requester_id === user.id && c.recipient_id === engineerId) ||
           (c.recipient_id === user.id && c.requester_id === engineerId)
    );
  };

  const handleConnect = async (engineerId: string) => {
    if (!user) {
      toast.error("Please login to connect with engineers");
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("connections").insert({
      requester_id: user.id,
      recipient_id: engineerId,
      message: "I would like to connect with you for my project",
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
            Engineers
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
             style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
            Connect with professional engineers for your construction projects
          </p>
        </div>
      </div>

  <div className="container mx-auto px-4 pb-12">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-white/80 font-medium drop-shadow-md">Loading engineers...</p>
            </div>
          ) : engineers.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 text-white/60 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">No Engineers Available Yet</h3>
              <p className="text-lg text-white/80 mb-6 font-medium">Be the first engineer to join our platform!</p>
              <Button 
                onClick={() => navigate("/auth?mode=signup")} 
                className="shadow-2xl font-semibold text-base px-6 py-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
              >
                Create Your Profile
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engineers.map((engineer) => {
                const connection = getConnectionStatus(engineer.id);
                return (
                  <ProfileCard
                    key={engineer.id}
                    profile={{
                      ...engineer,
                      experience_years: engineer.professional_profiles?.[0]?.experience_years,
                      cost_per_sqft: engineer.professional_profiles?.[0]?.price_per_sqft,
                      total_projects: engineer.professional_profiles?.[0]?.total_projects,
                    }}
                    currentUserId={user?.id}
                    connectionStatus={
                      connection?.status === 'accepted' ? 'accepted' :
                      connection?.status === 'pending' ? 'pending' : 'none'
                    }
                    connectionId={connection?.id}
                    onConnect={() => handleConnect(engineer.id)}
                    onRatingSubmitted={() => fetchEngineers()}
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

export default Engineers;
