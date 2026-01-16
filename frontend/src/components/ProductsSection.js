import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Play } from 'lucide-react';

const ProductsSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
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

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], isMobile ? [1, 1, 1, 1] : [0, 1, 1, 0]);

  const products = [
    {
      name: 'Echo',
      description: 'AI-powered sentiment analysis platform leveraging NLP to understand human emotions through social media',
      category: 'Research Project',
      status: 'Live',
      link: '/echo',
    },
    {
      name: 'NeuroChat AI',
      description: 'Advanced conversational AI platform with multi-modal capabilities for next-gen customer experiences',
      category: 'SaaS Platform',
      status: 'Live',
      link: '#',
    },
    {
      name: 'VisionAPI',
      description: 'Enterprise-grade computer vision API for real-time image analysis and intelligent object detection',
      category: 'API Service',
      status: 'Beta',
      link: '#',
    },
    {
      name: 'DataForge',
      description: 'AI-powered data preprocessing toolkit that transforms raw data into ML-ready datasets',
      category: 'Open Source',
      status: 'Live',
      link: '#',
    },
    {
      name: 'ModelHub',
      description: 'Curated repository of production-ready pre-trained models with one-click deployment',
      category: 'Platform',
      status: 'Live',
      link: '#',
    },
    {
      name: 'AutoML Studio',
      description: 'No-code machine learning pipeline builder that democratizes AI for everyone',
      category: 'SaaS Platform',
      status: 'Coming Soon',
      link: '#',
    },
    {
      name: 'NeuralOps',
      description: 'End-to-end MLOps platform for seamless model training, deployment, and monitoring at scale',
      category: 'Enterprise',
      status: 'Beta',
      link: '#',
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return { bg: 'rgba(255, 255, 255, 0.06)', border: 'rgba(255, 255, 255, 0.2)', text: '#FFFFFF' };
      case 'Beta': return { bg: 'rgba(255, 255, 255, 0.04)', border: 'rgba(255, 255, 255, 0.15)', text: '#CCCCCC' };
      case 'Coming Soon': return { bg: 'rgba(255, 255, 255, 0.02)', border: 'rgba(255, 255, 255, 0.1)', text: '#999999' };
      default: return { bg: 'rgba(255, 255, 255, 0.04)', border: 'rgba(255, 255, 255, 0.1)', text: '#CCCCCC' };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.12,
        delayChildren: isMobile ? 0.1 : 0.2,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.7,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="products-section py-32 px-6 relative"
      style={{ background: '#000000' }}
      data-testid="products-section"
    >
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

      <motion.div style={{ opacity }} className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
              OUR PRODUCTS
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}
            data-testid="products-title"
          >
            Products & Tools
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: '#CCCCCC', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.8' }}
          >
            Production-ready AI solutions trusted by developers and enterprises worldwide
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => {
            const statusStyle = getStatusColor(product.status);
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="product-card-new group relative"
                data-testid={`product-card-${index}`}
              >
                <motion.div
                  className="p-8 rounded-sm h-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                  whileHover={isMobile ? {} : { 
                    y: -8,
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                  }}
                >
                  <div className="relative z-10">
                    {/* Category & Status */}
                    <motion.div 
                      className="flex items-center justify-between mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      <span 
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: '#999999', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em' }}
                      >
                        {product.category}
                      </span>
                      <motion.span 
                        className="px-3 py-1 rounded-sm text-xs font-semibold"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {product.status}
                      </motion.span>
                    </motion.div>

                    {/* Product Name */}
                    <motion.h3 
                      className="text-2xl font-bold mb-4 transition-colors duration-300"
                      style={{ 
                        color: '#FFFFFF',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    >
                      {product.name}
                    </motion.h3>

                    {/* Description */}
                    <motion.p 
                      className="text-sm leading-relaxed mb-8"
                      style={{ color: '#AAAAAA', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.7', fontSize: '15px' }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    >
                      {product.description}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div 
                      className="flex gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? 0 : index * 0.1 + 0.6 }}
                    >
                      <motion.a
                        href={product.link}
                        whileHover={isMobile ? {} : { 
                          scale: 1.02,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-sm text-sm font-semibold"
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          fontFamily: 'Montserrat, sans-serif',
                          textDecoration: 'none'
                        }}
                        data-testid={`explore-btn-${index}`}
                      >
                        <ExternalLink size={14} />
                        Explore
                      </motion.a>
                      {product.status === 'Live' && (
                        <motion.a
                          href={product.link}
                          whileHover={isMobile ? {} : { 
                            scale: 1.02,
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 px-5 py-3 rounded-sm text-sm font-semibold"
                          style={{
                            background: 'transparent',
                            color: '#B8B8B8',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontFamily: 'Montserrat, sans-serif',
                            textDecoration: 'none'
                          }}
                          data-testid={`demo-btn-${index}`}
                        >
                          <Play size={14} />
                          Demo
                        </motion.a>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductsSection;