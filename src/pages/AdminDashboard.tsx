import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  LogOut, 
  Users, 
  Mail,
  Edit,
  Trash2,
  Search,
  Home,
  Star,
  DollarSign,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileEditDialog } from "@/components/admin/ProfileEditDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<any>(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [viewImageOpen, setViewImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/admin/login");
      return;
    }

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || profileData?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      navigate("/admin/login");
      return;
    }

    setProfile(profileData);
    await fetchDashboardData();
    setLoading(false);
  };

  const fetchDashboardData = async () => {
    // Fetch users with professional/worker profiles
    const { data: allUsers } = await supabase
      .from("profiles")
      .select(`
        *,
        professional_profiles(*),
        worker_profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (allUsers) {
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    }

    // Fetch contact messages
    const { data: messages } = await supabase
      .from("contact_messages")
      .select("*")
      .order('created_at', { ascending: false });

    if (messages) {
      setContactMessages(messages);
    }
  };

  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });

      await fetchDashboardData();
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: 'read' })
      .eq("id", messageId);

    if (!error) {
      await fetchDashboardData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const unreadMessages = contactMessages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Admin Portal</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{contactMessages.length}</div>
              {unreadMessages > 0 && (
                <p className="text-sm text-orange-500 mt-1">{unreadMessages} unread</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Professionals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(u => ['architect', 'engineer', 'contractor', 'builder', 'worker'].includes(u.user_type)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="h-4 w-4 mr-2" />
              Contact Messages
              {unreadMessages > 0 && (
                <Badge variant="destructive" className="ml-2">{unreadMessages}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Profiles</CardTitle>
                    <CardDescription>Manage all registered users</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedProfile(user);
                          setViewProfileOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {user.profile_image ? (
                            <img
                              src={user.profile_image}
                              alt={user.full_name}
                              className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(user.profile_image);
                                setViewImageOpen(true);
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold">{user.full_name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <Badge variant="outline">{user.user_type.replace('_', ' ')}</Badge>
                              {user.professional_profiles?.[0] && (
                                <>
                                  {user.professional_profiles[0].rating > 0 && (
                                    <span className="text-xs flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {user.professional_profiles[0].rating.toFixed(1)}
                                    </span>
                                  )}
                                  {user.professional_profiles[0].price_per_sqft && (
                                    <span className="text-xs flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      ₹{user.professional_profiles[0].price_per_sqft}/sqft
                                    </span>
                                  )}
                                  {user.professional_profiles[0].total_projects > 0 && (
                                    <span className="text-xs flex items-center gap-1">
                                      <Briefcase className="h-3 w-3" />
                                      {user.professional_profiles[0].total_projects} projects
                                    </span>
                                  )}
                                </>
                              )}
                              {user.worker_profiles?.[0] && (
                                <>
                                  {user.worker_profiles[0].rating > 0 && (
                                    <span className="text-xs flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {user.worker_profiles[0].rating.toFixed(1)}
                                    </span>
                                  )}
                                  {user.worker_profiles[0].price_per_sqft && (
                                    <span className="text-xs flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      ₹{user.worker_profiles[0].price_per_sqft}/sqft
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProfile(user);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileToDelete(user);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>Messages from users via contact form</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {contactMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border rounded-lg ${
                          message.status === 'unread' ? 'bg-primary/5 border-primary/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{message.name}</p>
                            <p className="text-sm text-muted-foreground">{message.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {message.status === 'unread' && (
                              <Badge variant="destructive">New</Badge>
                            )}
                            {message.status === 'unread' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markMessageAsRead(message.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="font-medium mb-2">{message.subject}</p>
                        <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    {contactMessages.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No contact messages yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      {selectedProfile && (
        <ProfileEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          profile={selectedProfile}
          onSuccess={fetchDashboardData}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {profileToDelete?.full_name}'s profile.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfile} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Profile Dialog */}
      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Profile Details</DialogTitle>
            <DialogDescription>Complete information about this user</DialogDescription>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                {selectedProfile.profile_image ? (
                  <img
                    src={selectedProfile.profile_image}
                    alt={selectedProfile.full_name}
                    className="w-20 h-20 rounded-full object-cover cursor-pointer hover:ring-4 hover:ring-primary transition-all"
                    onClick={() => {
                      setSelectedImage(selectedProfile.profile_image);
                      setViewImageOpen(true);
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl">
                    {selectedProfile.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{selectedProfile.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProfile.email}</p>
                  <Badge className="mt-1">{selectedProfile.user_type.replace('_', ' ')}</Badge>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Phone Number</h4>
                  <p className="text-base">{selectedProfile.phone_number || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Location</h4>
                  <p className="text-base">{selectedProfile.city}, {selectedProfile.state}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">User ID</h4>
                  <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">{selectedProfile.id}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Joined Date</h4>
                  <p className="text-base">{new Date(selectedProfile.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Bio */}
              {selectedProfile.bio && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Bio</h4>
                  <p className="text-base bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{selectedProfile.bio}</p>
                </div>
              )}

              {/* Professional Profile */}
              {selectedProfile.professional_profiles?.[0] && (
                <div className="space-y-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-bold text-lg">Professional Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProfile.professional_profiles[0].experience_years && (
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-semibold">{selectedProfile.professional_profiles[0].experience_years} years</p>
                      </div>
                    )}
                    {selectedProfile.professional_profiles[0].price_per_sqft && (
                      <div>
                        <p className="text-sm text-muted-foreground">Price per sq ft</p>
                        <p className="font-semibold">₹{selectedProfile.professional_profiles[0].price_per_sqft}</p>
                      </div>
                    )}
                    {selectedProfile.professional_profiles[0].total_projects > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Total Projects</p>
                        <p className="font-semibold">{selectedProfile.professional_profiles[0].total_projects}</p>
                      </div>
                    )}
                    {selectedProfile.professional_profiles[0].rating > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {selectedProfile.professional_profiles[0].rating.toFixed(1)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Worker Profile */}
              {selectedProfile.worker_profiles?.[0] && (
                <div className="space-y-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-bold text-lg">Worker Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProfile.worker_profiles[0].experience_years && (
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-semibold">{selectedProfile.worker_profiles[0].experience_years} years</p>
                      </div>
                    )}
                    {selectedProfile.worker_profiles[0].price_per_sqft && (
                      <div>
                        <p className="text-sm text-muted-foreground">Price per sq ft</p>
                        <p className="font-semibold">₹{selectedProfile.worker_profiles[0].price_per_sqft}</p>
                      </div>
                    )}
                    {selectedProfile.worker_profiles[0].total_projects > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Total Projects</p>
                        <p className="font-semibold">{selectedProfile.worker_profiles[0].total_projects}</p>
                      </div>
                    )}
                    {selectedProfile.worker_profiles[0].rating > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {selectedProfile.worker_profiles[0].rating.toFixed(1)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setViewProfileOpen(false);
                    setEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewProfileOpen(false);
                    setProfileToDelete(selectedProfile);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={viewImageOpen} onOpenChange={setViewImageOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Profile"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setViewImageOpen(false)}
            >
              ✕
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
