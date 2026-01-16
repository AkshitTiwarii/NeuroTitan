import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Unlock, Microscope, Users } from 'lucide-react';
import { useRef } from 'react';

const AboutSection = () => {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], isMobile ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], isMobile ? [1, 1] : [0.95, 1]);

  const pillars = [
    {
      icon: <Unlock size={48} strokeWidth={1.5} />,
      title: 'Open Source',
      description: 'Building the future of AI together through transparent, collaborative development',
      stat: '50+',
      statLabel: 'Projects',
    },
    {
      icon: <Microscope size={48} strokeWidth={1.5} />,
      title: 'Research Excellence',
      description: 'Pioneering breakthrough discoveries in neural architectures and AGI systems',
      stat: '30+',
      statLabel: 'Papers',
    },
    {
      icon: <Users size={48} strokeWidth={1.5} />,
      title: 'Global Community',
      description: 'Empowering developers worldwide to shape the next generation of AI',
      stat: '500+',
      statLabel: 'Contributors',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 60, scale: isMobile ? 1 : 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.4 : 0.8,
        ease: [0.22, 1, 0.36, 1], // Custom easing curve
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#000000' }}>
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      <motion.div style={{ opacity, scale }} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block mb-6 px-6 py-2"
          >
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#999999', letterSpacing: '0.15em' }}>
              About NeuroTitan
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" 
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}
          >
            The Future of AI
            <br />
            Starts Here
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" 
            style={{ fontFamily: 'Montserrat, sans-serif', color: '#CCCCCC', lineHeight: '1.8' }}
          >
            A decentralized ecosystem where cutting-edge research meets practical implementation,
            empowering the next wave of AI innovation
          </motion.p>
        </motion.div>

        {/* Three Pillars Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Premium Card */}
              <motion.div 
                className="relative h-full p-8 rounded-sm transition-all duration-500 ease-out" 
                style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                whileHover={isMobile ? {} : { 
                  y: -8,
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                }}
              >
                {/* Hover effect overlay */}
                <motion.div 
                  className="absolute inset-0 rounded-sm pointer-events-none"
                  style={{ border: '1px solid rgba(255, 255, 255, 0)' }}
                  whileHover={{ 
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    transition: { duration: 0.3 }
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={isMobile ? {} : { 
                      scale: 1.05,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-sm transition-all duration-300"
                    style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#FFFFFF' }}
                  >
                    {pillar.icon}
                  </motion.div>

                  {/* Stats Badge */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-baseline gap-2 mb-4"
                  >
                    <span className="text-4xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                      {pillar.stat}
                    </span>
                    <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#999999' }}>
                      {pillar.statLabel}
                    </span>
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-300" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                    {pillar.title}
                  </h3>

                  <p className="leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif', color: '#AAAAAA', lineHeight: '1.7', fontSize: '15px' }}>
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
