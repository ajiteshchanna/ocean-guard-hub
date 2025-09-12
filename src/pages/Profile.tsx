import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OceanBackground } from '@/components/OceanBackground';
import { Navbar } from '@/components/Navbar';
import { 
  User,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  Star,
  Shield,
  Waves
} from 'lucide-react';

export default function Profile() {
  const userStats = [
    { label: 'Reports Submitted', value: '23', icon: FileText },
    { label: 'Conservation Points', value: '1,247', icon: Star },
    { label: 'Community Rank', value: '#156', icon: TrendingUp },
    { label: 'Member Since', value: '2023', icon: Calendar },
  ];

  const recentReports = [
    { 
      title: 'Oil Spill Detection', 
      location: 'Pacific Coast', 
      date: '2024-12-08', 
      severity: 'Critical',
      status: 'Under Review'
    },
    { 
      title: 'Marine Debris', 
      location: 'Gulf Shore', 
      date: '2024-12-05', 
      severity: 'Medium',
      status: 'Resolved'
    },
    { 
      title: 'Water Quality Alert', 
      location: 'Atlantic Bay', 
      date: '2024-12-02', 
      severity: 'Low',
      status: 'Verified'
    },
  ];

  const achievements = [
    { title: 'First Reporter', description: 'Submitted your first hazard report', earned: true },
    { title: 'Community Guardian', description: 'Submitted 10+ reports', earned: true },
    { title: 'Ocean Protector', description: 'Contributed to 5+ critical alerts', earned: true },
    { title: 'Vigilant Watcher', description: 'Report accuracy above 90%', earned: false },
    { title: 'Conservation Hero', description: 'Reached 1000+ conservation points', earned: true },
    { title: 'Global Impact', description: 'Reports from 5+ different regions', earned: false },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'text-green-500 bg-green-500/10';
      case 'Verified': return 'text-blue-500 bg-blue-500/10';
      case 'Under Review': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="relative min-h-screen">
      <OceanBackground />
      <Navbar isAuthenticated />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="h-8 w-8 text-primary animate-float" />
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-ocean rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-foreground">John Ocean Guardian</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Verified Ocean Protector
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">john.guardian@ocean.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">California Coast, USA</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Joined December 2023</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {userStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center p-3 bg-background/50 rounded-lg">
                        <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                        <div className="text-lg font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Reports */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Reports
                </CardTitle>
                <CardDescription>
                  Your latest environmental hazard submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(report.severity)}`}></div>
                        <div>
                          <p className="font-medium text-foreground">{report.title}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {report.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {report.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Reports
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Conservation Achievements
                </CardTitle>
                <CardDescription>
                  Your contributions to ocean conservation efforts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        achievement.earned 
                          ? 'bg-primary/5 border-primary/30 shadow-glow' 
                          : 'bg-background/30 border-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-full ${
                          achievement.earned 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted/20 text-muted-foreground'
                        }`}>
                          {achievement.earned ? (
                            <Star className="h-4 w-4" />
                          ) : (
                            <Award className="h-4 w-4" />
                          )}
                        </div>
                        <p className={`font-medium ${
                          achievement.earned ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {achievement.title}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conservation Impact */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-primary" />
                  Conservation Impact
                </CardTitle>
                <CardDescription>
                  Your positive impact on ocean conservation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-ocean rounded-lg p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-white/90">
                    <Waves className="h-12 w-12 mx-auto mb-4 animate-float" />
                    <p className="text-lg font-medium mb-4">Conservation Dashboard</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold">147 km²</div>
                        <div>Ocean Area Protected</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold">89%</div>
                        <div>Report Accuracy</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold">12</div>
                        <div>Hazards Prevented</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold">156</div>
                        <div>Community Impact</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating conservation elements */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-white rounded-full animate-bubble-float"
                        style={{
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.8}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}