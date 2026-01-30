import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import ColorSelector from './components/ColorSelector';
import AIAnalyzer from './components/AIAnalyzer';
import ProductShowcase from './components/ProductShowcase';
import Checkout from './components/Checkout';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

function App() {
  const [currentStep, setCurrentStep] = useState('selector');
  const [selectedColors, setSelectedColors] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    mood: 'calm',
    style: 'modern',
    purpose: 'interior'
  });

  const steps = {
    selector: {
      component: ColorSelector,
      title: 'Choose Your Colors',
      subtitle: 'Select colors that inspire you'
    },
    analyzer: {
      component: AIAnalyzer,
      title: 'AI Analysis',
      subtitle: 'Let AI enhance your color choices'
    },
    products: {
      component: ProductShowcase,
      title: 'Perfect Products',
      subtitle: 'Products that match your colors'
    },
    checkout: {
      component: Checkout,
      title: 'Secure Checkout',
      subtitle: 'Complete your purchase'
    }
  };

  const nextStep = () => {
    const stepOrder = ['selector', 'analyzer', 'products', 'checkout'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder = ['selector', 'analyzer', 'products', 'checkout'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <Header
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <main className="main-content">
          <motion.div
            className="step-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentStep}
          >
            <h1>{steps[currentStep].title}</h1>
            <p>{steps[currentStep].subtitle}</p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="step-content"
            >
              <StepComponent
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                aiRecommendations={aiRecommendations}
                setAiRecommendations={setAiRecommendations}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                userPreferences={userPreferences}
                setUserPreferences={setUserPreferences}
                nextStep={nextStep}
                prevStep={prevStep}
                currentStep={currentStep}
              />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Elements>
  );
}

export default App;
