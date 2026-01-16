import React from 'react';
import '../App.css';

const EchoPage = () => {
  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: '#000000' }}>
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

      {/* Back Button - Fixed at top */}
      <div className="fixed top-6 left-6 z-50">
        <a 
          href="/" 
          className="group inline-flex items-center gap-2 px-5 py-3 rounded-sm transition-all duration-300 hover:scale-105"
          style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF'
          }}
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span style={{ fontFamily: 'Montserrat, sans-serif' }}>Home</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
        {/* Header */}
        <div className="mb-24 text-center">
          <div className="inline-block mb-6 px-6 py-2">
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#999999', letterSpacing: '0.15em' }}>
              AI Research Project
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Echo
          </h1>
          <p className="text-xl md:text-2xl mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: '#CCCCCC' }}>
            AI-Powered Sentiment Analysis
          </p>
          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
            A Revolutionary Approach to Understanding Human Emotions Through Social Media
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-24">
          <div className="p-10 md:p-12 rounded-sm transition-all duration-500" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Overview
            </h2>
            <p className="text-lg leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', color: '#CCCCCC', lineHeight: '1.8' }}>
              Echo is a cutting-edge sentiment analysis platform that leverages advanced machine learning 
              and natural language processing techniques to analyze and understand human emotions expressed 
              through social media content. By processing vast amounts of data from platforms like Twitter, 
              Echo provides real-time insights into public sentiment, trends, and emotional patterns.
            </p>
          </div>
        </section>

        {/* Research Objectives */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Research Objectives
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group p-8 rounded-sm transition-all duration-500 hover:-translate-y-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div className="mb-6 text-4xl">🎯</div>
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                Sentiment Classification
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                Develop robust models to accurately classify text into sentiment categories (positive, 
                negative, neutral) using state-of-the-art deep learning architectures.
              </p>
            </div>
            <div className="group p-8 rounded-sm transition-all duration-500 hover:-translate-y-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div className="mb-6 text-4xl">⚡</div>
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                Real-Time Analysis
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                Process and analyze social media data in real-time to capture emerging trends and 
                sentiment shifts as they happen.
              </p>
            </div>
            <div className="group p-8 rounded-sm transition-all duration-500 hover:-translate-y-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div className="mb-6 text-4xl">💭</div>
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                Emotion Detection
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                Go beyond basic sentiment to identify specific emotions like joy, anger, fear, and 
                sadness with high accuracy.
              </p>
            </div>
            <div className="group p-8 rounded-sm transition-all duration-500 hover:-translate-y-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div className="mb-6 text-4xl">📊</div>
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                Trend Visualization
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                Provide intuitive visualizations and dashboards that make complex sentiment data 
                accessible and actionable for decision-makers.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Technical Approach
            </h2>
          </div>
          <div className="p-10 md:p-12 rounded-sm" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <ul className="space-y-8">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center mr-6 mt-1" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span className="font-bold" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>1</span>
                </div>
                <div>
                  <strong className="text-lg mb-2 block" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>Data Collection</strong>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                    Utilizing Twitter API and web scraping techniques to gather diverse datasets representative of various demographic groups and topics.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center mr-6 mt-1" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span className="font-bold" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>2</span>
                </div>
                <div>
                  <strong className="text-lg mb-2 block" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>Preprocessing</strong>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                    Advanced text cleaning, tokenization, and normalization using NLTK and spaCy libraries.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center mr-6 mt-1" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span className="font-bold" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>3</span>
                </div>
                <div>
                  <strong className="text-lg mb-2 block" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>Model Architecture</strong>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                    Implementing transformer-based models (BERT, RoBERTa) and deep learning architectures (LSTM, CNN) for sentiment classification.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center mr-6 mt-1" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span className="font-bold" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>4</span>
                </div>
                <div>
                  <strong className="text-lg mb-2 block" style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}>Evaluation</strong>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                    Comprehensive testing using accuracy, precision, recall, and F1-score metrics across multiple datasets.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Key Features
            </h2>
          </div>
          <div className="space-y-6">
            <div className="group p-8 rounded-sm transition-all duration-500 hover:-translate-y-1" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                <span className="text-2xl">🌍</span>
                Multi-Language Support
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                Analyze sentiment across multiple languages with specialized models trained for each language context.
              </p>
            </div>
            <div className="group p-8 rounded-sm transition-all duration-500 hover:-translate-y-1" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                <span className="text-2xl">🧠</span>
                Context-Aware Analysis
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                Understand nuances like sarcasm, irony, and cultural references through advanced contextual embeddings.
              </p>
            </div>
            <div className="group p-8 rounded-sm transition-all duration-500 hover:-translate-y-1" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                <span className="text-2xl">⚙️</span>
                Scalable Infrastructure
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
                Built on cloud-native architecture capable of processing millions of posts per day with low latency.
              </p>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Applications & Impact
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999', lineHeight: '1.8' }}>
              Echo's sentiment analysis capabilities have wide-ranging applications across multiple industries
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-10 rounded-sm transition-all duration-500 hover:-translate-y-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                Market Research
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999' }}>
                Brand monitoring and consumer insights
              </p>
            </div>
            <div className="group text-center p-10 rounded-sm transition-all duration-500 hover:-translate-y-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div className="text-5xl mb-6">🏥</div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                Public Health
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999' }}>
                Mental health trend detection
              </p>
            </div>
            <div className="group text-center p-10 rounded-sm transition-all duration-500 hover:-translate-y-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div className="text-5xl mb-6">🗳️</div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                Political Analysis
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#999999' }}>
                Public opinion tracking
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24">
          <div className="relative p-16 md:p-20 rounded-sm overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Experience Echo
              </h2>
              <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', color: '#CCCCCC', lineHeight: '1.8' }}>
                Ready to explore the power of AI-driven sentiment analysis? Visit the Echo platform 
                to see real-time sentiment analysis in action.
              </p>
              <a 
                href="https://echo.neurotitan.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-sm text-lg font-medium transition-all duration-300 hover:scale-105"
                style={{ 
                  background: '#FFFFFF', 
                  color: '#0e0e0eff',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                Launch Echo Platform
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EchoPage;
