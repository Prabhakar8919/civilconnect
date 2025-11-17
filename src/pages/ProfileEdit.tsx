import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, User, MapPin, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import Navigation from "@/components/Navigation";
import { AddressInputSection } from "@/components/AddressInputSection";
import { AddressFields } from "@/lib/addressUtils";

const ProfileEdit = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    house_number: "",
    plot_number: "",
    street: "",
    area: "",
    village: "",
    mandal: "",
    district: "",
    city: "",
    state: "",
    bio: "",
    profile_image: "",
    experience_years: "",
    total_projects: "",
    cost_per_sqft: "",
  });
  const [landListing, setLandListing] = useState({
    title: "",
    description: "",
    house_number: "",
    plot_number: "",
    street: "",
    area: "",
    village: "",
    mandal: "",
    district: "",
    city: "",
    state: "",
    area_sqft: "",
    price: "",
    images: [] as string[],
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        house_number: profileData.house_number || "",
        plot_number: profileData.plot_number || "",
        street: profileData.street || "",
        area: profileData.area || "",
        village: profileData.village || "",
        mandal: profileData.mandal || "",
        district: profileData.district || "",
        city: profileData.city || "",
        state: profileData.state || "",
        bio: profileData.bio || "",
        profile_image: profileData.profile_image || "",
        experience_years: profileData.experience_years || "",
        total_projects: profileData.total_projects || "",
        cost_per_sqft: profileData.cost_per_sqft || "",
      });
    }

    setLoading(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Build update object with only defined fields
      const updateData: any = {
        full_name: profile.full_name,
        city: profile.city,
        state: profile.state,
        bio: profile.bio,
        profile_image: profile.profile_image,
      };

      // Add optional fields only if they have values
      if (profile.phone) {
        updateData.phone = profile.phone;
      }
      if (profile.house_number) {
        updateData.house_number = profile.house_number;
      }
      if (profile.plot_number) {
        updateData.plot_number = profile.plot_number;
      }
      if (profile.street) {
        updateData.street = profile.street;
      }
      if (profile.area) {
        updateData.area = profile.area;
      }
      if (profile.village) {
        updateData.village = profile.village;
      }
      if (profile.mandal) {
        updateData.mandal = profile.mandal;
      }
      if (profile.district) {
        updateData.district = profile.district;
      }
      if (profile.experience_years) {
        updateData.experience_years = parseInt(profile.experience_years);
      }
      if (profile.total_projects) {
        updateData.total_projects = parseInt(profile.total_projects);
      }
      if (profile.cost_per_sqft) {
        updateData.cost_per_sqft = parseFloat(profile.cost_per_sqft);
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLandListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const pricePerSqft = parseFloat(landListing.price) / parseFloat(landListing.area_sqft);

      const { error } = await supabase
        .from("land_listings")
        .insert({
          owner_id: user.id,
          title: landListing.title,
          description: landListing.description,
          house_number: landListing.house_number || null,
          plot_number: landListing.plot_number || null,
          street: landListing.street || null,
          area: landListing.area || null,
          village: landListing.village || null,
          mandal: landListing.mandal || null,
          district: landListing.district || null,
          city: landListing.city,
          state: landListing.state,
          area_sqft: parseInt(landListing.area_sqft),
          price: parseFloat(landListing.price),
          price_per_sqft: pricePerSqft,
          cover_image: landListing.images[0] || null,
          images: landListing.images,
          status: "active",
        });

      if (error) throw error;

      toast.success("Land listing created successfully!");
      
      // Reset form
      setLandListing({
        title: "",
        description: "",
        house_number: "",
        plot_number: "",
        street: "",
        area: "",
        village: "",
        mandal: "",
        district: "",
        city: "",
        state: "",
        area_sqft: "",
        price: "",
        images: [],
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create land listing");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="mb-6 h-11 px-6 font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Edit Profile
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Manage your account settings and information
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
              <TabsTrigger value="profile" className="h-full text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="h-5 w-5 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="land" className="h-full text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                Land Listings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Picture Section */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Profile Picture
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      Upload a professional photo to help others recognize you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Current Profile Image Preview */}
                      <div className="flex flex-col items-center gap-3">
                        <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-lg">
                          <AvatarImage src={profile.profile_image} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-4xl font-bold">
                            {getInitials(profile.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">Current Photo</p>
                      </div>

                      {/* Upload Section */}
                      <div className="flex-1 w-full">
                        <Label className="text-lg font-bold mb-4 block text-slate-900 dark:text-slate-50">
                          Upload Profile Picture
                        </Label>
                        <ImageUpload
                          bucket="profile-images"
                          userId={user.id}
                          currentImage={profile.profile_image}
                          onUploadComplete={(url) => setProfile({ ...profile, profile_image: url })}
                          label=""
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 font-medium">
                          Accepted formats: PNG, JPG • Maximum size: 5MB
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information Section */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      Your basic details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="full_name" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Full Name <span className="text-red-600 dark:text-red-400">*</span>
                        </Label>
                        <Input
                          id="full_name"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          required
                          className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Email Address <span className="text-red-600 dark:text-red-400">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="h-12 text-base border-2 bg-slate-100 dark:bg-slate-800 cursor-not-allowed text-slate-600 dark:text-slate-400"
                        />
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Email cannot be changed</p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="bio" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          About You
                        </Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          placeholder="Tell us about yourself, your experience, and what you do..."
                          rows={5}
                          className="text-base resize-none border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {profile.bio.length}/500 characters
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information Section */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Location Information
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      Provide your complete address details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AddressInputSection
                      address={profile}
                      onChange={(field, value) => setProfile({ ...profile, [field]: value })}
                      required={true}
                      idPrefix="profile_"
                    />
                  </CardContent>
                </Card>

                {/* Professional Information Section */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Professional Information
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      Share your experience and pricing details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="experience_years" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Years of Experience
                        </Label>
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          value={profile.experience_years}
                          onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
                          placeholder="e.g., 5"
                          className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          How many years have you been working?
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="total_projects" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Total Projects Completed
                        </Label>
                        <Input
                          id="total_projects"
                          type="number"
                          min="0"
                          value={profile.total_projects}
                          onChange={(e) => setProfile({ ...profile, total_projects: e.target.value })}
                          placeholder="e.g., 25"
                          className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Number of projects you've completed
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="cost_per_sqft" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Rate per Sq Ft (₹)
                        </Label>
                        <Input
                          id="cost_per_sqft"
                          type="number"
                          min="0"
                          step="0.01"
                          value={profile.cost_per_sqft}
                          onChange={(e) => setProfile({ ...profile, cost_per_sqft: e.target.value })}
                          placeholder="e.g., 1500"
                          className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Your service rate per square foot
                        </p>
                      </div>
                    </div>

                    {/* Preview of professional info */}
                    {(profile.experience_years || profile.total_projects || profile.cost_per_sqft) && (
                      <div className="mt-6 p-5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                          This information will be displayed on your profile card:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {profile.experience_years && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-primary/30">
                              <span className="text-sm font-medium">💼 {profile.experience_years}+ years experience</span>
                            </div>
                          )}
                          {profile.total_projects && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-accent/30">
                              <span className="text-sm font-medium">🏆 {profile.total_projects}+ projects</span>
                            </div>
                          )}
                          {profile.cost_per_sqft && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-primary/30">
                              <span className="text-sm font-medium">💰 ₹{profile.cost_per_sqft}/sq ft</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="h-14 px-10 text-base font-semibold border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-14 px-10 text-base font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Land Listings Tab */}
            <TabsContent value="land">
              <form onSubmit={handleLandListingSubmit} className="space-y-6">
                {/* Property Photos Section */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Property Photos
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      Upload high-quality images of your property (First image will be the cover photo)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <MultiImageUpload
                        bucket="land-images"
                        userId={user.id}
                        currentImages={landListing.images}
                        onUploadComplete={(urls) => setLandListing({ ...landListing, images: urls })}
                        maxImages={5}
                        label=""
                      />
                      <p className="text-sm text-muted-foreground">
                        Upload up to 5 photos • Accepted formats: PNG, JPG • Maximum size: 5MB each
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Details Section */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Property Details
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      Provide detailed information about your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="title" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Property Title <span className="text-red-600 dark:text-red-400">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={landListing.title}
                          onChange={(e) => setLandListing({ ...landListing, title: e.target.value })}
                          placeholder="e.g., Residential Plot in Prime Location"
                          required
                          className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Give your property a catchy and descriptive title
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="description" className="text-base font-bold text-slate-900 dark:text-slate-50">
                          Property Description <span className="text-red-600 dark:text-red-400">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={landListing.description}
                          onChange={(e) => setLandListing({ ...landListing, description: e.target.value })}
                          placeholder="Describe your property features, amenities, nearby facilities, road access, water availability, electricity connection, etc..."
                          rows={6}
                          required
                          className="text-base resize-none border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Include details about features, amenities, nearby facilities, and any special characteristics
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Section */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Property Location
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      Provide complete address details for your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AddressInputSection
                      address={landListing}
                      onChange={(field, value) => setLandListing({ ...landListing, [field]: value })}
                      required={true}
                      idPrefix="land_"
                    />
                  </CardContent>
                </Card>

                {/* Pricing Information Section */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="space-y-3 pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Pricing Information
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                      Set the area and price for your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="area_sqft" className="text-base font-bold text-slate-900 dark:text-slate-50">
                            Property Area (Square Feet) <span className="text-red-600 dark:text-red-400">*</span>
                          </Label>
                          <Input
                            id="area_sqft"
                            type="number"
                            min="1"
                            value={landListing.area_sqft}
                            onChange={(e) => setLandListing({ ...landListing, area_sqft: e.target.value })}
                            placeholder="e.g., 5000"
                            required
                            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                          />
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enter the total area of your property in square feet
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="price" className="text-base font-bold text-slate-900 dark:text-slate-50">
                            Total Asking Price (₹) <span className="text-red-600 dark:text-red-400">*</span>
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            min="1"
                            value={landListing.price}
                            onChange={(e) => setLandListing({ ...landListing, price: e.target.value })}
                            placeholder="e.g., 5000000"
                            required
                            className="h-12 text-base border-2 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                          />
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enter your expected selling price in Indian Rupees (₹)
                          </p>
                        </div>
                      </div>

                      {landListing.area_sqft && landListing.price && (
                        <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-2 border-primary/30 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                💰 Calculated Price per Square Foot:
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                This will be displayed to potential buyers
                              </p>
                            </div>
                            <div className="text-3xl font-bold text-primary">
                              ₹{(parseFloat(landListing.price) / parseFloat(landListing.area_sqft)).toFixed(2)}/sq ft
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setLandListing({
                        title: "",
                        description: "",
                        city: "",
                        state: "",
                        area_sqft: "",
                        price: "",
                        images: [],
                      });
                    }}
                    className="h-14 px-10 text-base font-semibold border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-14 px-10 text-base font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <Building2 className="h-5 w-5 mr-2" />
                        Create Land Listing
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
