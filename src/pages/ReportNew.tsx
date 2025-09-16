import React, { useState, useRef } from 'react';
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
  Upload,
  X,
  Phone,
  User,
  Clock,
  Droplets
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useReports } from '@/hooks/useReports';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HazardForm {
  // Hazard Details
  hazardType: string;
  severity: string;
  title: string;
  description: string;
  immediateActions: string;
  
  // Location Information
  location: string;
  latitude: string;
  longitude: string;
  
  // Contact Information
  reporterName: string;
  contactNumber: string;
  reporterEmail: string;
  
  // Media Evidence
  photos: FileList | null;
}

export default function ReportNew() {
  const { toast } = useToast();
  const { createReport } = useReports();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<HazardForm>({
    hazardType: '',
    severity: '',
    title: '',
    description: '',
    immediateActions: '',
    location: '',
    latitude: '',
    longitude: '',
    reporterName: '',
    contactNumber: '',
    reporterEmail: '',
    photos: null,
  });

  const hazardTypes = [
    'Oil Spill',
    'Plastic Pollution',
    'Chemical Contamination',
    'Toxic Algae Bloom',
    'Marine Life Distress',
    'Coral Bleaching',
    'Water Quality Issue',
    'Coastal Erosion',
    'Illegal Dumping',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!user) {
      setError('Please log in to submit a report');
      setIsLoading(false);
      return;
    }

    try {
      // Validate required fields
      if (!formData.hazardType || !formData.severity || !formData.title || !formData.description) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Validate email if provided
      if (formData.reporterEmail && !/\S+@\S+\.\S+/.test(formData.reporterEmail)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Validate files if provided
      const files: File[] = [];
      if (formData.photos) {
        for (let i = 0; i < formData.photos.length; i++) {
          const file = formData.photos[i];
          
          // Check file type
          const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];
          if (!allowedTypes.includes(file.type)) {
            setError(`File "${file.name}" has an unsupported format. Only PNG, JPG, JPEG, and MP4 files are allowed.`);
            setIsLoading(false);
            return;
          }
          
          // Check file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            setError(`File "${file.name}" is too large. Maximum size is 10MB.`);
            setIsLoading(false);
            return;
          }
          
          files.push(file);
        }
      }

      // Create report data
      const reportData = {
        hazard_type: formData.hazardType,
        severity: formData.severity as 'Critical' | 'High' | 'Medium' | 'Low',
        title: formData.title,
        description: formData.description,
        immediate_actions: formData.immediateActions || null,
        location_description: formData.location || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        reporter_name: formData.reporterName || null,
        contact_number: formData.contactNumber || null,
        reporter_email: formData.reporterEmail || null,
      };

      await createReport(reportData, files.length > 0 ? files : undefined);
      
      setIsSuccess(true);
      toast({
        title: "Report submitted successfully!",
        description: "Thank you for helping protect our oceans. Your report is now visible on the monitoring map.",
      });
      
      // Reset form
      setFormData({
        hazardType: '',
        severity: '',
        title: '',
        description: '',
        immediateActions: '',
        location: '',
        latitude: '',
        longitude: '',
        reporterName: '',
        contactNumber: '',
        reporterEmail: '',
        photos: null,
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Navigate to dashboard after 2 seconds to see the report on map
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.');
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      photos: e.target.files
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
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setLocationLoading(false);
          toast({
            title: "Location detected",
            description: "Your current coordinates have been added to the report.",
          });
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({
        ...prev,
        photos: e.dataTransfer.files
      }));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800';
      case 'High':
        return 'text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800';
      case 'Low':
        return 'text-green-500 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="relative min-h-screen">
      <OceanBackground />
      <Navbar isAuthenticated />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Droplets className="h-8 w-8 text-primary animate-float" />
            <h1 className="text-3xl font-bold text-foreground">Report Environmental Hazard</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help protect our oceans by reporting environmental concerns. Your detailed observations 
            contribute to real-time monitoring and conservation efforts worldwide.
          </p>
        </div>

        {isSuccess && (
          <Alert className="mb-8 border-green-500/20 bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              <strong>Report submitted successfully!</strong> Thank you for helping protect our oceans. 
              Our monitoring team will review your report and coordinate with appropriate authorities if immediate action is required.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hazard Details Section */}
          <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-deep">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Hazard Details
              </CardTitle>
              <CardDescription>
                Provide comprehensive information about the environmental hazard you've observed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hazardType" className="text-foreground font-medium">
                    Hazard Type *
                  </Label>
                  <Select value={formData.hazardType} onValueChange={(value) => handleSelectChange('hazardType', value)}>
                    <SelectTrigger className="bg-background/60 border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select hazard type" />
                    </SelectTrigger>
                    <SelectContent>
                      {hazardTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    Severity Level *
                  </Label>
                  <Select value={formData.severity} onValueChange={(value) => handleSelectChange('severity', value)}>
                    <SelectTrigger className="bg-background/60 border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-red-500 font-medium">Critical</span>
                          <span className="text-muted-foreground text-xs">- Immediate threat</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="High">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-500 font-medium">High</span>
                          <span className="text-muted-foreground text-xs">- Urgent attention needed</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-500 font-medium">Medium</span>
                          <span className="text-muted-foreground text-xs">- Moderate concern</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Low">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-500 font-medium">Low</span>
                          <span className="text-muted-foreground text-xs">- Minor issue</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground font-medium">
                  Incident Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief, descriptive title of the hazard (e.g., 'Large oil spill near harbor entrance')"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="bg-background/60 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground font-medium">
                  Detailed Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide detailed observations including what you saw, smell, estimated size/scale, wildlife impact, weather conditions, and any other relevant details..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="min-h-32 bg-background/60 border-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="immediateActions" className="text-foreground font-medium">
                  Immediate Actions Taken
                </Label>
                <Textarea
                  id="immediateActions"
                  name="immediateActions"
                  placeholder="Describe any immediate actions you or others have taken (e.g., contacted authorities, attempted cleanup, evacuated area, etc.)"
                  value={formData.immediateActions}
                  onChange={handleChange}
                  className="min-h-24 bg-background/60 border-primary/20 focus:border-primary resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information Section */}
          <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-deep">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                Location Information
              </CardTitle>
              <CardDescription>
                Provide precise location details to help responders locate the hazard quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground font-medium">
                  Location Description
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Describe the location (e.g., '2 miles north of Santa Monica Pier', 'Near the harbor entrance')"
                  value={formData.location}
                  onChange={handleChange}
                  className="bg-background/60 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-foreground font-medium">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    placeholder="e.g., 34.052235"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="bg-background/60 border-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-foreground font-medium">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    placeholder="e.g., -118.243685"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="bg-background/60 border-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={getLocationFromGPS}
                  disabled={locationLoading}
                  className="bg-primary/10 hover:bg-primary/20 border-primary/30"
                >
                  {locationLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="mr-2 h-4 w-4" />
                  )}
                  Get Current Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Media Evidence Section */}
          <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-deep">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Camera className="h-5 w-5 text-primary" />
                Media Evidence
              </CardTitle>
              <CardDescription>
                Upload photos or videos to help document the hazard (Max 10MB per file)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-primary/30 hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-12 w-12 text-primary/60 mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: JPG, PNG, JPEG, MP4 • Max 10MB per file
                </p>
                {formData.photos && formData.photos.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-primary font-medium mb-2">
                      {formData.photos.length} file(s) selected:
                    </div>
                    <div className="space-y-1">
                      {Array.from(formData.photos).map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-primary/10 rounded p-2">
                          <div className="flex items-center gap-2">
                            <Camera className="h-3 w-3 text-primary" />
                            <span className="truncate max-w-40">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{(file.size / (1024 * 1024)).toFixed(1)}MB</span>
                            <div className={`w-2 h-2 rounded-full ${
                              file.size > 10 * 1024 * 1024 ? 'bg-red-500' : 
                              ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4'].includes(file.type) ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Section */}
          <Card className="bg-card/80 backdrop-blur-lg border-primary/20 shadow-deep">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>  
              <CardDescription>
                Optional: Provide contact details in case authorities need to follow up
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="reporterName" className="text-foreground font-medium">
                    Your Name
                  </Label>
                  <Input
                    id="reporterName"
                    name="reporterName"
                    placeholder="Full name (optional)"
                    value={formData.reporterName}
                    onChange={handleChange}
                    className="bg-background/60 border-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reporterEmail" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="reporterEmail"
                    name="reporterEmail"
                    type="email"
                    placeholder="your.email@example.com (optional)"
                    value={formData.reporterEmail}
                    onChange={handleChange}
                    className="bg-background/60 border-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-foreground font-medium">
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="Phone number (optional)"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="bg-background/60 border-primary/20 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <Button 
              type="submit" 
              className="px-12 py-3 text-lg" 
              variant="ocean" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Submit Environmental Report
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto">
              Your report will be immediately reviewed by our monitoring team. Critical issues will be 
              forwarded to emergency responders and relevant authorities within 15 minutes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}