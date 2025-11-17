import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Briefcase, Mail, Phone, Award, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatAddress } from "@/lib/addressUtils";
import { toast } from "sonner";

interface ProfileViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  isAuthenticated: boolean;
  onConnect?: () => void;
  onChat?: () => void;
  onRate?: () => void;
}

export const ProfileViewModal = ({
  open,
  onOpenChange,
  profile,
  isAuthenticated,
  onConnect,
  onChat,
  onRate,
}: ProfileViewModalProps) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (open && profile && isAuthenticated) {
      fetchReviews();
    }
  }, [open, profile, isAuthenticated]);

  const fetchReviews = async () => {
    if (!profile?.id) {
      console.log('No profile ID, skipping review fetch');
      return;
    }
    
    console.log('Fetching reviews for profile:', profile.id);
    setLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          rater:profiles!ratings_rater_user_id_fkey(id, full_name, profile_image)
        `)
        .eq('rated_user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('Reviews query result:', { data, error });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews: ' + error.message);
      } else if (data) {
        console.log('Reviews fetched successfully:', data.length, 'reviews');
        setReviews(data);
        setTotalReviews(data.length);
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAverageRating(avg);
          console.log('Average rating:', avg);
        }
      }
    } catch (error) {
      console.error('Exception fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!profile) return null;

  // Get phone number from either field name
  const phoneNumber = profile.phone_number || profile.phone;
  
  // Debug: Log profile data
  console.log('ProfileViewModal - Profile Data:', {
    phone_number: profile.phone_number,
    phone: profile.phone,
    resolved_phone: phoneNumber,
    city: profile.city,
    state: profile.state,
    bio: profile.bio,
    email: profile.email
  });

  // Unauthenticated view
  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">🔒 Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to view the complete profile of <span className="font-semibold">{profile.full_name}</span>
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                size="lg"
                onClick={() => navigate("/auth?mode=login")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Login to View Profile
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth?mode=signup")}
                className="w-full"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Authenticated view - Full profile
  const professionalProfile = profile.professional_profiles?.[0];
  const workerProfile = profile.worker_profiles?.[0];
  const profileData = professionalProfile || workerProfile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900" aria-describedby="profile-description">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Professional Profile</DialogTitle>
        </DialogHeader>
        <div id="profile-description" className="sr-only">
          Detailed profile information for {profile.full_name}, including contact details, experience, and reviews
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl border-2 border-blue-200 dark:border-blue-700">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.full_name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl border-4 border-white dark:border-gray-800 shadow-xl">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.full_name}</h3>
              
              {/* 5-Star Rating Display - Directly Below Name */}
              {totalReviews > 0 && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
                </div>
              )}
              
              <Badge className="mb-3 text-sm font-semibold bg-blue-600 text-white">{profile.user_type.replace('_', ' ').toUpperCase()}</Badge>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-sm mb-3">
                <div className="flex items-start gap-1 text-gray-700 dark:text-gray-300 font-medium">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <span className="line-clamp-2" title={formatAddress(profile)}>
                    {formatAddress(profile)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Address Section */}
          {(profile.house_number || profile.plot_number || profile.street || profile.area || profile.village || profile.mandal || profile.district) && (
            <div className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="h-5 w-5 text-blue-600" />
                Complete Address
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {profile.house_number && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">House No:</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.house_number}</p>
                  </div>
                )}
                {profile.plot_number && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Plot No:</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.plot_number}</p>
                  </div>
                )}
                {profile.street && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Street:</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.street}</p>
                  </div>
                )}
                {profile.area && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Area:</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.area}</p>
                  </div>
                )}
                {profile.village && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Village:</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.village}</p>
                  </div>
                )}
                {profile.mandal && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Mandal:</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.mandal}</p>
                  </div>
                )}
                {profile.district && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">District:</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.district}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">City:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.city}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">State:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.state}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bio/Description */}
          {profile.bio && (
            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                <Briefcase className="h-5 w-5 text-blue-600" />
                About
              </h4>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Professional Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {phoneNumber && (
              <div className="p-5 border-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-green-300 dark:border-green-700 shadow-md">
                <p className="text-sm font-bold mb-2 flex items-center gap-2 text-green-800 dark:text-green-300">
                  <Phone className="h-5 w-5" />
                  Phone Number
                </p>
                <p className="text-xl font-bold text-green-900 dark:text-green-200">{phoneNumber}</p>
              </div>
            )}
            {profileData?.experience_years && (
              <div className="p-5 border-2 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                <p className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Experience</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{profileData.experience_years} Years</p>
              </div>
            )}
            {profileData?.total_projects > 0 && (
              <div className="p-5 border-2 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                <p className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Projects Completed</p>
                <p className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <Award className="h-5 w-5 text-blue-600" />
                  {profileData.total_projects}
                </p>
              </div>
            )}
            {profileData?.price_per_sqft && (
              <div className="p-5 border-2 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-blue-300 dark:border-blue-700 shadow-md">
                <p className="text-sm font-bold mb-2 text-blue-800 dark:text-blue-300">Price per Sq Ft</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-200">₹{profileData.price_per_sqft}</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="p-5 bg-blue-100 dark:bg-blue-900 rounded-xl border-2 border-blue-200 dark:border-blue-700">
            <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Contact Information</h4>
            <div className="space-y-3 text-base">
              {phoneNumber && (
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">Phone:</span>
                  <span className="font-bold text-gray-900 dark:text-white break-all">{phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">Email:</span>
                <span className="font-bold text-gray-900 dark:text-white break-all">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">Location:</span>
                <span className="font-bold text-gray-900 dark:text-white">{profile.city}, {profile.state}</span>
              </div>
            </div>
          </div>

          {/* Ratings and Reviews Section - Always show if authenticated */}
          {isAuthenticated && (
            <div className="p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-800" role="region" aria-label="Reviews section">
              <h4 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                Ratings & Reviews ({totalReviews})
              </h4>
              {reviews.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" tabIndex={0} role="list" aria-label="List of reviews">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm" role="listitem">
                      <div className="flex items-start gap-3">
                        {/* Reviewer Profile */}
                        <div className="flex-shrink-0">
                          {review.rater?.profile_image ? (
                            <img
                              src={review.rater.profile_image}
                              alt={review.rater.full_name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {review.rater?.full_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        
                        {/* Review Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h5 className="font-bold text-base text-gray-900 dark:text-white">{review.rater?.full_name || 'Anonymous User'}</h5>
                            <div className="flex items-center gap-1" role="img" aria-label={`${review.rating} out of 5 stars`}>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                              <span className="ml-2 font-bold text-gray-900 dark:text-white">{review.rating}.0</span>
                            </div>
                          </div>
                          {review.review && (
                            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{review.review}</p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            📅 {new Date(review.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No reviews yet</p>
                  <p className="text-sm mt-1">Be the first to rate this professional!</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Sticky Bottom Bar */}
          <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 pt-4 pb-2 -mx-6 px-6 flex flex-col sm:flex-row gap-3 shadow-lg" role="group" aria-label="Profile actions">
            {onChat && (
              <Button 
                onClick={onChat}
                className="flex-1 min-h-[56px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                size="lg"
                aria-label="Start chat conversation"
              >
                💬 Chat Now
              </Button>
            )}
            {onRate && (
              <Button 
                onClick={onRate}
                className="flex-1 min-h-[56px] bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-0"
                size="lg"
                aria-label="Rate this professional"
              >
                <Star className="h-5 w-5 mr-2 fill-white" aria-hidden="true" />
                Rate Professional
              </Button>
            )}
            {onConnect && (
              <Button 
                onClick={onConnect}
                className="flex-1 min-h-[56px] bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-0"
                size="lg"
                aria-label="Send connection request"
              >
                🤝 Connect
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
