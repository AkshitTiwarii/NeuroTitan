import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DataTypography = () => {
  const sectionRef = useRef(null);
  const dataPointsRef = useRef([]);
  const textElementsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: '+=120%',
          scrub: true,
          pin: true,
        },
      });

      // Wait for motion to stabilize before showing text
      tl.to({}, { duration: 0.3 });

      // Fade in data points first
      tl.to(
        dataPointsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        },
        0.3
      );

      // Then stagger in text elements (character-by-character effect)
      textElementsRef.current.forEach((element, index) => {
        if (element) {
          const chars = element.querySelectorAll('.char');
          tl.to(
            chars,
            {
              opacity: 1,
              y: 0,
              duration: 0.02,
              stagger: 0.03,
              ease: 'none',
            },
            0.6 + index * 0.15
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split text into characters for stagger effect
  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="char"
        style={{
          opacity: 0,
          transform: 'translateY(10px)',
          display: 'inline-block',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const dataPoints = [
    { label: 'PROCESS NODE', value: '5nm', unit: 'technology' },
    { label: 'TRANSISTOR COUNT', value: '57B', unit: 'devices' },
    { label: 'DIE SIZE', value: '826', unit: 'mm²' },
    { label: 'POWER EFFICIENCY', value: '2.1', unit: 'GFLOPS/W' },
    { label: 'CLOCK SPEED', value: '2.5', unit: 'GHz' },
    { label: 'THERMAL DESIGN', value: '350', unit: 'W' },
  ];

  return (
    <section ref={sectionRef} className="data-typography-section">
      <div className="data-container">
        {/* Grid background */}
        <div className="data-grid">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="data-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="0" y1="30" x2="60" y2="30" stroke="rgba(100, 120, 150, 0.1)" strokeWidth="0.5" />
                <line x1="30" y1="0" x2="30" y2="60" stroke="rgba(100, 120, 150, 0.1)" strokeWidth="0.5" />
                <circle cx="30" cy="30" r="1" fill="rgba(120, 140, 170, 0.3)" />
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#data-grid)" />
          </svg>
        </div>

        {/* Data points */}
        <div className="data-points-grid">
          {dataPoints.map((point, index) => (
            <div
              key={index}
              ref={(el) => (dataPointsRef.current[index] = el)}
              className="data-point"
              style={{
                opacity: 0,
                transform: 'translateY(20px)',
              }}
            >
              <div className="data-point-indicator">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="rgba(130, 160, 200, 0.3)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="4"
                    fill="rgba(160, 190, 230, 0.8)"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="10"
                    fill="none"
                    stroke="rgba(140, 170, 210, 0.4)"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                </svg>
              </div>
              
              <div className="data-point-label">{point.label}</div>
              
              <div className="data-point-value">
                {point.value}
                <span className="data-point-unit">{point.unit}</span>
              </div>

              <div className="data-point-connection">
                <svg width="100%" height="2" preserveAspectRatio="none">
                  <line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="rgba(120, 150, 190, 0.4)"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Main typography elements */}
        <div className="typography-content">
          <h2
            ref={(el) => (textElementsRef.current[0] = el)}
            className="typography-heading"
          >
            {splitText('PRECISION AT SCALE')}
          </h2>

          <p
            ref={(el) => (textElementsRef.current[1] = el)}
            className="typography-subtext"
          >
            {splitText('BILLIONS OF TRANSISTORS')}
          </p>

          <p
            ref={(el) => (textElementsRef.current[2] = el)}
            className="typography-description"
          >
            {splitText('OPERATING IN PERFECT SYNCHRONICITY')}
          </p>
        </div>

        {/* Voltage scale indicator */}
        <div className="voltage-scale">
          <div className="scale-line"></div>
          {[...Array(9)].map((_, i) => (
            <div key={i} className="scale-mark" style={{ bottom: `${i * 12.5}%` }}>
              <span className="scale-value">{(i * 0.25).toFixed(2)}V</span>
            </div>
          ))}
        </div>

        {/* Nanometer scale reference */}
        <div className="nanometer-reference">
          <svg width="200" height="40" viewBox="0 0 200 40">
            <line x1="10" y1="20" x2="190" y2="20" stroke="rgba(140, 170, 210, 0.6)" strokeWidth="2" />
            <line x1="10" y1="15" x2="10" y2="25" stroke="rgba(140, 170, 210, 0.6)" strokeWidth="2" />
            <line x1="190" y1="15" x2="190" y2="25" stroke="rgba(140, 170, 210, 0.6)" strokeWidth="2" />
            <text x="100" y="12" textAnchor="middle" fill="rgba(160, 190, 230, 0.8)" fontSize="10" fontFamily="monospace">
              5 NANOMETERS
            </text>
          </svg>
        </div>
      </div>

      <div className="section-label">
        <span className="label-text">SECTION 06</span>
        <span className="label-divider"></span>
        <span className="label-desc">DATA INTEGRATION</span>
      </div>
    </section>
  );
};

export default DataTypography;
