import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TransistorFocus = () => {
  const sectionRef = useRef(null);
  const transistorRef = useRef(null);
  const gatesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: '+=140%',
          scrub: true,
          pin: true,
        },
      });

      // Slow, deliberate zoom into transistor region
      tl.to(transistorRef.current, {
        scale: 3.5,
        duration: 1,
        ease: 'power1.inOut',
      });

      // Fade background layers
      tl.to(
        '.background-layers',
        {
          opacity: 0.1,
          filter: 'blur(8px) saturate(0.3)',
          duration: 0.8,
        },
        0.2
      );

      // Sequentially highlight logic gates
      gatesRef.current.forEach((gate, index) => {
        tl.to(
          gate,
          {
            opacity: 1,
            scale: 1,
            filter: 'drop-shadow(0 0 4px rgba(160, 200, 240, 0.8))',
            duration: 0.3,
            ease: 'power2.out',
          },
          0.4 + index * 0.15
        );
      });

      // Subtle pulse on active gates
      tl.to(
        gatesRef.current,
        {
          opacity: 0.7,
          duration: 0.5,
          repeat: 2,
          yoyo: true,
          ease: 'sine.inOut',
        },
        '+=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="transistor-focus-section">
      <div className="background-layers">
        <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="bg-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <line x1="0" y1="15" x2="30" y2="15" stroke="rgba(100, 120, 140, 0.1)" strokeWidth="0.5" />
              <line x1="15" y1="0" x2="15" y2="30" stroke="rgba(100, 120, 140, 0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1000" height="800" fill="url(#bg-grid)" />
        </svg>
      </div>

      <div ref={transistorRef} className="transistor-container">
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="transistor-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(120, 150, 190, 0.4)" />
              <stop offset="50%" stopColor="rgba(100, 130, 170, 0.6)" />
              <stop offset="100%" stopColor="rgba(80, 110, 150, 0.4)" />
            </linearGradient>

            <filter id="transistor-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.5)" />
            </filter>

            <filter id="gate-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main transistor body */}
          <g className="transistor-main">
            {/* Substrate */}
            <rect
              x="50"
              y="200"
              width="300"
              height="60"
              fill="url(#transistor-body)"
              stroke="rgba(140, 170, 210, 0.6)"
              strokeWidth="2"
              filter="url(#transistor-shadow)"
            />

            {/* Gate oxide */}
            <rect
              x="170"
              y="180"
              width="60"
              height="20"
              fill="rgba(110, 140, 180, 0.5)"
              stroke="rgba(130, 160, 200, 0.7)"
              strokeWidth="1.5"
            />

            {/* Gate electrode */}
            <rect
              x="180"
              y="140"
              width="40"
              height="40"
              fill="rgba(140, 170, 210, 0.7)"
              stroke="rgba(160, 190, 230, 0.8)"
              strokeWidth="2"
              filter="url(#transistor-shadow)"
            />

            {/* Source */}
            <rect
              x="80"
              y="190"
              width="60"
              height="30"
              fill="rgba(100, 130, 170, 0.6)"
              stroke="rgba(120, 150, 190, 0.7)"
              strokeWidth="1.5"
            />

            {/* Drain */}
            <rect
              x="260"
              y="190"
              width="60"
              height="30"
              fill="rgba(100, 130, 170, 0.6)"
              stroke="rgba(120, 150, 190, 0.7)"
              strokeWidth="1.5"
            />

            {/* Connection lines */}
            <line x1="200" y1="140" x2="200" y2="100" stroke="rgba(150, 180, 220, 0.8)" strokeWidth="3" />
            <line x1="110" y1="190" x2="110" y2="160" stroke="rgba(150, 180, 220, 0.8)" strokeWidth="3" />
            <line x1="290" y1="190" x2="290" y2="160" stroke="rgba(150, 180, 220, 0.8)" strokeWidth="3" />

            {/* Terminal nodes */}
            <circle cx="200" cy="100" r="6" fill="rgba(180, 210, 250, 0.9)" />
            <circle cx="110" cy="160" r="6" fill="rgba(180, 210, 250, 0.9)" />
            <circle cx="290" cy="160" r="6" fill="rgba(180, 210, 250, 0.9)" />
          </g>

          {/* Logic gates (highlighted sequentially) */}
          {[
            { x: 200, y: 80, label: 'G' },
            { x: 110, y: 140, label: 'S' },
            { x: 290, y: 140, label: 'D' },
          ].map((gate, index) => (
            <g
              key={index}
              ref={(el) => (gatesRef.current[index] = el)}
              style={{ opacity: 0, scale: 0.8 }}
            >
              <circle
                cx={gate.x}
                cy={gate.y}
                r="18"
                fill="rgba(140, 180, 220, 0.2)"
                stroke="rgba(160, 200, 240, 0.8)"
                strokeWidth="2"
                filter="url(#gate-glow)"
              />
              <text
                x={gate.x}
                y={gate.y + 5}
                textAnchor="middle"
                fill="rgba(200, 230, 255, 0.95)"
                fontSize="14"
                fontFamily="monospace"
                fontWeight="600"
              >
                {gate.label}
              </text>
            </g>
          ))}

          {/* Depletion regions */}
          <ellipse
            cx="140"
            cy="205"
            rx="25"
            ry="15"
            fill="rgba(120, 150, 200, 0.2)"
            stroke="rgba(130, 160, 210, 0.4)"
            strokeWidth="1"
            strokeDasharray="3,2"
          />
          <ellipse
            cx="260"
            cy="205"
            rx="25"
            ry="15"
            fill="rgba(120, 150, 200, 0.2)"
            stroke="rgba(130, 160, 210, 0.4)"
            strokeWidth="1"
            strokeDasharray="3,2"
          />
        </svg>

        {/* Technical annotations */}
        <div className="annotations">
          <div className="annotation" style={{ top: '20%', left: '50%' }}>
            <span className="annotation-label">GATE</span>
            <span className="annotation-value">5nm</span>
          </div>
          <div className="annotation" style={{ top: '50%', left: '20%' }}>
            <span className="annotation-label">SOURCE</span>
            <span className="annotation-value">N+</span>
          </div>
          <div className="annotation" style={{ top: '50%', right: '20%' }}>
            <span className="annotation-label">DRAIN</span>
            <span className="annotation-value">N+</span>
          </div>
        </div>
      </div>

      <div className="section-label">
        <span className="label-text">SECTION 05</span>
        <span className="label-divider"></span>
        <span className="label-desc">TRANSISTOR LOGIC</span>
      </div>
    </section>
  );
};

export default TransistorFocus;
