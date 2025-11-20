import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PasswordInput } from "@/components/PasswordInput";
import { validatePassword } from "@/lib/passwordValidation";

interface PasswordChangeFormProps {
  userEmail: string;
}

export const PasswordChangeForm = ({ userEmail }: PasswordChangeFormProps) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [currentPasswordVerified, setCurrentPasswordVerified] = useState(false);
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleVerifyCurrentPassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    setVerifyingPassword(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: passwordData.currentPassword,
      });

      if (error) {
        toast.error("Current password is incorrect");
        setCurrentPasswordVerified(false);
      } else {
        toast.success("Current password verified!");
        setCurrentPasswordVerified(true);
      }
    } catch (error: any) {
      toast.error("Failed to verify password");
      setCurrentPasswordVerified(false);
    } finally {
      setVerifyingPassword(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPasswordVerified) {
      toast.error("Please verify your current password first");
      return;
    }

    const validation = validatePassword(passwordData.newPassword);
    if (!validation.isValid) {
      toast.error("Password does not meet requirements", {
        description: validation.errors[0],
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast.success("Password changed successfully!");
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setCurrentPasswordVerified(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-3">
              <Label htmlFor="currentPassword" className="text-base font-bold">
                Current Password <span className="text-red-600">*</span>
              </Label>
              <div className="flex gap-3">
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                    setCurrentPasswordVerified(false);
                  }}
                  disabled={currentPasswordVerified}
                  className="h-12"
                  placeholder="Enter your current password"
                />
                {!currentPasswordVerified && (
                  <Button
                    type="button"
                    onClick={handleVerifyCurrentPassword}
                    disabled={!passwordData.currentPassword || verifyingPassword}
                    className="h-12 px-6"
                  >
                    {verifyingPassword ? "Verifying..." : "Verify"}
                  </Button>
                )}
                {currentPasswordVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-6 border-green-500 text-green-600"
                    disabled
                  >
                    ✓ Verified
                  </Button>
                )}
              </div>
              {!currentPasswordVerified && (
                <p className="text-sm text-muted-foreground">
                  Please verify your current password before setting a new one
                </p>
              )}
            </div>

            {/* New Password Fields */}
            {currentPasswordVerified && (
              <>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    ✓ Current password verified! You can now set a new password.
                  </p>
                </div>

                <PasswordInput
                  id="newPassword"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(value) => setPasswordData({ ...passwordData, newPassword: value })}
                  placeholder="Enter your new password"
                  showValidation={true}
                  required={true}
                />

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-base font-bold">
                    Confirm New Password <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="h-12"
                    placeholder="Confirm your new password"
                    minLength={6}
                  />
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-sm text-red-600 font-medium">Passwords do not match</p>
                  )}
                  {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                    <p className="text-sm text-green-600 font-medium">✓ Passwords match</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      changingPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                    className="h-12 px-8"
                  >
                    {changingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setCurrentPasswordVerified(false);
                    }}
                    className="h-12 px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Password Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Use at least 8 characters with a mix of letters, numbers, and symbols</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Avoid using personal information like your name or birthdate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Don't reuse passwords from other accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Change your password regularly to maintain security</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
