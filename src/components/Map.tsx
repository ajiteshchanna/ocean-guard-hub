import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Settings } from 'lucide-react';

interface MapProps {
  className?: string;
  onLocationSelect?: (coordinates: [number, number]) => void;
}

// Mock hazard data for demonstration
const mockHazards = [
  { id: 1, coordinates: [-74.006, 40.7128], severity: 'critical', title: 'Oil Spill Alert', description: 'Large oil spill detected near harbor' },
  { id: 2, coordinates: [-118.2437, 34.0522], severity: 'medium', title: 'Plastic Debris', description: 'High concentration of plastic waste' },
  { id: 3, coordinates: [-87.6298, 41.8781], severity: 'low', title: 'Water Quality', description: 'Slight pH imbalance detected' },
  { id: 4, coordinates: [-122.4194, 37.7749], severity: 'critical', title: 'Toxic Algae Bloom', description: 'Dangerous algae bloom spreading' },
  { id: 5, coordinates: [-80.1918, 25.7617], severity: 'medium', title: 'Coral Bleaching', description: 'Coral reef showing signs of stress' },
];

const Map: React.FC<MapProps> = ({ className = '', onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 4,
        projection: 'globe' as any,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add atmosphere for 3D globe effect
      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6,
        });
      });

      // Add hazard markers
      map.current.on('load', () => {
        mockHazards.forEach((hazard) => {
          const el = document.createElement('div');
          el.className = 'hazard-marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          
          // Color based on severity
          switch (hazard.severity) {
            case 'critical':
              el.style.backgroundColor = '#ef4444';
              break;
            case 'medium':
              el.style.backgroundColor = '#f59e0b';
              break;
            case 'low':
              el.style.backgroundColor = '#10b981';
              break;
          }

          // Create popup
          const popup = new mapboxgl.Popup({
            offset: 25,
            className: 'hazard-popup'
          }).setHTML(`
            <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937;">${hazard.title}</h3>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">${hazard.description}</p>
            <div style="margin-top: 8px; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; display: inline-block; ${
              hazard.severity === 'critical' ? 'background: #fef2f2; color: #dc2626;' :
              hazard.severity === 'medium' ? 'background: #fffbeb; color: #d97706;' :
              'background: #f0fdf4; color: #16a34a;'
            }">
              ${hazard.severity.toUpperCase()}
            </div>
          `);

          new mapboxgl.Marker(el)
            .setLngLat(hazard.coordinates as [number, number])
            .setPopup(popup)
            .addTo(map.current!);
        });
      });

      // Handle map clicks for location selection
      if (onLocationSelect) {
        map.current.on('click', (e) => {
          onLocationSelect([e.lngLat.lng, e.lngLat.lat]);
        });
      }

      setIsInitialized(true);
      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      initializeMap();
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className={`relative ${className}`}>
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Map Configuration
            </CardTitle>
            <CardDescription>
              Enter your Mapbox access token to enable the interactive map
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="pk.eyJ1..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Get your free token at{' '}
                  <a 
                    href="https://account.mapbox.com/access-tokens/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    mapbox.com
                  </a>
                </p>
              </div>
              <Button type="submit" className="w-full" variant="ocean">
                <Settings className="mr-2 h-4 w-4" />
                Initialize Map
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-deep" />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initializing ocean monitoring map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;