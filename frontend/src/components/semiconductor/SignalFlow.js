import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SignalFlow = ({ lenisRef }) => {
  const sectionRef = useRef(null);
  const pulsesRef = useRef([]);
  const velocityRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: '+=200%',
        pin: true,
        onUpdate: (self) => {
          // Get Lenis velocity if available
          if (lenisRef?.current) {
            velocityRef.current = lenisRef.current.velocity;
          }
        },
      });

      // Animate pulses based on scroll velocity
      const animatePulses = () => {
        const velocity = Math.abs(velocityRef.current);
        const speed = Math.min(velocity * 0.1, 5);

        pulsesRef.current.forEach((pulse, index) => {
          if (pulse) {
            const progress = (Date.now() * 0.001 * speed + index * 0.3) % 1;
            const x = progress * 100;
            const opacity = Math.sin(progress * Math.PI) * 0.8;

            gsap.set(pulse, {
              x: `${x}%`,
              opacity: opacity,
              scale: 1 + Math.sin(progress * Math.PI) * 0.3,
            });
          }
        });

        requestAnimationFrame(animatePulses);
      };

      animatePulses();
    }, sectionRef);

    return () => ctx.revert();
  }, [lenisRef]);

  return (
    <section ref={sectionRef} className="signal-flow-section">
      <div className="signal-container">
        {/* Horizontal signal paths */}
        {[...Array(8)].map((_, pathIndex) => (
          <div
            key={pathIndex}
            className="signal-path"
            style={{
              '--path-index': pathIndex,
              top: `${15 + pathIndex * 10}%`,
            }}
          >
            <svg viewBox="0 0 1000 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`path-grad-${pathIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={`rgba(${100 + pathIndex * 10}, ${140 + pathIndex * 8}, ${180 + pathIndex * 10}, 0.2)`} />
                  <stop offset="50%" stopColor={`rgba(${120 + pathIndex * 10}, ${160 + pathIndex * 8}, ${200 + pathIndex * 10}, 0.4)`} />
                  <stop offset="100%" stopColor={`rgba(${100 + pathIndex * 10}, ${140 + pathIndex * 8}, ${180 + pathIndex * 10}, 0.2)`} />
                </linearGradient>
              </defs>
              
              <line
                x1="0"
                y1="10"
                x2="1000"
                y2="10"
                stroke={`url(#path-grad-${pathIndex})`}
                strokeWidth="2"
              />
              
              {/* Connection nodes along path */}
              {[...Array(15)].map((_, i) => (
                <circle
                  key={i}
                  cx={50 + i * 65}
                  cy="10"
                  r="2.5"
                  fill={`rgba(${130 + pathIndex * 10}, ${170 + pathIndex * 8}, ${210 + pathIndex * 10}, 0.6)`}
                />
              ))}
            </svg>

            {/* Animated pulse */}
            <div
              ref={(el) => (pulsesRef.current[pathIndex] = el)}
              className="signal-pulse"
              style={{
                '--pulse-color': `rgba(${160 + pathIndex * 15}, ${200 + pathIndex * 10}, ${240 + pathIndex * 5}, 0.9)`,
              }}
            >
              <svg viewBox="0 0 30 30">
                <defs>
                  <radialGradient id={`pulse-grad-${pathIndex}`}>
                    <stop offset="0%" stopColor={`rgba(${180 + pathIndex * 15}, ${220 + pathIndex * 10}, ${255}, 1)`} />
                    <stop offset="50%" stopColor={`rgba(${160 + pathIndex * 15}, ${200 + pathIndex * 10}, ${240 + pathIndex * 5}, 0.8)`} />
                    <stop offset="100%" stopColor={`rgba(${140 + pathIndex * 15}, ${180 + pathIndex * 10}, ${220 + pathIndex * 5}, 0)`} />
                  </radialGradient>
                  
                  <filter id={`pulse-glow-${pathIndex}`}>
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                <circle
                  cx="15"
                  cy="15"
                  r="12"
                  fill={`url(#pulse-grad-${pathIndex})`}
                  filter={`url(#pulse-glow-${pathIndex})`}
                />
                <circle
                  cx="15"
                  cy="15"
                  r="5"
                  fill={`rgba(${200 + pathIndex * 15}, ${240 + pathIndex * 10}, ${255}, 1)`}
                />
              </svg>
            </div>
          </div>
        ))}

        {/* Vertical interconnects */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="signal-interconnect"
            style={{
              left: `${20 + i * 15}%`,
            }}
          >
            <svg viewBox="0 0 4 100" preserveAspectRatio="none">
              <line
                x1="2"
                y1="0"
                x2="2"
                y2="100"
                stroke={`rgba(${120 + i * 10}, ${150 + i * 8}, ${190 + i * 10}, 0.3)`}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        ))}
      </div>

      <div className="velocity-indicator">
        <span className="indicator-label">SIGNAL VELOCITY</span>
        <div className="indicator-bar">
          <div className="indicator-fill"></div>
        </div>
      </div>

      <div className="section-label">
        <span className="label-text">SECTION 04</span>
        <span className="label-divider"></span>
        <span className="label-desc">SIGNAL PROPAGATION</span>
      </div>
    </section>
  );
};

export default SignalFlow;
