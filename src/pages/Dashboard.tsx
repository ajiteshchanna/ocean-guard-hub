import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { OceanBackground } from '@/components/OceanBackground';
import { Navbar } from '@/components/Navbar';
import Map from '@/components/Map';
import { 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  CheckCircle,
  Download,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Waves
} from 'lucide-react';

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('24h');

  const stats = [
    {
      title: "Active Reports",
      value: "247",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      description: "from last week"
    },
    {
      title: "Critical Alerts", 
      value: "8",
      change: "Requires attention",
      trend: "alert",
      icon: AlertTriangle,
      description: "immediate action needed"
    },
    {
      title: "Locations Monitored",
      value: "89", 
      change: "Coastal regions",
      trend: "stable",
      icon: MapPin,
      description: "active monitoring zones"
    },
    {
      title: "Response Rate",
      value: "94%",
      change: "Above target",
      trend: "up",
      icon: CheckCircle,
      description: "system efficiency"
    }
  ];

  const alertHotspots = [
    {
      location: "Pacific Coast Highway",
      alerts: 23,
      trend: "increasing",
      severity: "high"
    },
    {
      location: "Gulf Coast Region", 
      alerts: 18,
      trend: "stable",
      severity: "medium"
    },
    {
      location: "Atlantic Shoreline",
      alerts: 15,
      trend: "decreasing", 
      severity: "low"
    },
    {
      location: "Great Lakes Area",
      alerts: 12,
      trend: "increasing",
      severity: "medium"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'increasing':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
      case 'decreasing':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <ArrowRight className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      filter: timeFilter,
      stats: stats,
      hotspots: alertHotspots,
      exportedBy: "Ocean Guard System"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocean-guard-data-${timeFilter}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen">
      <OceanBackground />
      <Navbar isAuthenticated />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Waves className="h-8 w-8 text-primary animate-float" />
              Ocean Monitoring Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time ocean hazard monitoring and analysis
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-48 bg-card/80 border-primary/20">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={exportData} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                    {getTrendIcon(stat.trend)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-primary font-medium">{stat.change}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interactive Hazard Map */}
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Interactive Hazard Map
              </CardTitle>
              <CardDescription>
                Real-time visualization of reported ocean hazards across monitored regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Map className="h-96" />
            </CardContent>
          </Card>

          {/* Alert Hotspots */}
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Alert Hotspots
              </CardTitle>
              <CardDescription>
                Locations with highest activity levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertHotspots.map((hotspot, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(hotspot.severity)}`}></div>
                      <div>
                        <p className="font-medium text-foreground">{hotspot.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {hotspot.alerts} active alerts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(hotspot.trend)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {hotspot.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}