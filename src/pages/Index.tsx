import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Hammer, Home, ShoppingBag, TrendingUp, CheckCircle2, Star, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: Users,
      title: t('engineers'),
      description: t('engineersDesc'),
      link: "/engineers",
    },
    {
      icon: Users,
      title: t('civilWorkers'),
      description: t('civilWorkersDesc'),
      link: "/civil-workers",
    },
    {
      icon: Building2,
      title: t('architects'),
      description: t('architectsDesc'),
      link: "/architects",
    },
    {
      icon: Hammer,
      title: t('contractorsBuilders'),
      description: t('contractorsBuildersDesc'),
      link: "/contractors-builders",
    },
    {
      icon: Home,
      title: t('landRecords'),
      description: t('landRecordsDesc'),
      link: "/land-records",
    },
    {
      icon: ShoppingBag,
      title: t('materialSellers'),
      description: t('materialSellersDesc'),
      link: "/material-sellers",
    },
  ];

  const stats = [
    { value: "5000+", label: t('professionals') },
    { value: "1200+", label: t('projectsCompleted') },
    { value: "500+", label: t('landListings') },
    { value: "4.8★", label: t('averageRating') },
  ];

  const howItWorks = [
    { step: "1", title: t('browseServices'), description: t('browseServicesDesc') },
    { step: "2", title: t('connectStep'), description: t('connectStepDesc') },
    { step: "3", title: t('buildStep'), description: t('buildStepDesc') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section with Background - scrollable on home page */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: 'url(/images/hero-construction.jpg)',
            backgroundAttachment: 'scroll',
            backgroundSize: 'cover',
            filter: 'brightness(0.6) blur(0.5px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl">
              <span className="text-blue-600 dark:text-blue-400 drop-shadow-lg">{t('heroTitle')}</span>
              <br />
              <span className="text-white/90 drop-shadow-lg">{t('heroTitle2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto drop-shadow-lg">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/services" className="w-full sm:w-auto animate-bounce-attention">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 animate-pulse-glow hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden font-bold"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="animate-pulse">🚀</span>
                    {t('exploreServicesBtn')}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300 animate-bounce-subtle" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                </Button>
              </Link>
              <Link to="/auth?mode=signup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 border-primary/50 hover:border-primary bg-background/80 backdrop-blur hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {t('getStartedFree')}
                    <span className="inline-block group-hover:rotate-12 transition-transform duration-300">✨</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card/50 backdrop-blur border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 border border-border/50 hover:border-primary/30 animate-fade-in" 
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-pulse-glow">{stat.value}</div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for your construction project in one platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <Link key={idx} to={service.link}>
                <Card className="h-full group relative overflow-hidden border-border/50 hover:border-primary/30 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:scale-110 shadow-lg shadow-primary/20 w-fit mb-4">
                      <service.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced Interactive Version */}
      <section className="py-20 bg-card/30 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get started in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            {/* Connecting lines between steps (desktop only) */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -z-10" style={{ width: '66%', left: '17%' }} />
            
            {howItWorks.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative animate-fade-in hover:scale-105 transition-all duration-300" 
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Card with hover effects */}
                <Card className="h-full border-2 border-border/50 hover:border-primary/50 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 bg-background/80 backdrop-blur">
                  <CardContent className="p-8 text-center relative">
                    {/* Step number badge */}
                    <div className="relative inline-block mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-3xl font-bold shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                        {item.step}
                      </div>
                      {/* Animated ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping group-hover:border-primary/60" style={{ animationDuration: '2s' }} />
                    </div>
                    
                    {/* Icon based on step */}
                    <div className="mb-4 flex justify-center">
                      {idx === 0 && <Users className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />}
                      {idx === 1 && <ArrowRight className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />}
                      {idx === 2 && <Building2 className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow connector for mobile */}
                {idx < howItWorks.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <ArrowRight className="h-8 w-8 text-primary rotate-90 animate-bounce-subtle" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* CTA below steps */}
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/auth?mode=signup" className="inline-block w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose <span className="text-primary">CivilConnect</span>?
              </h2>
              <div className="space-y-4">
                {[
                  "Verified professionals with ratings and reviews",
                  "Transparent pricing and project estimates",
                  "Secure communication and payment protection",
                  "AI-powered insights for better decisions"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/auth?mode=signup" className="inline-block w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto mt-4 px-6 sm:px-8 py-5 sm:py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Start Your Project Today
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="/images/engineers-hero.jpg" 
                alt="Construction professionals" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/images/contractors-hero.jpg)',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-60" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Construction Project?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have built their dreams with CivilConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/auth?mode=signup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <span className="flex items-center justify-center gap-2">
                  Create Free Account
                  <span className="inline-block group-hover:rotate-12 transition-transform duration-300">🚀</span>
                </span>
              </Button>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 border-white text-white hover:bg-white/20 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <span className="flex items-center justify-center gap-2">
                  Browse Services
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
