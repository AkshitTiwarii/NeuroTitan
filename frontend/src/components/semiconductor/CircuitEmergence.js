import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CircuitEmergence = () => {
  const sectionRef = useRef(null);
  const circuitsRef = useRef([]);
  const nodesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: '+=180%',
          scrub: true,
          pin: true,
        },
      });

      // Stagger circuit drawing across layers
      circuitsRef.current.forEach((circuit, index) => {
        const paths = circuit.querySelectorAll('.circuit-path');
        
        paths.forEach((path, pathIndex) => {
          const length = path.getTotalLength();
          
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: 'none',
            },
            index * 0.15 + pathIndex * 0.1
          );
        });
      });

      // Fade in nodes after circuits are drawn
      tl.to(
        nodesRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.02,
        },
        '-=0.5'
      );

      // Add subtle glow to completion points
      tl.to(
        '.circuit-node-complete',
        {
          filter: 'drop-shadow(0 0 3px rgba(160, 200, 240, 0.8))',
          duration: 0.5,
          stagger: 0.03,
        },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Generate circuit path data
  const generateCircuitPaths = (layer, count) => {
    const paths = [];
    for (let i = 0; i < count; i++) {
      const startX = 50 + (i % 4) * 200;
      const startY = 50 + Math.floor(i / 4) * 100;
      const endX = startX + 150 + Math.random() * 50;
      const endY = startY + (Math.random() - 0.5) * 60;
      const midX = (startX + endX) / 2;
      const midY = startY + (Math.random() - 0.5) * 40;

      paths.push({
        d: `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`,
        startX,
        startY,
        endX,
        endY,
      });
    }
    return paths;
  };

  return (
    <section ref={sectionRef} className="circuit-emergence-section">
      <div className="circuits-container">
        {[...Array(4)].map((_, layerIndex) => {
          const paths = generateCircuitPaths(layerIndex, 8);
          
          return (
            <div
              key={layerIndex}
              ref={(el) => (circuitsRef.current[layerIndex] = el)}
              className="circuit-layer"
              style={{
                '--layer-index': layerIndex,
                zIndex: 10 - layerIndex,
              }}
            >
              <svg viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <filter id={`circuit-glow-${layerIndex}`}>
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Circuit paths */}
                {paths.map((path, i) => (
                  <g key={i}>
                    <path
                      className="circuit-path"
                      d={path.d}
                      fill="none"
                      stroke={`rgba(${130 + layerIndex * 15}, ${160 + layerIndex * 10}, ${200 + layerIndex * 8}, 0.7)`}
                      strokeWidth="1.5"
                      filter={`url(#circuit-glow-${layerIndex})`}
                    />
                    
                    {/* Start node */}
                    <circle
                      ref={(el) => nodesRef.current.push(el)}
                      cx={path.startX}
                      cy={path.startY}
                      r="3"
                      fill={`rgba(${140 + layerIndex * 15}, ${170 + layerIndex * 10}, ${210 + layerIndex * 8}, 0.8)`}
                      className="circuit-node"
                      style={{ opacity: 0, scale: 0 }}
                    />
                    
                    {/* End node */}
                    <circle
                      ref={(el) => nodesRef.current.push(el)}
                      className="circuit-node circuit-node-complete"
                      cx={path.endX}
                      cy={path.endY}
                      r="4"
                      fill={`rgba(${160 + layerIndex * 15}, ${190 + layerIndex * 10}, ${230 + layerIndex * 8}, 0.9)`}
                      style={{ opacity: 0, scale: 0 }}
                    />
                  </g>
                ))}
              </svg>
            </div>
          );
        })}
      </div>

      <div className="section-label">
        <span className="label-text">SECTION 03</span>
        <span className="label-divider"></span>
        <span className="label-desc">CIRCUIT PATHWAYS</span>
      </div>
    </section>
  );
};

export default CircuitEmergence;
