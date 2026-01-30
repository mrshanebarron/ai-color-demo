import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Palette, Brain, Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Advanced color analysis and optimization'
    },
    {
      icon: Palette,
      title: 'Color Science',
      description: 'Based on proven color theory principles'
    },
    {
      icon: Sparkles,
      title: 'Personalized',
      description: 'Tailored to your mood and preferences'
    }
  ];

  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Features Section */}
        <div className="footer-features">
          <h3>Why Choose AI Color Studio?</h3>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="feature-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="feature-icon">
                    <Icon size={24} />
                  </div>
                  <div className="feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-section">
          <div className="security-badges">
            <div className="badge">
              <span className="badge-icon">🔒</span>
              <span>Secure Payments</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🚚</span>
              <span>Fast Shipping</span>
            </div>
            <div className="badge">
              <span className="badge-icon">↩️</span>
              <span>Easy Returns</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🎨</span>
              <span>Color Guarantee</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-brand">
            <div className="brand-logo">
              <Palette size={20} />
              <span>AI Color Studio</span>
            </div>
            <p className="brand-tagline">
              Transforming spaces through intelligent color science
            </p>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
              </ul>
            </div>

            <div className="link-group">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#shipping">Shipping Info</a></li>
              </ul>
            </div>

            <div className="link-group">
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <div className="copyright-text">
            <p>&copy; 2024 AI Color Studio. All rights reserved.</p>
          </div>

          <motion.div
            className="made-with-love"
            whileHover={{ scale: 1.05 }}
          >
            <span>Made with</span>
            <Heart size={16} fill="currentColor" />
            <span>and AI</span>
          </motion.div>

          <div className="payment-methods">
            <span className="payment-icon">💳</span>
            <span className="payment-icon">🅿️</span>
            <span className="payment-icon">🍎</span>
            <span className="payment-icon">📱</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;