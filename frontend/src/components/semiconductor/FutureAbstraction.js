import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FutureAbstraction = () => {
  const sectionRef = useRef(null);
  const geometryRef = useRef([]);
  const linesRef = useRef([]);
  const pointsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom bottom',
          scrub: true,
          pin: false,
          onLeave: () => {
            // Increase damping at the end for slower scroll
            if (window.lenis) {
              gsap.to(window.lenis, {
                duration: 1,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
              });
            }
          },
        },
      });

      // Gradual geometry simplification
      geometryRef.current.forEach((geom, index) => {
        tl.to(
          geom,
          {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(2px)',
            duration: 0.3,
            ease: 'power1.in',
          },
          index * 0.1
        );
      });

      // Lines straighten and fade
      tl.to(
        linesRef.current,
        {
          strokeDashoffset: (i, target) => {
            const length = target.getTotalLength();
            return length;
          },
          opacity: 0.2,
          duration: 0.8,
          ease: 'power1.inOut',
        },
        0.2
      );

      // Points dissolve
      tl.to(
        pointsRef.current,
        {
          opacity: 0,
          scale: 0.3,
          duration: 0.5,
          stagger: 0.02,
          ease: 'power2.in',
        },
        0.4
      );

      // Final fade to minimal state
      tl.to(
        sectionRef.current,
        {
          backgroundColor: 'rgba(8, 12, 18, 1)',
          duration: 0.6,
          ease: 'power1.inOut',
        },
        0.6
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Generate random point positions
  const generatePoints = (count) => {
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
      });
    }
    return points;
  };

  const points = generatePoints(50);

  return (
    <section ref={sectionRef} className="future-abstraction-section">
      <div className="abstraction-container">
        {/* Complex geometries that dissolve */}
        <svg className="geometry-layer" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="abstraction-glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="fade-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(120, 150, 190, 0.4)" />
              <stop offset="100%" stopColor="rgba(80, 110, 150, 0.1)" />
            </linearGradient>
          </defs>

          {/* Geometric shapes */}
          {[
            { type: 'polygon', points: '200,100 300,150 250,250 150,200', index: 0 },
            { type: 'polygon', points: '700,200 850,250 800,400 650,350', index: 1 },
            { type: 'polygon', points: '400,500 550,550 500,650 350,600', index: 2 },
            { type: 'circle', cx: 900, cy: 600, r: 80, index: 3 },
            { type: 'rect', x: 100, y: 550, width: 150, height: 150, index: 4 },
          ].map((shape, i) => {
            if (shape.type === 'polygon') {
              return (
                <polygon
                  key={i}
                  ref={(el) => (geometryRef.current[shape.index] = el)}
                  points={shape.points}
                  fill="url(#fade-gradient)"
                  stroke="rgba(130, 160, 200, 0.4)"
                  strokeWidth="1.5"
                  filter="url(#abstraction-glow)"
                />
              );
            } else if (shape.type === 'circle') {
              return (
                <circle
                  key={i}
                  ref={(el) => (geometryRef.current[shape.index] = el)}
                  cx={shape.cx}
                  cy={shape.cy}
                  r={shape.r}
                  fill="none"
                  stroke="rgba(130, 160, 200, 0.4)"
                  strokeWidth="1.5"
                  filter="url(#abstraction-glow)"
                />
              );
            } else {
              return (
                <rect
                  key={i}
                  ref={(el) => (geometryRef.current[shape.index] = el)}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill="none"
                  stroke="rgba(130, 160, 200, 0.4)"
                  strokeWidth="1.5"
                  filter="url(#abstraction-glow)"
                />
              );
            }
          })}

          {/* Connecting lines */}
          {[
            { x1: 225, y1: 175, x2: 775, y2: 275 },
            { x1: 775, y1: 275, x2: 475, y2: 575 },
            { x1: 475, y1: 575, x2: 900, y2: 600 },
            { x1: 175, y1: 625, x2: 425, y2: 575 },
          ].map((line, i) => (
            <line
              key={i}
              ref={(el) => (linesRef.current[i] = el)}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(120, 150, 190, 0.3)"
              strokeWidth="1"
              strokeDasharray="5,5"
              style={{
                strokeDashoffset: 0,
              }}
            />
          ))}
        </svg>

        {/* Point field */}
        <svg className="points-layer" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {points.map((point, i) => (
            <circle
              key={i}
              ref={(el) => (pointsRef.current[i] = el)}
              cx={point.x}
              cy={point.y}
              r={point.size}
              fill={`rgba(${140 + Math.random() * 40}, ${170 + Math.random() * 40}, ${210 + Math.random() * 40}, ${0.3 + Math.random() * 0.4})`}
            />
          ))}
        </svg>

        {/* Final message */}
        <div className="final-message">
          <div className="message-line">
            <span className="message-text">SYSTEM</span>
            <span className="message-divider"></span>
            <span className="message-status">COMPLETE</span>
          </div>
          
          <div className="message-timestamp">
            {new Date().toISOString().split('T')[0]}
          </div>

          <div className="message-coordinates">
            <span>37.7749°N</span>
            <span className="coord-separator">×</span>
            <span>122.4194°W</span>
          </div>
        </div>
      </div>

      <div className="section-label">
        <span className="label-text">SECTION 07</span>
        <span className="label-divider"></span>
        <span className="label-desc">FUTURE STATE</span>
      </div>
    </section>
  );
};

export default FutureAbstraction;
