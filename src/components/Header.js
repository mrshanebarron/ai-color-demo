import React from 'react';

const Header = ({ currentStep }) => {
  const steps = ['selector', 'analyzer', 'products', 'checkout'];
  const currentIndex = steps.indexOf(currentStep) + 1;
  const totalSteps = steps.length;

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Color Tool</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Step</span>
            <span className="text-sm font-medium text-gray-900">
              {currentIndex}
            </span>
            <span className="text-sm text-gray-400">of</span>
            <span className="text-sm text-gray-500">{totalSteps}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;