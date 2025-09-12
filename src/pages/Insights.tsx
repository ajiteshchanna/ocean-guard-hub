import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { OceanBackground } from '@/components/OceanBackground';
import { Navbar } from '@/components/Navbar';
import { 
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  MessageSquare,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Waves
} from 'lucide-react';

export default function Insights() {
  const trendData = [
    { period: 'This Week', reports: 45, change: '+23%', trend: 'up' },
    { period: 'This Month', reports: 186, change: '+15%', trend: 'up' },
    { period: 'This Quarter', reports: 562, change: '-8%', trend: 'down' },
  ];

  const socialMetrics = [
    { platform: 'Twitter', mentions: 1247, sentiment: 'positive', engagement: 89 },
    { platform: 'Facebook', mentions: 892, sentiment: 'neutral', engagement: 76 },
    { platform: 'Instagram', mentions: 634, sentiment: 'positive', engagement: 92 },
    { platform: 'Reddit', mentions: 456, sentiment: 'mixed', engagement: 68 },
  ];

  const environmentalTrends = [
    { category: 'Water Quality', score: 78, change: '+5%', status: 'improving' },
    { category: 'Marine Life', score: 65, change: '-2%', status: 'declining' },
    { category: 'Coastal Erosion', score: 42, change: '-12%', status: 'critical' },
    { category: 'Pollution Levels', score: 71, change: '+8%', status: 'improving' },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'neutral': return 'bg-gray-500';
      case 'mixed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving': return 'text-green-500';
      case 'declining': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'improving': return <CheckCircle className="h-4 w-4" />;
      case 'declining': return <Clock className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
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
            <BarChart3 className="h-8 w-8 text-primary animate-float" />
            <h1 className="text-3xl font-bold text-foreground">Ocean Health Insights</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive analytics from social media monitoring, report trends, and environmental data 
            to drive informed conservation decisions.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Trending Analytics */}
          <div className="grid md:grid-cols-3 gap-6">
            {trendData.map((trend, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <Badge variant={trend.trend === 'up' ? 'default' : 'secondary'} className="bg-primary/10 text-primary">
                      {trend.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{trend.period}</p>
                    <p className="text-2xl font-bold text-foreground">{trend.reports}</p>
                    <p className="text-sm text-muted-foreground">reports submitted</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Social Media Analytics */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Social Media Monitoring
                </CardTitle>
                <CardDescription>
                  Real-time sentiment analysis across major platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{metric.platform}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getSentimentColor(metric.sentiment)}`}></div>
                            <span className="text-sm text-muted-foreground capitalize">{metric.sentiment}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">{metric.mentions}</p>
                        <p className="text-sm text-muted-foreground">mentions</p>
                        <div className="mt-2">
                          <Progress value={metric.engagement} className="w-20 h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{metric.engagement}% engagement</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environmental Health Scores */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-primary" />
                  Environmental Health Trends
                </CardTitle>
                <CardDescription>
                  Key environmental indicators and their trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {environmentalTrends.map((env, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{env.category}</span>
                          <div className={`flex items-center gap-1 ${getStatusColor(env.status)}`}>
                            {getStatusIcon(env.status)}
                            <span className="text-sm capitalize">{env.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{env.score}/100</span>
                          <Badge variant={env.change.startsWith('+') ? 'default' : 'secondary'} className="bg-primary/10 text-primary text-xs">
                            {env.change}
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={env.score} 
                        className="w-full h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comprehensive Analytics Chart */}
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-wave">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Comprehensive Report Analytics
              </CardTitle>
              <CardDescription>
                Combined data visualization from multiple sources and time periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-ocean rounded-lg p-8 flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-white/90">
                  <Activity className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                  <p className="text-xl font-medium mb-2">Analytics Dashboard</p>
                  <p className="text-sm mb-4">Real-time data visualization and trend analysis</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-semibold">2,847</div>
                      <div>Total Reports</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-semibold">89%</div>
                      <div>Accuracy Rate</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-semibold">156</div>
                      <div>Active Users</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-semibold">34</div>
                      <div>Regions</div>
                    </div>
                  </div>
                </div>

                {/* Animated data points */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full animate-glow-pulse"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.3}s`
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
  );
}