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
  Waves,
  FileText,
  Users
} from 'lucide-react';
import { useReports } from '@/hooks/useReports';


export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('24h');
  const { reports, loading } = useReports();

  // Calculate real statistics from reports data
  const getFilteredReports = () => {
    if (!reports || reports.length === 0) return [];
    
    const now = new Date();
    let filterDate = new Date();
    
    switch (timeFilter) {
      case '24h':
        filterDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '3m':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      default:
        filterDate.setHours(now.getHours() - 24);
    }
    
    return reports.filter(report => new Date(report.created_at) >= filterDate);
  };

  const filteredReports = getFilteredReports();
  const criticalReports = filteredReports.filter(r => r.severity === 'Critical');
  const uniqueLocations = new Set(filteredReports.map(r => r.location_description).filter(Boolean)).size;

  const stats = [
    {
      title: "Active Reports",
      value: loading ? "..." : filteredReports.length.toString(),
      change: filteredReports.length === 0 ? "No reports yet" : `${filteredReports.length} total`,
      trend: filteredReports.length > 0 ? "up" : "stable",
      icon: TrendingUp,
      description: `in selected time period`
    },
    {
      title: "Critical Alerts", 
      value: loading ? "..." : criticalReports.length.toString(),
      change: criticalReports.length > 0 ? "Requires attention" : "No critical alerts",
      trend: criticalReports.length > 0 ? "alert" : "stable",
      icon: AlertTriangle,
      description: "immediate action needed"
    },
    {
      title: "Locations Monitored",
      value: loading ? "..." : uniqueLocations.toString(), 
      change: uniqueLocations === 0 ? "No locations yet" : "Coastal regions",
      trend: uniqueLocations > 0 ? "up" : "stable",
      icon: MapPin,
      description: "active monitoring zones"
    },
    {
      title: "System Status",
      value: loading ? "..." : "Online",
      change: "Operational",
      trend: "up",
      icon: CheckCircle,
      description: "system health"
    }
  ];

  // Generate alert hotspots from actual data
  const getAlertHotspots = () => {
    if (!filteredReports || filteredReports.length === 0) {
      return [
        {
          location: "No data available",
          alerts: 0,
          trend: "stable",
          severity: "low",
          isEmpty: true
        }
      ];
    }

    const locationCounts: Record<string, { count: number; severities: string[] }> = {};
    filteredReports.forEach(report => {
      const location = report.location_description || "Unknown Location";
      if (!locationCounts[location]) {
        locationCounts[location] = {
          count: 0,
          severities: []
        };
      }
      locationCounts[location].count++;
      locationCounts[location].severities.push(report.severity);
    });

    return Object.entries(locationCounts)
      .map(([location, data]) => {
        const criticalCount = data.severities.filter(s => s === 'Critical').length;
        const highCount = data.severities.filter(s => s === 'High').length;
        
        let severity = 'low';
        if (criticalCount > 0) severity = 'high';
        else if (highCount > 0) severity = 'medium';
        
        return {
          location,
          alerts: data.count,
          trend: data.count > 2 ? "increasing" : data.count > 1 ? "stable" : "decreasing",
          severity
        };
      })
      .sort((a, b) => b.alerts - a.alerts)
      .slice(0, 4);
  };

  const alertHotspots = getAlertHotspots();


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
                    {stat.trend === 'up' || stat.trend === 'increasing' ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : stat.trend === 'down' || stat.trend === 'decreasing' ? (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    ) : stat.trend === 'stable' ? (
                      <ArrowRight className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
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
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : alertHotspots.length === 0 || (alertHotspots[0] && 'isEmpty' in alertHotspots[0] && alertHotspots[0].isEmpty) ? (
                  <div className="text-center p-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium mb-2">No Reports Yet</p>
                    <p className="text-sm">Submit your first ocean hazard report to see data here</p>
                  </div>
                ) : (
                  alertHotspots.map((hotspot, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          hotspot.severity === 'high' ? 'bg-red-500' :
                          hotspot.severity === 'medium' ? 'bg-yellow-500' :
                          hotspot.severity === 'low' ? 'bg-green-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-foreground">{hotspot.location}</p>
                          <p className="text-sm text-muted-foreground">
                            {hotspot.alerts} active alert{hotspot.alerts !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hotspot.trend === 'increasing' ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : hotspot.trend === 'decreasing' ? (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm text-muted-foreground capitalize">
                          {hotspot.trend}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}