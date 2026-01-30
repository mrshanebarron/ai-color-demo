import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import './Checkout.css';

const Checkout = ({
  selectedProducts,
  selectedColors,
  prevStep
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const getTotalPrice = () => {
    return selectedProducts.reduce((total, product) => total + product.price, 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(getTotalPrice() * 100), // Convert to cents
          products: selectedProducts,
          colors: selectedColors,
          customer: customerInfo
        }),
      });

      const { client_secret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              state: customerInfo.state,
              postal_code: customerInfo.zip,
            },
          },
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentComplete(true);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (paymentComplete) {
    return (
      <motion.div
        className="payment-success"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CheckCircle size={80} />
        </motion.div>

        <h2>Payment Successful!</h2>
        <p>Thank you for your purchase. Your color-matched products will be shipped soon.</p>

        <div className="order-summary">
          <h3>Order Details</h3>
          <div className="purchased-items">
            {selectedProducts.map(product => (
              <div key={product.id} className="purchased-item">
                <span>{product.name}</span>
                <span>${product.price}</span>
              </div>
            ))}
          </div>
          <div className="final-total">
            <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
          </div>
        </div>

        <div className="color-reference-final">
          <h4>Your Colors</h4>
          <div className="final-colors">
            {selectedColors.map((color, index) => (
              <div
                key={index}
                className="final-color"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="checkout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="checkout-container">
        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="selected-colors-checkout">
            <h4>Your Colors</h4>
            <div className="checkout-colors">
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  className="checkout-color"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="product-list">
            {selectedProducts.map(product => (
              <div key={product.id} className="checkout-product">
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <p>{product.category}</p>
                </div>
                <div className="product-price">
                  ${product.price}
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <div className="subtotal">
              <span>Subtotal: ${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Shipping: Free</span>
            </div>
            <div className="total">
              <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="payment-form">
          <div className="form-header">
            <Lock size={24} />
            <h3>Secure Payment</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="customer-info">
              <h4>Customer Information</h4>

              <div className="form-row">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Address"
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="form-row-group">
                <input
                  type="text"
                  placeholder="City"
                  value={customerInfo.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={customerInfo.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={customerInfo.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="payment-details">
              <h4>Payment Details</h4>
              <div className="card-element-container">
                <CreditCard size={20} />
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="payment-actions">
              <button
                type="button"
                className="back-btn"
                onClick={prevStep}
              >
                <ArrowLeft size={20} />
                Back to Products
              </button>

              <button
                type="submit"
                className="pay-btn"
                disabled={!stripe || isProcessing}
              >
                {isProcessing ? (
                  <motion.div
                    className="processing-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Lock size={20} />
                    Pay ${getTotalPrice().toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="security-note">
            <p>🔒 Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;