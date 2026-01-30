import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
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
      title: 'Select Colors',
      subtitle: 'Choose colors that resonate with you'
    },
    analyzer: {
      component: AIAnalyzer,
      title: 'Color Analysis',
      subtitle: 'Optimize your palette'
    },
    products: {
      component: ProductShowcase,
      title: 'Matching Products',
      subtitle: 'Products for your palette'
    },
    checkout: {
      component: Checkout,
      title: 'Complete Order',
      subtitle: 'Finalize your purchase'
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
          <div className="step-header">
            <h1>{steps[currentStep].title}</h1>
            <p>{steps[currentStep].subtitle}</p>
          </div>

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
        </main>

        <Footer />
      </div>
    </Elements>
  );
}

export default App;