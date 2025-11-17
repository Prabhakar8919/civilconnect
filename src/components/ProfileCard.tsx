import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Briefcase, MessageSquare, Award } from "lucide-react";
import { RatingDialog } from "@/components/RatingDialog";
import { ProfileViewModal } from "@/components/ProfileViewModal";
import { PhotoPreviewModal } from "@/components/PhotoPreviewModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatCompactAddress } from "@/lib/addressUtils";

interface ProfileCardProps {
  profile: any;
  currentUserId?: string;
  connectionStatus?: 'none' | 'pending' | 'accepted';
  connectionId?: string;
  onConnect?: () => void;
  onRatingSubmitted?: () => void;
}

export const ProfileCard = ({
  profile,
  currentUserId,
  connectionStatus = 'none',
  connectionId,
  onConnect,
  onRatingSubmitted,
}: ProfileCardProps) => {
  const navigate = useNavigate();
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Fetch ratings on component mount and when profile changes
  useEffect(() => {
    fetchRating();
  }, [profile.id]);

  const fetchRating = async () => {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('rated_user_id', profile.id);

    if (!error && data) {
      const avg = data.length > 0 
        ? data.reduce((sum, r) => sum + r.rating, 0) / data.length 
        : 0;
      setAverageRating(avg);
      setTotalReviews(data.length);
    }
  };

  const handleRatingSubmitted = () => {
    fetchRating();
    onRatingSubmitted?.();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 transition-all ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleCardClick = () => {
    setShowProfileModal(true);
  };

  const handlePhotoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (profile.profile_image) {
      setShowPhotoModal(true);
    }
  };

  const handleChatClick = () => {
    if (connectionStatus === 'accepted' && connectionId) {
      navigate(`/chat/${connectionId}`);
    } else if (connectionStatus === 'pending') {
      toast.error("Connection request is pending");
    } else {
      toast.error("Not connected");
    }
  };

  return (
    <>
      <Card 
        className="group relative overflow-hidden border-2 border-white/20 hover:border-primary/60 bg-black/80 backdrop-blur-md hover:shadow-2xl hover:shadow-black/50 transition-all duration-500 hover:-translate-y-2 animate-fade-in cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start gap-4">
            {/* Profile Image/Avatar */}
            <div className="relative">
              {profile.profile_image ? (
                <img 
                  src={profile.profile_image} 
                  alt={profile.full_name}
                  className="h-20 w-20 rounded-2xl object-cover border-3 border-primary/30 shadow-lg group-hover:scale-105 transition-transform duration-300 cursor-pointer hover:ring-2 hover:ring-primary"
                  onClick={handlePhotoClick}
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-2xl border-3 border-primary/30 shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  {profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
              )}
              {/* Online indicator (optional) */}
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-card rounded-full shadow-lg" />
            </div>

            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold truncate text-white group-hover:text-primary transition-colors drop-shadow-md">
                {profile.full_name}
              </CardTitle>
              <CardDescription className="flex items-start gap-1.5 mt-1.5 text-sm text-white/80">
                <MapPin className="h-4 w-4 shrink-0 text-primary drop-shadow-md mt-0.5" />
                <span className="line-clamp-2 drop-shadow-sm" title={formatCompactAddress(profile)}>
                  {formatCompactAddress(profile)}
                </span>
              </CardDescription>
              
              {/* Rating Display */}
              <div className="flex items-center gap-2 mt-2">
                {renderStars(averageRating)}
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  {averageRating > 0 ? averageRating.toFixed(1) : 'New'} 
                </span>
                {totalReviews > 0 && (
                  <span className="text-xs text-white/70 drop-shadow-sm">
                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Bio */}
          <p className="text-sm text-white/80 line-clamp-2 leading-relaxed drop-shadow-sm">
            {profile.bio || "Professional with expertise in construction projects."}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {profile.experience_years && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/20 border border-primary/30 backdrop-blur-sm">
                <Briefcase className="h-4 w-4 text-primary shrink-0 drop-shadow-md" />
                <span className="text-xs font-medium truncate text-white drop-shadow-sm">{profile.experience_years}+ years</span>
              </div>
            )}
            {profile.total_projects && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/20 border border-accent/30 backdrop-blur-sm">
                <Award className="h-4 w-4 text-accent shrink-0 drop-shadow-md" />
                <span className="text-xs font-medium truncate text-white drop-shadow-sm">{profile.total_projects}+ projects</span>
              </div>
            )}
          </div>

          {/* Pricing */}
          {profile.cost_per_sqft && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary/30 to-accent/30 border border-primary/40 backdrop-blur-sm">
              <p className="text-lg font-bold text-white text-center drop-shadow-md">
                ₹{profile.cost_per_sqft}/sq ft
              </p>
            </div>
          )}

          {/* Action Buttons - Always visible */}
          <div className="space-y-2 pt-2">
            {/* Show buttons only if not viewing own profile */}
            {(!currentUserId || currentUserId !== profile.id) && (
              <>
                {/* Rating Button - Only for connected users */}
                {currentUserId && connectionStatus === 'accepted' && (
                  <Button
                    variant="outline"
                    className="w-full border-2 border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50 text-white font-semibold transition-all group/btn backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRatingDialog(true);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2 group-hover/btn:fill-yellow-400 group-hover/btn:text-yellow-400 transition-all" />
                    Rate This Professional
                  </Button>
                )}

                {/* Chat Button - Always visible for logged in users */}
                {currentUserId ? (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all group/btn py-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (connectionStatus === 'accepted' && connectionId) {
                        navigate(`/chat/${connectionId}`);
                      } else if (connectionStatus === 'pending') {
                        toast.error("Connection request is pending", {
                          description: `Please wait for ${profile.full_name} to accept your connection request before chatting.`,
                        });
                      } else {
                        toast.error("Not connected", {
                          description: `You need to connect with ${profile.full_name} before you can chat. Click the Connect button below.`,
                        });
                      }
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Chat Now
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all py-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.error("Please login", {
                        description: "You need to login to connect with professionals.",
                      });
                      navigate("/auth?mode=login");
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat Now
                  </Button>
                )}

                {/* Connect/Status Button */}
                {currentUserId && connectionStatus === 'none' && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all py-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConnect?.();
                    }}
                  >
                    Connect
                  </Button>
                )}

                {currentUserId && connectionStatus === 'pending' && (
                  <Button className="w-full bg-white/10 border-2 border-white/30 text-white font-semibold backdrop-blur-sm py-6" disabled variant="outline">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                      Request Pending
                    </div>
                  </Button>
                )}

                {!currentUserId && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all py-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.error("Please login", {
                        description: "You need to login to connect with professionals.",
                      });
                      navigate("/auth?mode=login");
                    }}
                  >
                    Login to Connect
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rating Dialog */}
      {showRatingDialog && connectionId && (
        <RatingDialog
          open={showRatingDialog}
          onOpenChange={setShowRatingDialog}
          ratedUserId={profile.id}
          ratedUserName={profile.full_name}
          connectionId={connectionId}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}

      {/* Profile View Modal */}
      <ProfileViewModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        profile={profile}
        isAuthenticated={!!currentUserId}
        onConnect={onConnect}
        onChat={handleChatClick}
        onRate={() => {
          setShowProfileModal(false);
          setShowRatingDialog(true);
        }}
      />

      {/* Photo Preview Modal */}
      {profile.profile_image && (
        <PhotoPreviewModal
          open={showPhotoModal}
          onOpenChange={setShowPhotoModal}
          imageUrl={profile.profile_image}
          alt={profile.full_name}
        />
      )}
    </>
  );
};
