import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import axios from 'axios';
import './ProductShowcase.css';

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
      <div className="products-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ShoppingCart size={40} />
        </motion.div>
        <p>Finding perfect products for your colors...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="product-showcase"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Color Reference */}
      <div className="color-reference">
        <h3>Your Colors</h3>
        <div className="color-strip">
          {selectedColors.map((color, index) => (
            <div
              key={index}
              className="color-chip"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product, index) => {
          const isSelected = selectedProducts.some(p => p.id === product.id);

          return (
            <motion.div
              key={product.id}
              className={`product-card ${isSelected ? 'selected' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleProduct(product)}
            >
              <div className="product-image">
                <div className="placeholder-image">
                  <div className="image-colors">
                    {product.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="product-color"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <button className="wishlist-btn">
                  <Heart size={20} />
                </button>
                {isSelected && (
                  <motion.div
                    className="selected-indicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <ShoppingCart size={24} />
                  </motion.div>
                )}
              </div>

              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h4 className="product-name">{product.name}</h4>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price}</div>
              </div>

              <div className="product-actions">
                <button
                  className={`add-to-cart-btn ${isSelected ? 'remove' : 'add'}`}
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
          className="cart-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="cart-info">
            <h3>Cart Summary</h3>
            <div className="cart-items">
              {selectedProducts.map((product, index) => (
                <div key={product.id} className="cart-item">
                  <span>{product.name}</span>
                  <span>${product.price}</span>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="navigation-buttons">
        <button className="nav-btn secondary" onClick={prevStep}>
          <ArrowLeft size={20} />
          Back to Analysis
        </button>

        {selectedProducts.length > 0 && (
          <motion.button
            className="nav-btn primary"
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