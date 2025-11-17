import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  onSuccess: () => void;
}

export const ProfileEditDialog = ({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: ProfileEditDialogProps) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    bio: "",
    user_type: "",
  });
  const [professionalData, setProfessionalData] = useState({
    specialization: "",
    experience_years: "",
    price_per_sqft: "",
    total_projects: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        city: profile.city || "",
        state: profile.state || "",
        bio: profile.bio || "",
        user_type: profile.user_type || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", profile.id);

      if (profileError) throw profileError;

      // Update professional/worker profile if applicable
      if (['architect', 'engineer', 'contractor', 'builder'].includes(formData.user_type)) {
        const { error: profError } = await supabase
          .from("professional_profiles")
          .update({
            specialization: professionalData.specialization || null,
            experience_years: professionalData.experience_years ? parseInt(professionalData.experience_years) : null,
            price_per_sqft: professionalData.price_per_sqft ? parseFloat(professionalData.price_per_sqft) : null,
            total_projects: professionalData.total_projects ? parseInt(professionalData.total_projects) : null,
          })
          .eq("profile_id", profile.id);

        if (profError && profError.code !== 'PGRST116') throw profError;
      } else if (formData.user_type === 'worker') {
        const { error: workerError } = await supabase
          .from("worker_profiles")
          .update({
            experience_years: professionalData.experience_years ? parseInt(professionalData.experience_years) : null,
            price_per_sqft: professionalData.price_per_sqft ? parseFloat(professionalData.price_per_sqft) : null,
            total_projects: professionalData.total_projects ? parseInt(professionalData.total_projects) : null,
          })
          .eq("profile_id", profile.id);

        if (workerError && workerError.code !== 'PGRST116') throw workerError;
      }

      toast.success("Profile updated successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update user profile information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>User Type</Label>
              <Select value={formData.user_type} onValueChange={(value) => setFormData({ ...formData, user_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="land_owner">Land Owner</SelectItem>
                  <SelectItem value="architect">Architect</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="builder">Builder</SelectItem>
                  <SelectItem value="worker">Civil Worker</SelectItem>
                  <SelectItem value="material_seller">Material Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
            />
          </div>

          {/* Professional Fields */}
          {['architect', 'engineer', 'contractor', 'builder', 'worker'].includes(formData.user_type) && (
            <>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Professional Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Experience (years)</Label>
                    <Input
                      type="number"
                      value={professionalData.experience_years}
                      onChange={(e) => setProfessionalData({ ...professionalData, experience_years: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price per Sq Ft</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={professionalData.price_per_sqft}
                      onChange={(e) => setProfessionalData({ ...professionalData, price_per_sqft: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Total Projects</Label>
                    <Input
                      type="number"
                      value={professionalData.total_projects}
                      onChange={(e) => setProfessionalData({ ...professionalData, total_projects: e.target.value })}
                    />
                  </div>
                  {formData.user_type !== 'worker' && (
                    <div className="space-y-2">
                      <Label>Specialization</Label>
                      <Input
                        value={professionalData.specialization}
                        onChange={(e) => setProfessionalData({ ...professionalData, specialization: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
