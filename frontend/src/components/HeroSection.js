import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Disable parallax on mobile for performance
  const y = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], isMobile ? [1, 1] : [1, 0]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden" 
      style={{ 
        y: isMobile ? 0 : y, 
        opacity: isMobile ? 1 : opacity,
        background: '#000000', 
        touchAction: 'pan-y',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitPerspective: 1000,
        perspective: 1000,
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.015]" style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)', 
          backgroundSize: '100px 100px',
          transform: 'translateZ(0)',
          willChange: 'opacity'
        }} />
      </div>

      {/* Spline 3D Boxes - Desktop Only */}
      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ 
          zIndex: 1,
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1, 
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.8 }
            }}
            style={{ 
              width: '100%',
              height: '100%',
              filter: 'brightness(0.8) saturate(0.7)',
              position: 'relative',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              willChange: 'opacity, transform'
            }}
          >
            <iframe 
              src='https://my.spline.design/boxeshover-yJ6IQoM9vPsJSmSBejlKsVUV/' 
              frameBorder='0' 
              width='100%' 
              height='100%'
              style={{ 
                border: 'none',
                pointerEvents: 'auto',
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
                touchAction: 'pan-y',
                transform: 'translate3d(0, 0, 0)',
                WebkitTransform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
              title="3D Boxes Animation"
              loading="eager"
              allowFullScreen
            />
            
            {/* Complete bottom overlay to hide all watermarks */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              height: '120px',
              background: 'linear-gradient(to top, #000000 0%, #000000 60%, transparent 100%)',
              zIndex: 100,
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              willChange: 'opacity'
            }} />
            
            {/* Click blocker to prevent LinkedIn redirect */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              height: '60%',
              zIndex: 99,
              pointerEvents: 'auto',
              cursor: 'default',
              touchAction: 'pan-y',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }} />
          </motion.div>
        </div>
      )}

      {/* Mobile: Simple animated gradient background */}
      {isMobile && (
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.15) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite'
          }} />
        </div>
      )}

      <div className="relative z-10 w-full px-4 md:px-6 text-center" style={{ 
        position: 'relative', 
        zIndex: 10, 
        pointerEvents: 'none',
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}>
        <motion.div 
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ 
            duration: isMobile ? 0.3 : 0.7, 
            delay: isMobile ? 0 : 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }} 
          className="mb-6 md:mb-8">
          <motion.div 
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ 
              duration: isMobile ? 0.2 : 0.5, 
              delay: isMobile ? 0 : 0.2,
              ease: "easeOut"
            }} 
            className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2"
            style={{ transform: 'translateZ(0)' }}>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest" style={{ color: '#808080' }}>Advanced AI Research</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-6 md:mb-8 leading-none" style={{ 
            fontFamily: 'Space Grotesk, sans-serif', 
            color: '#FFFFFF', 
            letterSpacing: '-0.03em',
            transform: 'translateZ(0)',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}>
            NeuroTitan
          </h1>
          
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl mb-8 md:mb-12 leading-relaxed px-2 mx-auto" style={{ 
            fontFamily: 'Montserrat, sans-serif', 
            color: '#B8B8B8',
            transform: 'translateZ(0)',
            WebkitFontSmoothing: 'antialiased'
          }}>
            Building the future of artificial intelligence through open research, collaborative innovation, and cutting-edge technology
          </p>

          <motion.div 
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ 
              duration: isMobile ? 0.2 : 0.5, 
              delay: isMobile ? 0 : 0.3,
              ease: [0.25, 0.1, 0.25, 1]
            }} 
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center items-center" 
            style={{ 
              pointerEvents: 'auto',
              transform: 'translateZ(0)'
            }}>
            <a href="https://github.com/NeuroTitan-Hub" target="_blank" rel="noopener noreferrer" className="group w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium rounded-sm transition-all duration-200 active:scale-95 hover:shadow-lg" style={{ 
              background: '#FFFFFF', 
              color: '#000000', 
              border: '1px solid #FFFFFF', 
              touchAction: 'manipulation',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              willChange: 'transform, box-shadow'
            }}>
              <span className="inline-flex items-center gap-2">
                Explore Projects
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
            
            <a href="/semiconductor" className="group w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium rounded-sm transition-all duration-200 active:scale-95 hover:border-opacity-40" style={{ 
              background: 'transparent', 
              color: '#FFFFFF', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              touchAction: 'manipulation',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform, border-color'
            }}>
              <span className="inline-flex items-center gap-2">
                Semiconductor
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
            
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdbtblF3w5Nqnckn_gW1zs3ybf24725lcJaZOKR54gunskXcg/viewform?usp=publish-editor" className="group w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium rounded-sm transition-all duration-200 hover:scale-105 active:scale-95" style={{ 
              background: 'transparent', 
              color: '#FFFFFF', 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              touchAction: 'manipulation',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform, border-color'
            }}>
              <span className="inline-flex items-center gap-2">
                Apply as Campus Ambassador
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={isMobile ? { opacity: 1 } : { opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ 
            duration: isMobile ? 0.2 : 0.6, 
            delay: isMobile ? 0 : 0.4,
            ease: "easeOut"
          }} 
          className="mt-12 md:mt-20"
          style={{ transform: 'translateZ(0)' }}>
          <div className="flex flex-wrap gap-6 md:gap-12 justify-center items-center" style={{ 
            color: '#4A4A4A',
            transform: 'translateZ(0)'
          }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>50+</div>
              <div className="text-xs md:text-sm uppercase tracking-wider" style={{ color: '#808080' }}>Open Source Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>30+</div>
              <div className="text-xs md:text-sm uppercase tracking-wider" style={{ color: '#808080' }}>Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>500+</div>
              <div className="text-xs md:text-sm uppercase tracking-wider" style={{ color: '#808080' }}>Contributors</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce" style={{
        transform: 'translate(-50%, 0) translateZ(0)',
        willChange: 'transform'
      }}>
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="rgba(255, 255, 255, 0.3)" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </motion.section>
  );
};

export default HeroSection;
