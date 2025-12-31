import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initChipScene } from '../hooks/useChipScene';
import '../styles/Semiconductor.css';

gsap.registerPlugin(ScrollTrigger);

const SemiconductorPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize Three.js scene
    const cleanupThree = initChipScene();

    const ctx = gsap.context(() => {

      // Typography expansion
      gsap.to('.hero-title', {
        letterSpacing: '0.15em',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: '+=100%',
          scrub: true
        }
      });

      // WAFER SECTION: Parallax, Not Entrance
      gsap.timeline({
        scrollTrigger: {
          trigger: '.wafer-section',
          start: 'top center',
          end: '+=150%',
          scrub: true
        }
      })
      .from('.wafer-svg circle', {
        rotation: -5,
        transformOrigin: '50% 50%'
      })
      .from('.wafer-svg rect', {
        opacity: 0,
        stagger: 0.01
      }, '<')
      .from('.wafer-section .section-description', {
        opacity: 0
      });

      // TRANSISTOR SECTION: Educational Zoom
      gsap.timeline({
        scrollTrigger: {
          trigger: '.transistor-section',
          start: 'top center',
          end: '+=120%',
          scrub: true
        }
      })
      .from('.transistor-visual svg', {
        scale: 0.85,
        transformOrigin: '50% 60%'
      })
      .from(
        '.transistor-visual text',
        { opacity: 0, stagger: 0.1 },
        '-=0.2'
      );

      // CIRCUIT LAYERS: Real Semiconductor Motion (Z-separation)
      gsap.to('.circuit-layer', {
        scrollTrigger: {
          trigger: '.layers-section',
          start: 'top center',
          end: '+=120%',
          scrub: true
        },
        y: (i) => i * -30,
        opacity: 1,
        stagger: 0.1
      });

      // DATA CARDS: Make visible immediately
      gsap.set('.data-card', {
        opacity: 1,
        scale: 1
      });

      // Make sections initially visible (except hero children)
      gsap.set(['.wafer-section', '.transistor-section', '.layers-section', '.data-section', '.footer-section'], {
        opacity: 1
      });

    }, containerRef);

    return () => {
      cleanupThree?.();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="semiconductor-container">
      {/* Hero Section */}
      <section className="semiconductor-section hero-section">
        <canvas id="chip-canvas" />
        <h1 className="hero-title">
          SEMICONDUCTOR
          <span>ARCHITECTURE</span>
        </h1>
      </section>

      {/* Wafer Section */}
      <section className="semiconductor-section wafer-section">
        <div className="section-content">
          <h2 className="section-title">SILICON WAFER FABRICATION</h2>
          <div className="wafer-visual">
            <svg viewBox="0 0 500 500" className="wafer-svg">
              <defs>
                <pattern id="waferGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1" fill="rgba(107, 107, 111, 0.4)" />
                  <line x1="0" y1="15" x2="30" y2="15" stroke="rgba(42, 42, 46, 0.2)" strokeWidth="0.5" />
                  <line x1="15" y1="0" x2="15" y2="30" stroke="rgba(42, 42, 46, 0.2)" strokeWidth="0.5" />
                </pattern>
              </defs>
              
              <circle cx="250" cy="250" r="200" 
                      fill="url(#waferGrid)" 
                      stroke="rgba(42, 42, 46, 0.5)" 
                      strokeWidth="2" />
              
              {/* Die regions */}
              {[...Array(6)].map((_, row) => 
                [...Array(6)].map((_, col) => (
                  <rect 
                    key={`${row}-${col}`}
                    x={80 + col * 60} 
                    y={80 + row * 60} 
                    width="50" 
                    height="50"
                    fill="rgba(11, 12, 16, 0.3)"
                    stroke="rgba(193, 18, 31, 0.2)"
                    strokeWidth="1"
                  />
                ))
              )}
            </svg>
          </div>
          <p className="section-description">
            300mm silicon wafers containing hundreds of individual dies,
            each with billions of transistors operating in perfect synchronicity.
          </p>
        </div>
      </section>

      {/* Transistor Section */}
      <section className="semiconductor-section transistor-section">
        <div className="section-content">
          <h2 className="section-title">TRANSISTOR ARCHITECTURE</h2>
          <div className="transistor-visual">
            <svg viewBox="0 0 400 300">
              {/* Substrate */}
              <rect x="50" y="200" width="300" height="60" 
                    fill="rgba(5, 5, 7, 0.8)" 
                    stroke="rgba(42, 42, 46, 0.6)" 
                    strokeWidth="2" />
              
              {/* Gate oxide */}
              <rect x="170" y="180" width="60" height="20" 
                    fill="rgba(11, 12, 16, 0.5)" 
                    stroke="rgba(107, 107, 111, 0.7)" 
                    strokeWidth="1.5" />
              
              {/* Gate */}
              <rect x="180" y="140" width="40" height="40" 
                    fill="rgba(139, 0, 0, 0.4)" 
                    stroke="rgba(193, 18, 31, 0.8)" 
                    strokeWidth="2" />
              
              {/* Source and Drain */}
              <rect x="80" y="190" width="60" height="30" 
                    fill="rgba(11, 12, 16, 0.5)" 
                    stroke="rgba(42, 42, 46, 0.7)" 
                    strokeWidth="1.5" />
              <rect x="260" y="190" width="60" height="30" 
                    fill="rgba(11, 12, 16, 0.5)" 
                    stroke="rgba(42, 42, 46, 0.7)" 
                    strokeWidth="1.5" />
              
              {/* Connection lines */}
              <line x1="200" y1="140" x2="200" y2="100" 
                    stroke="rgba(107, 107, 111, 0.8)" strokeWidth="3" />
              <line x1="110" y1="190" x2="110" y2="160" 
                    stroke="rgba(107, 107, 111, 0.8)" strokeWidth="3" />
              <line x1="290" y1="190" x2="290" y2="160" 
                    stroke="rgba(107, 107, 111, 0.8)" strokeWidth="3" />
              
              {/* Labels */}
              <text x="200" y="90" textAnchor="middle" fill="rgba(230, 230, 235, 0.9)" 
                    fontSize="14" fontFamily="monospace">GATE</text>
              <text x="110" y="150" textAnchor="middle" fill="rgba(230, 230, 235, 0.9)" 
                    fontSize="14" fontFamily="monospace">SOURCE</text>
              <text x="290" y="150" textAnchor="middle" fill="rgba(230, 230, 235, 0.9)" 
                    fontSize="14" fontFamily="monospace">DRAIN</text>
            </svg>
          </div>
          <div className="transistor-specs">
            <div className="spec-row">
              <span className="spec-name">Gate Length:</span>
              <span className="spec-data">5 nanometers</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Voltage:</span>
              <span className="spec-data">0.7V - 1.2V</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Switching Speed:</span>
              <span className="spec-data">~1 picosecond</span>
            </div>
          </div>
        </div>
      </section>

      {/* Circuit Layers Section */}
      <section className="semiconductor-section layers-section">
        <div className="section-content">
          <h2 className="section-title">MULTI-LAYER INTERCONNECTS</h2>
          <div className="layers-visual">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="circuit-layer" style={{ '--layer-index': i }}>
                <svg viewBox="0 0 600 80">
                  <line x1="50" y1="40" x2="550" y2="40" 
                        stroke={i % 2 === 0 ? "rgba(42, 42, 46, 0.6)" : "rgba(193, 18, 31, 0.4)"} 
                        strokeWidth="2" />
                  {[...Array(10)].map((_, j) => (
                    <circle key={j} cx={70 + j * 50} cy="40" r="3" 
                            fill={i % 2 === 0 ? "rgba(107, 107, 111, 0.8)" : "rgba(193, 18, 31, 0.6)"} />
                  ))}
                </svg>
                <span className="layer-label">LAYER {i + 1}</span>
              </div>
            ))}
          </div>
          <p className="section-description">
            Up to 15 metal interconnect layers route signals between billions of transistors,
            with line widths as small as 7 nanometers.
          </p>
        </div>
      </section>

      {/* Data Section */}
      <section className="semiconductor-section data-section">
        <div className="section-content">
          <h2 className="section-title">TECHNICAL SPECIFICATIONS</h2>
          <div className="spec-table">
            <div className="spec-row">
              <span className="spec-key">CLOCK FREQUENCY</span>
              <span className="spec-value">2.5 <em>GHz</em></span>
            </div>
            <div className="spec-row">
              <span className="spec-key">THERMAL DESIGN POWER</span>
              <span className="spec-value">350 <em>W</em></span>
            </div>
            <div className="spec-row">
              <span className="spec-key">ENERGY EFFICIENCY</span>
              <span className="spec-value">2.1 <em>GFLOPS/W</em></span>
            </div>
            <div className="spec-row">
              <span className="spec-key">FABRICATION YIELD</span>
              <span className="spec-value">99.9 <em>%</em></span>
            </div>
            <div className="spec-row">
              <span className="spec-key">PROCESS NODE</span>
              <span className="spec-value">5 <em>nm</em></span>
            </div>
            <div className="spec-row">
              <span className="spec-key">TRANSISTOR COUNT</span>
              <span className="spec-value">16.7 <em>billion</em></span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="semiconductor-section footer-section">
        <div className="footer-content">
          <div className="footer-line"></div>
          <p className="footer-text">
            PRECISION ENGINEERING · SILICON INNOVATION · NANOSCALE ARCHITECTURE
          </p>
          <div className="footer-coordinates">
            <span>37.7749°N</span>
            <span className="coord-separator">×</span>
            <span>122.4194°W</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SemiconductorPage;
