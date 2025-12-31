import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WaferAssembly = ({ lenisRef }) => {
  const sectionRef = useRef(null);
  const waferRef = useRef(null);
  const fragmentsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Wafer assembly animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          scrub: true,
          pin: true,
        },
      });

      // Animate fragments assembling
      fragmentsRef.current.forEach((fragment, index) => {
        const angle = (index / fragmentsRef.current.length) * Math.PI * 2;
        const distance = 300;
        
        tl.fromTo(
          fragment,
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            scale: 0.8,
            opacity: 0,
            filter: 'blur(8px)',
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
          },
          index * 0.05
        );
      });

      // Subtle rotation
      tl.to(
        waferRef.current,
        {
          rotation: 1.5,
          duration: 1,
          ease: 'none',
        },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="wafer-assembly-section">
      <div ref={waferRef} className="wafer-container">
        {/* Main wafer circle */}
        <svg className="wafer-main" viewBox="0 0 600 600">
          <defs>
            <radialGradient id="wafer-gradient">
              <stop offset="0%" stopColor="rgba(150, 170, 200, 0.4)" />
              <stop offset="50%" stopColor="rgba(100, 120, 160, 0.2)" />
              <stop offset="100%" stopColor="rgba(60, 80, 120, 0.1)" />
            </radialGradient>
            
            <filter id="wafer-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <circle 
            cx="300" 
            cy="300" 
            r="280" 
            fill="url(#wafer-gradient)"
            stroke="rgba(140, 160, 200, 0.3)"
            strokeWidth="2"
            filter="url(#wafer-glow)"
          />
        </svg>

        {/* Hexagonal fragments */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (fragmentsRef.current[i] = el)}
            className="wafer-fragment"
            style={{
              '--index': i,
              '--total': 12,
            }}
          >
            <svg viewBox="0 0 100 100">
              <polygon
                points="50,10 90,30 90,70 50,90 10,70 10,30"
                fill="rgba(120, 140, 180, 0.15)"
                stroke="rgba(140, 160, 200, 0.4)"
                strokeWidth="1"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="3" 
                fill="rgba(160, 180, 220, 0.6)"
              />
            </svg>
          </div>
        ))}
      </div>
      
      <div className="section-label">
        <span className="label-text">SECTION 01</span>
        <span className="label-divider"></span>
        <span className="label-desc">WAFER ASSEMBLY</span>
      </div>
    </section>
  );
};

export default WaferAssembly;
