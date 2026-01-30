import React from 'react';

const Header = ({ currentStep }) => {
  const steps = ['selector', 'analyzer', 'products', 'checkout'];
  const currentIndex = steps.indexOf(currentStep) + 1;
  const totalSteps = steps.length;

  return (
    <header className="header">
      <div className="header-content">
        <h1>Color Tool</h1>
        <div className="progress">
          {currentIndex} / {totalSteps}
        </div>
      </div>
    </header>
  );
};

export default Header;