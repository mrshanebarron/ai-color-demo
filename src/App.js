import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ColorSelector from './components/ColorSelector';
import AIAnalyzer from './components/AIAnalyzer';
import ProductShowcase from './components/ProductShowcase';
import Checkout from './components/Checkout';
import Header from './components/Header';
import Footer from './components/Footer';

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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {steps[currentStep].title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {steps[currentStep].subtitle}
              </p>
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
          </div>
        </main>

        <Footer />
      </div>
    </Elements>
  );
}

export default App;