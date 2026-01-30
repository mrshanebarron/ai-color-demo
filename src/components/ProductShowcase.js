import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import axios from 'axios';

const ProductShowcase = ({
  selectedColors,
  selectedProducts,
  setSelectedProducts,
  nextStep,
  prevStep
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedColors]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        const mockProducts = generateMockProducts();
        setProducts(mockProducts);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  };

  const generateMockProducts = () => [
    {
      id: 1,
      name: 'Premium Color Paint Set',
      price: 89.99,
      image: '/api/placeholder/300/300',
      description: 'Professional-grade paint matching your selected colors',
      category: 'Paint & Supplies',
      colors: selectedColors.slice(0, 3)
    },
    {
      id: 2,
      name: 'Custom Color Palette Poster',
      price: 34.99,
      image: '/api/placeholder/300/300',
      description: 'Beautiful wall art featuring your color palette',
      category: 'Wall Art',
      colors: selectedColors
    },
    {
      id: 3,
      name: 'Color-Matched Throw Pillows',
      price: 59.99,
      image: '/api/placeholder/300/300',
      description: 'Set of 2 pillows in your selected colors',
      category: 'Home Decor',
      colors: selectedColors.slice(0, 2)
    },
    {
      id: 4,
      name: 'Digital Color Guide & Codes',
      price: 19.99,
      image: '/api/placeholder/300/300',
      description: 'Complete digital guide with hex codes and usage tips',
      category: 'Digital',
      colors: selectedColors
    },
    {
      id: 5,
      name: 'Color Inspiration Journal',
      price: 24.99,
      image: '/api/placeholder/300/300',
      description: 'Beautiful journal with your color palette cover',
      category: 'Stationery',
      colors: selectedColors.slice(0, 1)
    },
    {
      id: 6,
      name: 'Custom Color Candle Set',
      price: 49.99,
      image: '/api/placeholder/300/300',
      description: 'Hand-poured candles in your selected colors',
      category: 'Home Fragrance',
      colors: selectedColors.slice(0, 3)
    }
  ];

  const toggleProduct = (product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total, product) => total + product.price, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <motion.div
          className="text-blue-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ShoppingCart size={40} />
        </motion.div>
        <p className="text-lg text-gray-600">Finding perfect products for your colors...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Color Reference */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Colors</h3>
        <div className="flex gap-3">
          {selectedColors.map((color, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-lg shadow-md border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const isSelected = selectedProducts.some(p => p.id === product.id);

          return (
            <motion.div
              key={product.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
                isSelected ? 'ring-2 ring-blue-500 shadow-blue-200' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleProduct(product)}
            >
              <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                <div className="flex gap-2">
                  {product.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-12 h-12 rounded-full shadow-lg"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart size={20} />
                </button>
                {isSelected && (
                  <motion.div
                    className="absolute top-3 left-3 bg-blue-600 text-white p-2 rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <ShoppingCart size={20} />
                  </motion.div>
                )}
              </div>

              <div className="p-6">
                <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-2">
                  {product.category}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
                <div className="text-2xl font-bold text-gray-900 mb-4">${product.price}</div>

                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProduct(product);
                  }}
                >
                  {isSelected ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {selectedProducts.length > 0 && (
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Cart Summary</h3>
          <div className="space-y-3 mb-4">
            {selectedProducts.map((product, index) => (
              <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">{product.name}</span>
                <span className="font-semibold text-gray-900">${product.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          onClick={prevStep}
        >
          <ArrowLeft size={20} />
          Back to Analysis
        </button>

        {selectedProducts.length > 0 && (
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
            onClick={nextStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            Proceed to Checkout (${getTotalPrice().toFixed(2)})
            <ArrowRight size={20} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductShowcase;