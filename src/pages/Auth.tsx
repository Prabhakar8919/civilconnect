import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Lock, User, Sparkles, CheckCircle2, Shield, Users, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import { PasswordInput } from "@/components/PasswordInput";
import { validatePassword } from "@/lib/passwordValidation";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [userType, setUserType] = useState("");
  const [profession, setProfession] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [costPerSqft, setCostPerSqft] = useState("");
  const [totalProjects, setTotalProjects] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Update form state when URL parameter changes
    if (mode === 'signup') {
      setIsLogin(false);
    } else if (mode === 'login') {
      setIsLogin(true);
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Validate password for login too
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          toast({
            title: "Invalid Password Format",
            description: "Please check your password and try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (!data.session) {
          throw new Error("Login failed. Multi-factor authentication might be required.");
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        navigate("/dashboard");
      } else {
        if (!userType) {
          toast({
            title: "Error",
            description: "Please select a user type",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          toast({
            title: "Password does not meet requirements",
            description: passwordValidation.errors[0],
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const redirectUrl = `${window.location.origin}/`;
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              user_type: userType,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Use upsert to avoid duplicate key errors
          const profileData: any = {
            id: authData.user.id,
            full_name: fullName,
            email: email,
            phone: phoneNumber || null,
            city: city || null,
            state: state || null,
            user_type: userType as Profile['user_type'],
            profession: userType === 'worker' ? profession : null,
          };

          // Add bio for all non-land-owner users
          if (userType !== 'land_owner' && bio) {
            profileData.bio = bio;
          }

          // Add professional fields for all except land owners and buyers
          if (!['land_owner', 'buyer'].includes(userType)) {
            if (experienceYears) profileData.experience_years = parseInt(experienceYears);
            if (totalProjects) profileData.total_projects = parseInt(totalProjects);
          }

          // Add cost/pricing for professionals
          if (['engineer', 'architect', 'contractor', 'builder', 'worker'].includes(userType)) {
            if (costPerSqft) profileData.cost_per_sqft = parseFloat(costPerSqft);
          }

          // Add specialization for professionals
          if (['engineer', 'architect', 'contractor', 'builder'].includes(userType)) {
            if (specialization) profileData.specialization = specialization;
          }

          // Add skills for workers
          if (userType === 'worker' && skills) {
            profileData.skills = skills;
          }

          const { error: profileError } = await supabase.from("profiles").upsert([profileData], {
            onConflict: 'id'
          });

          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Don't throw error, just log it - user is created
          }
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account before logging in.",
        });
        
        // Switch to login mode after successful signup
        setIsLogin(true);
        setPassword("");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: CheckCircle2, text: "Connect with 5000+ verified professionals" },
    { icon: Shield, text: "Secure and trusted platform" },
    { icon: Users, text: "Build your dream project with experts" },
    { icon: Sparkles, text: "AI-powered recommendations" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center justify-center mb-6 group">
              <div className="p-3 rounded-xl transition-all shadow-card border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent group-hover:from-primary/20">
                <img src="/logo.png" alt="CivilConnect" className="h-10 w-auto object-contain" style={{ filter: 'none' }} />
              </div>
            </Link>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to CivilConnect
            </h1>
            <p className="text-foreground/60">
              {isLogin ? "Sign in to continue building" : "Start your construction journey"}
            </p>
          </div>

          <Card className="border-border/50 shadow-card-hover backdrop-blur-sm bg-card/50 animate-scale-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? "Login" : "Create Account"}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Fill in your details to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2 animate-slide-up">
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                        className="border-border/50 focus:border-primary transition-all focus:shadow-lg focus:shadow-primary/20"
                      />
                    </div>

                    <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                      <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border-border/50 focus:border-primary transition-all focus:shadow-lg focus:shadow-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '0.06s' }}>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          City
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="e.g., Mumbai"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="border-border/50 focus:border-primary transition-all focus:shadow-lg focus:shadow-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          State
                        </Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="e.g., Maharashtra"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="border-border/50 focus:border-primary transition-all focus:shadow-lg focus:shadow-primary/20"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border/50 focus:border-primary transition-all focus:shadow-lg focus:shadow-primary/20"
                  />
                </div>

                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  {isLogin && (
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Password
                      </Label>
                      <Link
                        to="/password-reset"
                        className="text-xs text-primary hover:underline transition-all"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                  {isLogin ? (
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-border/50 focus:border-primary transition-all focus:shadow-lg focus:shadow-primary/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <PasswordInput
                      id="password"
                      label="Password"
                      value={password}
                      onChange={setPassword}
                      placeholder="Create a strong password"
                      showValidation={true}
                      required={true}
                    />
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <Label htmlFor="userType" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      I am a...
                    </Label>
                    <Select value={userType} onValueChange={setUserType} required={!isLogin}>
                      <SelectTrigger className="border-border/50 focus:border-primary transition-all focus:shadow-lg focus:shadow-primary/20">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="architect">Architect</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="builder">Builder</SelectItem>
                        <SelectItem value="worker">Civil Worker</SelectItem>
                        <SelectItem value="material_seller">Material Seller</SelectItem>
                        <SelectItem value="land_owner">Land Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Profession Field - Only for Civil Workers */}
                {!isLogin && userType === 'worker' && (
                  <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.35s' }}>
                    <Label htmlFor="profession" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Profession
                    </Label>
                    <Select value={profession} onValueChange={setProfession} required>
                      <SelectTrigger className="border-border/50 focus:border-primary transition-all focus:shadow-lg focus:shadow-primary/20">
                        <SelectValue placeholder="Select your profession" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumber">Plumber</SelectItem>
                        <SelectItem value="mason">Mason</SelectItem>
                        <SelectItem value="electrician">Electrician</SelectItem>
                        <SelectItem value="painter">Painter</SelectItem>
                        <SelectItem value="marble_worker">Marble Worker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Brief Description - For all except land owners and buyers */}
                {!isLogin && userType && !['land_owner', 'buyer'].includes(userType) && (
                  <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <Label htmlFor="bio">Brief Description</Label>
                    <Textarea
                      id="bio"
                      placeholder={
                        userType === 'material_seller' 
                          ? "Describe your business and the materials you supply..."
                          : "Tell us about yourself and your expertise..."
                      }
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="border-border/50 focus:border-primary transition-all resize-none"
                    />
                  </div>
                )}

                {/* Professional Fields - Show for all except land owners, buyers, and material sellers */}
                {!isLogin && userType && !['land_owner', 'buyer', 'material_seller'].includes(userType) && (
                  <>
                    {/* Experience and Projects */}
                    <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                      <div className="space-y-2">
                        <Label htmlFor="experienceYears">Years of Experience *</Label>
                        <Input
                          id="experienceYears"
                          type="number"
                          placeholder="e.g., 5"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          required
                          className="border-border/50 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalProjects">Projects Completed *</Label>
                        <Input
                          id="totalProjects"
                          type="number"
                          placeholder="e.g., 10"
                          value={totalProjects}
                          onChange={(e) => setTotalProjects(e.target.value)}
                          required
                          className="border-border/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Specialization for Professionals */}
                    {['engineer', 'architect', 'contractor', 'builder'].includes(userType) && (
                      <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          type="text"
                          placeholder="e.g., Structural Design, Interior Design"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="border-border/50 focus:border-primary transition-all"
                        />
                      </div>
                    )}

                    {/* Skills for Workers */}
                    {userType === 'worker' && (
                      <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input
                          id="skills"
                          type="text"
                          placeholder="e.g., Masonry, Plumbing, Electrical"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="border-border/50 focus:border-primary transition-all"
                        />
                      </div>
                    )}

                    {/* Cost/Rate */}
                    <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                      <Label htmlFor="costPerSqft">
                        {userType === 'worker' ? 'Daily Rate (₹)' : 'Cost per Sq Ft (₹)'}
                      </Label>
                      <Input
                        id="costPerSqft"
                        type="number"
                        step="0.01"
                        placeholder={userType === 'worker' ? 'e.g., 500' : 'e.g., 50'}
                        value={costPerSqft}
                        onChange={(e) => setCostPerSqft(e.target.value)}
                        className="border-border/50 focus:border-primary transition-all"
                      />
                    </div>
                  </>
                )}



                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.02] animate-slide-up"
                  disabled={loading}
                  style={{ animationDelay: '0.4s' }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  )}
                </Button>

                <div className="text-center pt-4 space-y-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-primary hover:underline transition-all hover:text-primary/80 block w-full"
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Login"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-accent/10 to-background relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:32px_32px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 max-w-lg mx-auto">
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Build Your Dream Project
              </h2>
              <p className="text-lg text-foreground/70">
                Join thousands of professionals and clients who trust CivilConnect for their construction needs.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all hover:shadow-card animate-slide-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <p className="text-foreground/80 pt-1">{benefit.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-border/30">
              <div className="flex items-center justify-between text-sm text-foreground/60">
                <span>Trusted by 5000+ professionals</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse-glow" />
                  4.9/5 Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Auth;
