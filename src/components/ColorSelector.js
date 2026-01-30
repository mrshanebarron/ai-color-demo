import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChromePicker, CompactPicker } from 'react-color';
import { Palette, Wand2, ArrowRight } from 'lucide-react';
import './ColorSelector.css';

const ColorSelector = ({
  selectedColors,
  setSelectedColors,
  userPreferences,
  setUserPreferences,
  nextStep
}) => {
  const [currentColor, setCurrentColor] = useState('#3498db');
  const [colorMode, setColorMode] = useState('picker'); // 'picker' or 'presets'

  const presetPalettes = [
    {
      name: 'Ocean Breeze',
      colors: ['#1e3a8a', '#3b82f6', '#06b6d4', '#0891b2', '#0e7490']
    },
    {
      name: 'Sunset Glow',
      colors: ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#eab308']
    },
    {
      name: 'Forest Calm',
      colors: ['#065f46', '#047857', '#059669', '#10b981', '#34d399']
    },
    {
      name: 'Royal Purple',
      colors: ['#581c87', '#7c2d12', '#9333ea', '#a855f7', '#c084fc']
    },
    {
      name: 'Minimalist Gray',
      colors: ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db']
    }
  ];

  const moods = ['calm', 'energetic', 'professional', 'creative', 'natural'];

  const addColor = (color) => {
    if (selectedColors.length < 5 && !selectedColors.includes(color)) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const removeColor = (colorToRemove) => {
    setSelectedColors(selectedColors.filter(color => color !== colorToRemove));
  };

  const selectPalette = (palette) => {
    setSelectedColors(palette.colors);
  };

  const generateRandomPalette = () => {
    const colors = [];
    for (let i = 0; i < 5; i++) {
      colors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
    }
    setSelectedColors(colors);
  };

  return (
    <motion.div
      className="color-selector"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Mood Selection */}
      <div className="mood-selection">
        <h3>What's your mood?</h3>
        <div className="mood-buttons">
          {moods.map(mood => (
            <button
              key={mood}
              className={`mood-btn ${userPreferences.mood === mood ? 'active' : ''}`}
              onClick={() => setUserPreferences({...userPreferences, mood})}
            >
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-btn ${colorMode === 'picker' ? 'active' : ''}`}
          onClick={() => setColorMode('picker')}
        >
          <Palette size={20} />
          Color Picker
        </button>
        <button
          className={`mode-btn ${colorMode === 'presets' ? 'active' : ''}`}
          onClick={() => setColorMode('presets')}
        >
          <Wand2 size={20} />
          Preset Palettes
        </button>
      </div>

      {/* Color Picker Mode */}
      {colorMode === 'picker' && (
        <div className="picker-section">
          <div className="color-picker-container">
            <ChromePicker
              color={currentColor}
              onChange={(color) => setCurrentColor(color.hex)}
              disableAlpha
            />
            <button
              className="add-color-btn"
              onClick={() => addColor(currentColor)}
              disabled={selectedColors.length >= 5}
            >
              Add Color ({selectedColors.length}/5)
            </button>
          </div>

          <div className="quick-colors">
            <h4>Quick Colors</h4>
            <CompactPicker
              color={currentColor}
              onChange={(color) => {
                setCurrentColor(color.hex);
                addColor(color.hex);
              }}
            />
          </div>
        </div>
      )}

      {/* Preset Palettes Mode */}
      {colorMode === 'presets' && (
        <div className="presets-section">
          <div className="palette-grid">
            {presetPalettes.map((palette, index) => (
              <motion.div
                key={palette.name}
                className="palette-card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectPalette(palette)}
              >
                <div className="palette-colors">
                  {palette.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="palette-color"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <h4>{palette.name}</h4>
              </motion.div>
            ))}
          </div>

          <button className="random-palette-btn" onClick={generateRandomPalette}>
            <Wand2 size={20} />
            Generate Random Palette
          </button>
        </div>
      )}

      {/* Selected Colors Display */}
      <div className="selected-colors">
        <h3>Your Selected Colors</h3>
        <div className="selected-colors-display">
          {selectedColors.map((color, index) => (
            <motion.div
              key={`${color}-${index}`}
              className="selected-color"
              style={{ backgroundColor: color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => removeColor(color)}
              title={`${color} - Click to remove`}
            >
              <span className="color-code">{color}</span>
            </motion.div>
          ))}

          {selectedColors.length === 0 && (
            <div className="empty-selection">
              Select colors to build your palette
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      {selectedColors.length > 0 && (
        <motion.button
          className="continue-btn"
          onClick={nextStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue to AI Analysis
          <ArrowRight size={20} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default ColorSelector;