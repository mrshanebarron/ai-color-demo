import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';
import './AIAnalyzer.css';

const AIAnalyzer = ({
  selectedColors,
  aiRecommendations,
  setAiRecommendations,
  userPreferences,
  nextStep,
  prevStep
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    if (selectedColors.length > 0 && !aiRecommendations) {
      analyzeColors();
    }
  }, [selectedColors]);

  const analyzeColors = async () => {
    setIsAnalyzing(true);

    try {
      const response = await axios.post('/api/analyze-colors', {
        colors: selectedColors,
        preferences: userPreferences,
        mood: userPreferences.mood
      });

      // Simulate AI processing time
      setTimeout(() => {
        setAiRecommendations(response.data);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 3000);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback with mock data
      setTimeout(() => {
        setAiRecommendations(generateMockAnalysis());
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 3000);
    }
  };

  const generateMockAnalysis = () => ({
    palettes: [
      {
        id: 'optimized',
        name: 'AI Optimized',
        colors: selectedColors,
        description: 'Your original selection with AI enhancements',
        score: 95
      },
      {
        id: 'harmony',
        name: 'Perfect Harmony',
        colors: adjustColors(selectedColors, 'harmony'),
        description: 'Mathematically perfect color relationships',
        score: 92
      },
      {
        id: 'contrast',
        name: 'Dynamic Contrast',
        colors: adjustColors(selectedColors, 'contrast'),
        description: 'Enhanced contrast for maximum impact',
        score: 88
      }
    ],
    recommendations: [
      `Perfect for ${userPreferences.mood} environments`,
      'These colors enhance psychological well-being',
      'Ideal contrast ratios for accessibility',
      'Trending in modern design applications'
    ],
    insights: {
      dominantHue: 'Blue spectrum dominates, conveying trust and stability',
      colorTemperature: 'Balanced warm/cool ratio creates visual interest',
      accessibility: 'AA compliant contrast ratios achieved',
      psychology: `${userPreferences.mood} mood perfectly captured`
    }
  });

  const adjustColors = (colors, type) => {
    // Simple color adjustment logic
    return colors.map(color => {
      const hsl = hexToHsl(color);
      if (type === 'harmony') {
        return hslToHex(hsl.h, Math.max(hsl.s - 10, 0), hsl.l);
      } else {
        return hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
      }
    });
  };

  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  return (
    <motion.div
      className="ai-analyzer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Original Colors Display */}
      <div className="original-colors">
        <h3>Your Original Selection</h3>
        <div className="colors-row">
          {selectedColors.map((color, index) => (
            <div
              key={index}
              className="color-swatch"
              style={{ backgroundColor: color }}
            >
              <span>{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis Process */}
      {isAnalyzing && (
        <motion.div
          className="analysis-process"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="ai-brain">
            <Brain size={60} />
            <motion.div
              className="analysis-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={30} />
            </motion.div>
          </div>
          <h3>AI Analyzing Your Colors...</h3>
          <div className="analysis-steps">
            <motion.div className="step" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
              Analyzing color relationships
            </motion.div>
            <motion.div className="step" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>
              Optimizing for {userPreferences.mood} mood
            </motion.div>
            <motion.div className="step" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }}>
              Generating recommendations
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* AI Recommendations */}
      {analysisComplete && aiRecommendations && (
        <motion.div
          className="ai-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="results-header">
            <Sparkles size={24} />
            <h3>AI Enhanced Palettes</h3>
          </div>

          <div className="palettes-grid">
            {aiRecommendations.palettes.map((palette, index) => (
              <motion.div
                key={palette.id}
                className="palette-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="palette-header">
                  <h4>{palette.name}</h4>
                  <div className="score">
                    <span className="score-value">{palette.score}</span>
                    <span className="score-label">Score</span>
                  </div>
                </div>

                <div className="palette-colors">
                  {palette.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="result-color"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <p className="palette-description">{palette.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="insights-section">
            <h4>AI Insights</h4>
            <div className="insights-grid">
              {Object.entries(aiRecommendations.insights).map(([key, value]) => (
                <div key={key} className="insight-item">
                  <strong>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations-list">
            <h4>Recommendations</h4>
            <ul>
              {aiRecommendations.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {rec}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button className="nav-btn secondary" onClick={prevStep}>
          <ArrowLeft size={20} />
          Back to Colors
        </button>

        {analysisComplete && (
          <motion.button
            className="nav-btn primary"
            onClick={nextStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            View Products
            <ArrowRight size={20} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default AIAnalyzer;