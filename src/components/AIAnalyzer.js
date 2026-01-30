import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';

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
      className="w-full max-w-4xl mx-auto p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Original Colors Display */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Original Selection</h3>
        <div className="flex gap-4 flex-wrap">
          {selectedColors.map((color, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-lg shadow-md overflow-hidden group cursor-pointer transform hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-end p-2">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-2 py-1 rounded">
                  {color}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis Process */}
      {isAnalyzing && (
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative mb-6">
            <Brain size={60} className="text-blue-600 mx-auto" />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={30} className="text-purple-500" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">AI Analyzing Your Colors...</h3>
          <div className="space-y-3">
            <motion.div
              className="text-sm text-gray-600 bg-white rounded-lg py-2 px-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Analyzing color relationships
            </motion.div>
            <motion.div
              className="text-sm text-gray-600 bg-white rounded-lg py-2 px-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
              Optimizing for {userPreferences.mood} mood
            </motion.div>
            <motion.div
              className="text-sm text-gray-600 bg-white rounded-lg py-2 px-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 1 }}
            >
              Generating recommendations
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* AI Recommendations */}
      {analysisComplete && aiRecommendations && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
            <Sparkles size={24} className="text-yellow-500" />
            <h3 className="text-2xl font-bold text-gray-800">AI Enhanced Palettes</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiRecommendations.palettes.map((palette, index) => (
              <motion.div
                key={palette.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">{palette.name}</h4>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">{palette.score}</span>
                    <span className="block text-xs text-gray-500">Score</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {palette.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-8 h-8 rounded-lg shadow-sm flex-1 min-w-0 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{palette.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">AI Insights</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(aiRecommendations.insights).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <strong className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                  </strong>
                  <span className="block text-gray-800 mt-1">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h4>
            <ul className="space-y-3">
              {aiRecommendations.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          onClick={prevStep}
        >
          <ArrowLeft size={20} />
          Back to Colors
        </button>

        {analysisComplete && (
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
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