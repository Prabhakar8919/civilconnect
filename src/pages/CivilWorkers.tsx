import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBackground } from "@/context/BackgroundContext";
import { Profile, WorkerProfile, Connection } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";
import { ProfileCard } from "@/components/ProfileCard";

type CivilWorkerProfile = Profile & {
  worker_profiles: WorkerProfile[];
};

const CivilWorkers = () => {
  const [workers, setWorkers] = useState<CivilWorkerProfile[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfession, setSelectedProfession] = useState<string>("all");
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
    fetchWorkers(selectedProfession);
  }, [selectedProfession]);

  const { setBackground } = useBackground();

  // Set page background - fixed for non-home pages
  useEffect(() => {
    setBackground('/images/workers-hero.jpg', false);
    return () => setBackground(null, false);
  }, [setBackground]);

  const fetchWorkers = async (profession?: string) => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("*, worker_profiles(*)")
      .eq("user_type", "worker");

    // Filter by profession if selected
    if (profession && profession !== "all") {
      query = query.eq("profession", profession);
    }

    const { data: profiles } = await query.limit(20);

    if (profiles) {
      setWorkers(profiles as CivilWorkerProfile[]);
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

  const getConnectionStatus = (workerId: string) => {
    if (!user) return null;
    
    return connections.find(
      c => (c.requester_id === user.id && c.recipient_id === workerId) ||
           (c.recipient_id === user.id && c.requester_id === workerId)
    );
  };

  const handleConnect = async (workerId: string) => {
    if (!user) {
      toast.error("Please login to connect with civil workers");
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("connections").insert({
      requester_id: user.id,
      recipient_id: workerId,
      message: "I need your services for my project",
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
            Civil Workers
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
             style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
            Skilled workers for construction, repairs, and civil work
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Profession Filter Navigation */}
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedProfession === "all" ? "default" : "outline"}
              onClick={() => setSelectedProfession("all")}
              className={`font-semibold ${
                selectedProfession === "all"
                  ? "bg-primary text-white"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              All Workers
            </Button>
            <Button
              variant={selectedProfession === "plumber" ? "default" : "outline"}
              onClick={() => setSelectedProfession("plumber")}
              className={`font-semibold ${
                selectedProfession === "plumber"
                  ? "bg-primary text-white"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              Plumbers
            </Button>
            <Button
              variant={selectedProfession === "mason" ? "default" : "outline"}
              onClick={() => setSelectedProfession("mason")}
              className={`font-semibold ${
                selectedProfession === "mason"
                  ? "bg-primary text-white"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              Masons
            </Button>
            <Button
              variant={selectedProfession === "electrician" ? "default" : "outline"}
              onClick={() => setSelectedProfession("electrician")}
              className={`font-semibold ${
                selectedProfession === "electrician"
                  ? "bg-primary text-white"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              Electricians
            </Button>
            <Button
              variant={selectedProfession === "painter" ? "default" : "outline"}
              onClick={() => setSelectedProfession("painter")}
              className={`font-semibold ${
                selectedProfession === "painter"
                  ? "bg-primary text-white"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              Painters
            </Button>
            <Button
              variant={selectedProfession === "marble_worker" ? "default" : "outline"}
              onClick={() => setSelectedProfession("marble_worker")}
              className={`font-semibold ${
                selectedProfession === "marble_worker"
                  ? "bg-primary text-white"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              Marble Workers
            </Button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-white/80 font-medium drop-shadow-md">Loading civil workers...</p>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-16">
              <Wrench className="h-16 w-16 text-white/60 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">No Civil Workers Available Yet</h3>
              <p className="text-lg text-white/80 mb-6 font-medium">Be the first skilled worker to join our platform!</p>
              <Button 
                onClick={() => navigate("/auth?mode=signup")} 
                className="shadow-2xl font-semibold text-base px-6 py-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
              >
                Create Your Profile
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => {
                const connection = getConnectionStatus(worker.id);
                return (
                  <ProfileCard
                    key={worker.id}
                    profile={{
                      ...worker,
                      experience_years: worker.worker_profiles?.[0]?.experience_years,
                      cost_per_sqft: worker.worker_profiles?.[0]?.price_per_sqft,
                      total_projects: worker.worker_profiles?.[0]?.total_projects,
                    }}
                    currentUserId={user?.id}
                    connectionStatus={
                      connection?.status === 'accepted' ? 'accepted' :
                      connection?.status === 'pending' ? 'pending' : 'none'
                    }
                    connectionId={connection?.id}
                    onConnect={() => handleConnect(worker.id)}
                    onRatingSubmitted={() => fetchWorkers()}
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

export default CivilWorkers;
