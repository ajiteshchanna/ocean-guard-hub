import React from 'react';

export function OceanBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-ocean" />
      
      {/* Animated wave layers */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-wave ocean-wave" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-wave ocean-wave" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-wave ocean-wave" 
             style={{ animationDelay: '4s' }} />
      </div>

      {/* Floating bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-primary-glow/20 rounded-full bubble-animation`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}