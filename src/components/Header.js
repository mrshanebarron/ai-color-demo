import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Brain, ShoppingBag, CreditCard } from 'lucide-react';
import './Header.css';

const Header = ({ currentStep, setCurrentStep }) => {
  const steps = [
    {
      id: 'selector',
      title: 'Colors',
      icon: Palette,
      description: 'Choose your palette'
    },
    {
      id: 'analyzer',
      title: 'AI Analysis',
      icon: Brain,
      description: 'AI optimization'
    },
    {
      id: 'products',
      title: 'Products',
      icon: ShoppingBag,
      description: 'Browse items'
    },
    {
      id: 'checkout',
      title: 'Checkout',
      icon: CreditCard,
      description: 'Complete purchase'
    }
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo/Brand */}
        <motion.div
          className="brand"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="brand-icon">
            <Palette size={32} />
          </div>
          <div className="brand-text">
            <h1>AI Color Studio</h1>
            <span>Intelligent Color Solutions</span>
          </div>
        </motion.div>

        {/* Step Progress */}
        <nav className="step-progress">
          <div className="progress-container">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentIndex;
              const isAccessible = index <= currentIndex;

              return (
                <div key={step.id} className="step-wrapper">
                  <motion.button
                    className={`step-button ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isAccessible ? 'accessible' : ''}`}
                    onClick={() => isAccessible && setCurrentStep(step.id)}
                    whileHover={isAccessible ? { scale: 1.05 } : {}}
                    whileTap={isAccessible ? { scale: 0.95 } : {}}
                    disabled={!isAccessible}
                  >
                    <div className="step-icon">
                      <Icon size={20} />
                    </div>
                    <div className="step-info">
                      <span className="step-title">{step.title}</span>
                      <span className="step-description">{step.description}</span>
                    </div>

                    {isCompleted && (
                      <motion.div
                        className="completed-indicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Progress Line */}
                  {index < steps.length - 1 && (
                    <div className="progress-line">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: '0%' }}
                        animate={{
                          width: isCompleted ? '100%' : '0%'
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall Progress Bar */}
          <div className="overall-progress">
            <motion.div
              className="overall-progress-fill"
              initial={{ width: '0%' }}
              animate={{
                width: `${(currentIndex / (steps.length - 1)) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </nav>

        {/* Step Counter */}
        <div className="step-counter">
          <span className="current-step">{currentIndex + 1}</span>
          <span className="step-separator">/</span>
          <span className="total-steps">{steps.length}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;