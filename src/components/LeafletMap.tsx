import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, AlertTriangle } from 'lucide-react';

// Fix for default markers in Leaflet with Webpack
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Report {
  id: string;
  user_id: string;
  hazard_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  immediate_actions: string | null;
  location_description: string | null;
  latitude: number | null;
  longitude: number | null;
  reporter_name: string | null;
  contact_number: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface LeafletMapProps {
  className?: string;
  onLocationSelect?: (coordinates: [number, number]) => void;
}

// Custom marker icons based on severity
const createCustomIcon = (severity: string) => {
  const colors = {
    Critical: '#ef4444',
    High: '#f97316', 
    Medium: '#f59e0b',
    Low: '#10b981'
  };

  const color = colors[severity as keyof typeof colors] || '#6b7280';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">!</div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

// Component to handle real-time updates
function MapUpdater({ reports, setReports }: { reports: Report[], setReports: (reports: Report[]) => void }) {
  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('New report:', payload);
          const newReport = payload.new as Report;
          if (newReport.latitude && newReport.longitude) {
            setReports([...reports, newReport as Report]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('Updated report:', payload);
          const updatedReport = payload.new as Report;
          setReports(reports.map(report => 
            report.id === updatedReport.id ? updatedReport : report
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('Deleted report:', payload);
          const deletedId = payload.old.id;
          setReports(reports.filter(report => report.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reports, setReports]);

  return null;
}

// Component to handle map clicks
function ClickHandler({ onLocationSelect }: { onLocationSelect?: (coordinates: [number, number]) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onLocationSelect) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onLocationSelect([e.latlng.lng, e.latlng.lat]);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect]);

  return null;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800';
  }
};

const LeafletMap: React.FC<LeafletMapProps> = ({ className = '', onLocationSelect }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        return;
      }

      setReports((data as Report[]) || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading ocean monitoring map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[40.7128, -74.0060]} // Default to New York Harbor
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg shadow-deep z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Ocean-themed tile layer overlay for better aesthetics */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri'
          opacity={0.6}
        />

        {/* Render markers for each report */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude!, report.longitude!]}
            icon={createCustomIcon(report.severity)}
          >
            <Popup className="ocean-popup" maxWidth={300}>
              <Card className="border-0 shadow-none">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">
                        {report.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSeverityColor(report.severity)}`}
                      >
                        {report.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {report.description.length > 100 
                        ? `${report.description.substring(0, 100)}...` 
                        : report.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">{report.hazard_type}</span>
                      </div>
                      
                      {report.location_description && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{report.location_description}</span>
                        </div>
                      )}
                      
                      {report.reporter_name && (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>Reported by: {report.reporter_name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(report.created_at).toLocaleDateString()} at{' '}
                          {new Date(report.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {report.immediate_actions && (
                      <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                        <strong>Actions taken:</strong> {report.immediate_actions}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}

        {/* Handle map clicks for location selection */}
        <ClickHandler onLocationSelect={onLocationSelect} />
        
        {/* Real-time updates */}
        <MapUpdater reports={reports} setReports={setReports} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;