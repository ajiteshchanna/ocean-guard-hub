import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OceanBackground } from '@/components/OceanBackground';
import { Navbar } from '@/components/Navbar';
import { 
  FileText,
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Waves,
  Upload
} from 'lucide-react';

interface HazardForm {
  title: string;
  location: string;
  severity: string;
  description: string;
  photos: FileList | null;
}

export default function Report() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState<HazardForm>({
    title: '',
    location: '',
    severity: '',
    description: '',
    photos: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (formData.title && formData.location && formData.severity && formData.description) {
        setIsSuccess(true);
        setFormData({
          title: '',
          location: '',
          severity: '',
          description: '',
          photos: null,
        });
        // Reset form
        const form = document.getElementById('hazard-form') as HTMLFormElement;
        if (form) form.reset();
      } else {
        setError('Please fill in all required fields');
      }
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      photos: e.target.files
    }));
  };

  const handleSeverityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      severity: value
    }));
  };

  const getLocationFromGPS = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setLocationLoading(false);
        },
        () => {
          setError('Unable to get location. Please enter manually.');
          setLocationLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
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
            <FileText className="h-8 w-8 text-primary animate-float" />
            <h1 className="text-3xl font-bold text-foreground">Report Environmental Hazard</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help protect our oceans by reporting environmental concerns. Your observations contribute 
            to real-time monitoring and conservation efforts.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {isSuccess && (
            <Alert className="mb-6 border-green-500/20 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Report submitted successfully! Thank you for helping protect our oceans.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-deep">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Waves className="h-5 w-5 text-primary" />
                Hazard Report Form
              </CardTitle>
              <CardDescription>
                Please provide detailed information about the environmental hazard you've observed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="hazard-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground font-medium">
                    Report Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Brief description of the hazard"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="bg-background/60 border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-foreground font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      name="location"
                      placeholder="Enter location or coordinates"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="flex-1 bg-background/60 border-primary/20 focus:border-primary"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={getLocationFromGPS}
                      disabled={locationLoading}
                      className="px-3"
                    >
                      {locationLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click the GPS button to auto-detect your current location
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Severity Level *
                  </Label>
                  <Select value={formData.severity} onValueChange={handleSeverityChange}>
                    <SelectTrigger className="bg-background/60 border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select hazard severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-red-500 font-medium">Critical</span>
                          <span className="text-muted-foreground text-sm">- Immediate threat</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-500 font-medium">Medium</span>
                          <span className="text-muted-foreground text-sm">- Moderate concern</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Low">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-500 font-medium">Low</span>
                          <span className="text-muted-foreground text-sm">- Minor issue</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground font-medium">
                    Detailed Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the hazard in detail, including what you observed, when it occurred, and any immediate impacts..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-32 bg-background/60 border-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos" className="text-foreground font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Photos/Videos (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="photos"
                      name="photos"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="bg-background/60 border-primary/20 focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:hover:bg-primary/90"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload photos or videos to help document the hazard. Max 10MB per file.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="ocean" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Your report will be reviewed by our monitoring team and appropriate authorities will be notified if immediate action is required.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}