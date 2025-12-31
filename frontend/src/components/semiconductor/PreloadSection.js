import React from 'react';

const PreloadSection = () => {
  return (
    <section className="preload-section">
      <div className="preload-noise"></div>
      <svg className="preload-grid" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="wafer-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="0.8" fill="rgba(120, 140, 160, 0.4)" />
            <line x1="0" y1="25" x2="50" y2="25" stroke="rgba(100, 120, 140, 0.15)" strokeWidth="0.5" />
            <line x1="25" y1="0" x2="25" y2="50" stroke="rgba(100, 120, 140, 0.15)" strokeWidth="0.5" />
          </pattern>
          
          <radialGradient id="grid-fade">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <circle 
          cx="500" 
          cy="500" 
          r="400" 
          fill="url(#wafer-grid)" 
          opacity="0"
          style={{ mask: 'url(#grid-fade)' }}
        />
        
        <circle 
          cx="500" 
          cy="500" 
          r="400" 
          fill="none" 
          stroke="rgba(120, 140, 180, 0.2)" 
          strokeWidth="1"
        />
      </svg>
    </section>
  );
};

export default PreloadSection;
