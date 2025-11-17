import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Users, DollarSign } from "lucide-react";
import { useBackground } from "@/context/BackgroundContext";
import { useEffect } from "react";
const AIInsights = () => {
  const { setBackground } = useBackground();

  useEffect(() => {
    setBackground('/images/hero-construction.jpg', false);
    return () => setBackground(null, false);
  }, [setBackground]);
  const insights = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Market Trends",
      description: "AI-powered analysis of construction market trends and pricing in your area",
      value: "Coming Soon",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Professional Recommendations",
      description: "Get AI-suggested professionals based on your project requirements",
      value: "Coming Soon",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Cost Estimator",
      description: "Smart construction cost estimation using machine learning",
      value: "Coming Soon",
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Project Planning",
      description: "AI-assisted project timeline and resource planning",
      value: "Coming Soon",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with transparent background */}
      <div className="relative pt-20 pb-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">AI Insights</h1>
          <p className="text-xl text-white/90">
            Smart analytics and civic coordination tools powered by artificial intelligence
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-white/10">
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">{insight.icon}</div>
                  <div>
                    <CardTitle className="text-xl mb-2">{insight.title}</CardTitle>
                    <CardDescription>{insight.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-muted-foreground">
                  {insight.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
