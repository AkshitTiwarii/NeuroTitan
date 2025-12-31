import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LayerSeparation = () => {
  const sectionRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: '+=150%',
          scrub: true,
          pin: true,
        },
      });

      // Separate layers with varying speeds for depth illusion
      layersRef.current.forEach((layer, index) => {
        const totalLayers = layersRef.current.length;
        const depthIndex = index - Math.floor(totalLayers / 2);
        const separation = depthIndex * 80;
        const scaleAmount = 1 - Math.abs(depthIndex) * 0.08;
        const opacityAmount = 1 - Math.abs(depthIndex) * 0.15;
        const blurAmount = Math.abs(depthIndex) * 1.5;

        tl.to(
          layer,
          {
            y: separation,
            scale: scaleAmount,
            opacity: opacityAmount,
            filter: `blur(${blurAmount}px)`,
            duration: 1,
            ease: 'power2.inOut',
          },
          0
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="layer-separation-section">
      <div className="layers-container">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (layersRef.current[i] = el)}
            className="silicon-layer"
            style={{
              '--layer-index': i,
              '--layer-total': 7,
            }}
          >
            <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id={`layer-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={`rgba(${100 + i * 10}, ${120 + i * 8}, ${160 + i * 5}, 0.3)`} />
                  <stop offset="50%" stopColor={`rgba(${110 + i * 10}, ${130 + i * 8}, ${170 + i * 5}, 0.5)`} />
                  <stop offset="100%" stopColor={`rgba(${100 + i * 10}, ${120 + i * 8}, ${160 + i * 5}, 0.3)`} />
                </linearGradient>

                <pattern id={`layer-pattern-${i}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="40" height="40" fill="none" />
                  <line x1="0" y1="20" x2="40" y2="20" stroke={`rgba(${140 + i * 10}, ${160 + i * 8}, ${200 + i * 5}, 0.2)`} strokeWidth="0.5" />
                  <line x1="20" y1="0" x2="20" y2="40" stroke={`rgba(${140 + i * 10}, ${160 + i * 8}, ${200 + i * 5}, 0.2)`} strokeWidth="0.5" />
                </pattern>
              </defs>

              <rect 
                x="50" 
                y="20" 
                width="700" 
                height="160" 
                rx="4"
                fill={`url(#layer-grad-${i})`}
                stroke={`rgba(${130 + i * 10}, ${150 + i * 8}, ${190 + i * 5}, 0.5)`}
                strokeWidth="1.5"
              />
              
              <rect 
                x="50" 
                y="20" 
                width="700" 
                height="160" 
                rx="4"
                fill={`url(#layer-pattern-${i})`}
                opacity="0.6"
              />

              {/* Connection points */}
              {[...Array(12)].map((_, j) => (
                <circle
                  key={j}
                  cx={100 + j * 55}
                  cy={100}
                  r="2"
                  fill={`rgba(${160 + i * 10}, ${180 + i * 8}, ${220 + i * 5}, 0.7)`}
                />
              ))}
            </svg>
          </div>
        ))}
      </div>

      <div className="section-label">
        <span className="label-text">SECTION 02</span>
        <span className="label-divider"></span>
        <span className="label-desc">LAYER STRUCTURE</span>
      </div>
    </section>
  );
};

export default LayerSeparation;
