import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

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
        className="max-w-2xl mx-auto text-center space-y-8 py-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="text-green-500 mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CheckCircle size={80} />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your color-matched products will be shipped soon.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h3>
          <div className="space-y-3 mb-4">
            {selectedProducts.map(product => (
              <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">{product.name}</span>
                <span className="font-semibold text-gray-900">${product.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-green-600">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Colors</h4>
          <div className="flex justify-center gap-3">
            {selectedColors.map((color, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-lg shadow-md border border-gray-200"
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
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h3>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3">Your Colors</h4>
            <div className="flex gap-3">
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-lg shadow-md border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {selectedProducts.map(product => (
              <div key={product.id} className="flex justify-between items-start py-3 border-b border-gray-100">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="font-semibold text-gray-900">
                  ${product.price}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">Secure Payment</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-4">Customer Information</h4>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />

                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={customerInfo.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={customerInfo.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-4">Payment Details</h4>
              <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <CreditCard size={20} className="text-gray-500" />
                <div className="flex-1">
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
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                onClick={prevStep}
              >
                <ArrowLeft size={20} />
                Back to Products
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex-1"
                disabled={!stripe || isProcessing}
              >
                {isProcessing ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">🔒 Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;