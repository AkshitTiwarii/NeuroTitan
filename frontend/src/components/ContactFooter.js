import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { FaQuora, FaPinterest } from 'react-icons/fa';
import { useRef } from 'react';

// Get current year for copyright
const getCurrentYear = () => {
  return new Date().getFullYear();
};

const ContactFooter = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 1]);

  const socialLinks = [
    { name: 'GitHub', icon: '🔗', url: 'https://github.com/NeuroTitan-Hub' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com' },
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://instagram.com' },
    { name: 'Quora', icon: <FaQuora size={20} />, url: 'https://quora.com' },
    { name: 'Pinterest', icon: <FaPinterest size={20} />, url: 'https://pinterest.com' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <footer ref={sectionRef} className="relative py-20 px-6 overflow-hidden" style={{ background: '#000000', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)', 
            backgroundSize: '100px 100px' 
          }} 
        />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
            viewport={{ once: true }} 
            className="text-4xl md:text-5xl font-bold mb-6" 
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}
          >
            Get In Touch
          </motion.h2>
          
          <motion.a 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} 
            viewport={{ once: true }} 
            href="mailto:neurotitancontact@gmail.com" 
            className="inline-flex items-center gap-3 text-lg md:text-xl font-medium group" 
            style={{ color: '#CCCCCC', textDecoration: 'none' }}
            whileHover={{ 
              y: -2,
              transition: { duration: 0.2 }
            }}
          >
            <Mail size={24} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="group-hover:text-white transition-colors">neurotitancontact@gmail.com</span>
          </motion.a>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {socialLinks.map((social, index) => (
            <motion.a 
              key={index} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              variants={itemVariants}
              className="flex items-center gap-3 px-6 py-3 rounded-sm group" 
              style={{ border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.02)', textDecoration: 'none' }}
              whileHover={{ 
                y: -4,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
            >
              <span className="opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: '#FFFFFF' }}>{social.icon}</span>
              <span className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: '#CCCCCC' }}>{social.name}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 pt-8"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <h3 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>Our Team</h3>
          
          {/* Founder */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#666666', letterSpacing: '0.15em' }}>Founder</p>
            <motion.a
              href="https://github.com/Satyabrat2005"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg font-medium"
              style={{ color: '#CCCCCC', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}
              whileHover={{ 
                color: '#FFFFFF',
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <span>Satyabrat Sahu</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </motion.a>
          </div>

          {/* Co-Founders */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#666666', letterSpacing: '0.15em' }}>Co-Founder</p>
            <div className="flex flex-wrap justify-center gap-6">
              {/* <motion.a
                href="https://github.com/kartik1446"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-medium"
                style={{ color: '#999999', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif' }}
                whileHover={{ 
                  color: '#FFFFFF',
                  y: -2,
                  transition: { duration: 0.2 }
                }}
              >
                <span></span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a> */}
              
              <motion.a
                href="https://github.com/GitGudScrubss"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-medium"
                style={{ color: '#999999', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif' }}
                whileHover={{ 
                  color: '#FFFFFF',
                  y: -2,
                  transition: { duration: 0.2 }
                }}
              >
                <span>Ashutosh Rath</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.div>

        <div className="pt-12" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="grid md:grid-cols-3 gap-12 mb-12"
          >
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>NeuroTitan</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', color: '#AAAAAA', lineHeight: '1.7' }}>Building the future of artificial intelligence through open research and innovation</p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: '#CCCCCC', letterSpacing: '0.1em' }}>Quick Links</h4>
              <ul className="space-y-2">
                {['About', 'Research', 'Products', 'Community', 'Campus Ambassador'].map((link, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <motion.a 
                      href={link === 'Campus Ambassador' ? 'https://docs.google.com/forms/d/e/1FAIpQLSdbtblF3w5Nqnckn_gW1zs3ybf24725lcJaZOKR54gunskXcg/viewform?usp=publish-editor' : `#${link.toLowerCase().replace(/ /g, '-')}`} 
                      className="text-sm hover:underline" 
                      style={{ color: '#AAAAAA' }}
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: '#CCCCCC', letterSpacing: '0.1em' }}>Resources</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Documentation', url: '#' },
                  { name: 'Blog', url: '#' },
                  { name: 'GitHub', url: 'https://github.com/NeuroTitan-Hub' },
                  { name: 'Discord', url: '#' }
                ].map((link, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <motion.a 
                      href={link.url}
                      target={link.name === 'GitHub' ? '_blank' : undefined}
                      rel={link.name === 'GitHub' ? 'noopener noreferrer' : undefined}
                      className="text-sm" 
                      style={{ color: '#999999', textDecoration: 'none' }}
                      whileHover={{ 
                        color: '#FFFFFF',
                        x: 4,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center pt-8" 
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <p className="text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif', color: '#4A4A4A' }}>© {getCurrentYear()} NeuroTitan. All rights reserved. Built with precision.</p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-sm"
              style={{ fontFamily: 'Montserrat, sans-serif', color: '#666666' }}
            >
              <span>Developed by</span>
              <motion.a 
                href="https://github.com/AkshitTiwarii"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
                style={{ color: '#999999', textDecoration: 'none' }}
                whileHover={{ 
                  color: '#FFFFFF',
                  transition: { duration: 0.2 }
                }}
              >
                <span>Akshit Tiwari</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              <span>&</span>
              <motion.a 
                href="https://github.com/Rajan167030"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
                style={{ color: '#999999', textDecoration: 'none' }}
                whileHover={{ 
                  color: '#FFFFFF',
                  transition: { duration: 0.2 }
                }}
              >
                <span>Rajan Jha</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};

export default ContactFooter;
