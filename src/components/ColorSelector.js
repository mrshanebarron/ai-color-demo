import React, { useState } from 'react';
import { ChromePicker, CompactPicker } from 'react-color';

const ColorSelector = ({
  selectedColors,
  setSelectedColors,
  userPreferences,
  setUserPreferences,
  nextStep
}) => {
  const [currentColor, setCurrentColor] = useState('#3498db');

  const moods = ['calm', 'energetic', 'professional', 'creative', 'natural'];

  // Professional color palette for quick selection
  const quickColors = [
    ['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF'],
    ['#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF'],
    ['#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E']
  ];

  const addColor = (color) => {
    if (selectedColors.length < 5 && !selectedColors.includes(color)) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const removeColor = (colorToRemove) => {
    setSelectedColors(selectedColors.filter(color => color !== colorToRemove));
  };

  return (
    <div className="step-content">
      {/* Mood Selection */}
      <div className="mood-section">
        <h3>What's your mood?</h3>
        <div className="mood-buttons">
          {moods.map(mood => (
            <button
              key={mood}
              className={`mood-button ${userPreferences.mood === mood ? 'active' : ''}`}
              onClick={() => setUserPreferences({...userPreferences, mood})}
            >
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Color Tools */}
      <div className="color-tools">
        {/* Color Picker */}
        <div className="color-picker-section">
          <div className="picker-container">
            <ChromePicker
              color={currentColor}
              onChange={(color) => setCurrentColor(color.hex)}
              disableAlpha
              width="100%"
            />
            <div className="color-input-group">
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="hex-input"
                placeholder="#000000"
              />
            </div>
            <button
              className="add-color-btn"
              onClick={() => addColor(currentColor)}
              disabled={selectedColors.length >= 5}
            >
              Add Color ({selectedColors.length}/5)
            </button>
          </div>
        </div>

        {/* Quick Colors */}
        <div className="quick-colors-section">
          <h4>Quick Colors</h4>
          <div className="quick-colors-grid">
            {quickColors.flat().map((color, index) => (
              <div
                key={index}
                className="quick-color"
                style={{ backgroundColor: color }}
                onClick={() => addColor(color)}
                title={color}
              />
            ))}
          </div>
          <CompactPicker
            color={currentColor}
            onChange={(color) => setCurrentColor(color.hex)}
            colors={quickColors[0]}
          />
        </div>
      </div>

      {/* Selected Colors */}
      <div className="selected-colors">
        <h3>Your Selected Colors</h3>
        <div className="selected-palette">
          {selectedColors.length === 0 ? (
            'Select colors to build your palette'
          ) : (
            <div className="palette-colors">
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  className="palette-color"
                  style={{ backgroundColor: color }}
                  onClick={() => removeColor(color)}
                  title={`${color} - Click to remove`}
                >
                  <div className="remove-color">×</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {selectedColors.length > 0 && (
        <div className="step-navigation">
          <div></div>
          <button className="nav-btn primary" onClick={nextStep}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;