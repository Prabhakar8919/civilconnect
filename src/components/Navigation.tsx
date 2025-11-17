import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SearchModal } from "@/components/SearchModal";
import NotificationBell from "@/components/NotificationBell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const primaryLinks = [
    { name: t('home'), path: "/" },
    { name: t('landRecords'), path: "/land-records" },
    { name: t('engineers'), path: "/engineers" },
    { name: t('architects'), path: "/architects" },
    { name: t('civilWorkers'), path: "/civil-workers" },
    { name: t('contractorsBuilders'), path: "/contractors-builders" },
  ];

  const otherLinks = [
    { name: t('materialSellers'), path: "/material-sellers" },
    { name: t('aiInsights'), path: "/ai-insights" },
    { name: t('contact'), path: "/contact" },
  ];

  const allLinks = [...primaryLinks, ...otherLinks];
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav className="bg-black/95 backdrop-blur-md border-b border-white/10 shadow-lg">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
            {/* Logo: translucent blue background (not solid) so white/colored logos remain visible */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="inline-flex items-center justify-center p-1 rounded-lg shadow-lg border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent transition-all">
                <img src="/logo.png" alt="CivilConnect Logo" className="h-10 w-auto object-contain" style={{ filter: 'none' }} />
              </div>
            </Link>

            {/* Primary Links - visible next to logo on desktop */}
            <div className="hidden md:flex items-center space-x-1 ml-4 flex-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md transition-all relative group"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions - Right Side */}
            <div className="flex items-center space-x-3 ml-auto">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hover:bg-accent/50 rounded-full"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notification Bell - Only for logged in users */}
              {user && <NotificationBell />}

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* User Actions */}
              <div className="hidden md:flex items-center space-x-2">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm" className="border-border hover:bg-accent/50 rounded-full px-5">
                        {t('dashboard')}
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleLogout} 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive rounded-full px-5"
                    >
                      {t('logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth?mode=login">
                      <Button variant="ghost" size="sm" className="hover:bg-accent/50 rounded-full px-5">
                        {t('login')}
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-lg shadow-primary/20">
                        {t('signup')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop: compact 'more' dropdown for remaining links */}
            <div className="relative hidden md:flex items-center ml-3">
              <button
                onClick={() => setMoreOpen((s) => !s)}
                aria-label="More links"
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-accent/50"
              >
                <Menu className="h-5 w-5" />
              </button>

              {moreOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {otherLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:bg-accent/50"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Appears below navbar */}
        {isOpen && (
          <div className="md:hidden bg-black/98 backdrop-blur-md border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-6 py-4 space-y-2">
              {allLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start hover:bg-accent/50 text-base">
                    {link.name}
                  </Button>
                </Link>
              ))}
              <div className="pt-4 space-y-2 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-accent/50 text-base"
                  onClick={() => {
                    setSearchOpen(true);
                    setIsOpen(false);
                  }}
                >
                  <Search className="h-5 w-5 mr-2" />
                  {t('search')}
                </Button>
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start hover:bg-accent/50 text-base">
                        {t('dashboard')}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-destructive/10 hover:text-destructive text-base"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      {t('logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth?mode=login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start text-base">
                        {t('login')}
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-base">{t('signup')}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;
