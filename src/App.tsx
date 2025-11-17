import { Session } from "@supabase/supabase-js";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BackgroundProvider } from "./context/BackgroundContext";
import { LanguageProvider } from "./context/LanguageContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LandRecords from "./pages/LandRecords";
import Engineers from "./pages/Engineers";
import CivilWorkers from "./pages/CivilWorkers";
import Architects from "./pages/Architects";
import ContractorsBuilders from "./pages/ContractorsBuilders";
import MaterialSellers from "./pages/MaterialSellers";
import AIInsights from "./pages/AIInsights";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProfileEdit from "./pages/ProfileEdit";
import Chat from "./pages/Chat";
import PasswordReset from "./pages/PasswordReset";
import { supabase } from "./integrations/supabase/client";
import { CivilConnectChatbot } from "./components/CivilConnectChatbot";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null; // Or a loading spinner for the whole app
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <BackgroundProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/dashboard" element={<Dashboard key={session?.user?.id} session={session} />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/chat/:connectionId" element={<Chat />} />
                <Route path="/land-records" element={<LandRecords />} />
                <Route path="/engineers" element={<Engineers />} />
                <Route path="/civil-workers" element={<CivilWorkers />} />
                <Route path="/architects" element={<Architects />} />
                <Route path="/contractors-builders" element={<ContractorsBuilders />} />
                <Route path="/material-sellers" element={<MaterialSellers />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* CivilConnect Chatbot - Available on all pages */}
                <CivilConnectChatbot />
              </ErrorBoundary>
            </BrowserRouter>
          </BackgroundProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
