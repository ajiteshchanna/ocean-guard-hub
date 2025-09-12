import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OceanBackground } from '@/components/OceanBackground';
import { Navbar } from '@/components/Navbar';
import { 
  Waves, 
  Shield, 
  Eye, 
  Brain, 
  Users, 
  Globe, 
  Share2,
  Camera,
  Map,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Camera,
      title: "Citizen Reporting",
      description: "Easy-to-use mobile-first interface for reporting ocean hazards with photo/video uploads and GPS location"
    },
    {
      icon: Map,
      title: "Interactive Dashboard", 
      description: "Real-time map visualization with hazard clusters, hotspots, and comprehensive filtering options"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced NLP processing for automatic hazard classification, sentiment analysis, and urgency scoring"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Secure role-based authentication for citizens, analysts, emergency managers, and administrators"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Support for multiple languages including Hindi, Tamil, Telugu, Bengali, and English with transliteration"
    },
    {
      icon: Share2,
      title: "Social Integration",
      description: "Integration with social media platforms for enhanced hazard detection and community engagement"
    }
  ];

  const stats = [
    { label: "Active Reports", value: "247", trend: "+12%", icon: TrendingUp },
    { label: "Critical Alerts", value: "8", trend: "Monitor", icon: AlertTriangle },
    { label: "Locations", value: "89", trend: "Coastal", icon: Map },
    { label: "Response Rate", value: "94%", trend: "Target", icon: CheckCircle },
  ];

  return (
    <div className="relative min-h-screen">
      <OceanBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 animate-float">
            <Waves className="h-24 w-24 text-primary-glow mx-auto mb-6 animate-glow-pulse" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            <span className="bg-gradient-deep bg-clip-text text-transparent">
              Ocean Guard
            </span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
            Ocean Hazard Intelligence
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Empowering citizens and officials with real-time ocean hazard reporting and monitoring 
            for safer coastal communities through advanced technology and community engagement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/login">
              <Button variant="hero" size="xl" className="min-w-40">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="coral" size="xl" className="min-w-40">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-wave hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-primary font-medium">{stat.trend}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-transparent to-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Comprehensive Ocean Safety Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced technology meets community reporting for unprecedented ocean hazard awareness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-wave hover:shadow-glow hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg mr-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-primary/10 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Waves className="h-8 w-8 text-primary mr-2 animate-wave" />
            <span className="text-xl font-bold text-primary">Ocean Guard</span>
          </div>
          <p className="text-muted-foreground">
            Protecting our oceans, one report at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}