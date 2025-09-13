import React from 'react';
import LeafletMap from '@/components/LeafletMap';

interface MapProps {
  className?: string;
  onLocationSelect?: (coordinates: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({ className = '', onLocationSelect }) => {
  return (
    <LeafletMap 
      className={className}
      onLocationSelect={onLocationSelect}
    />
  );
};

export default Map;