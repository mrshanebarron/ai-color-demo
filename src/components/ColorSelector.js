import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { XMarkIcon } from '@heroicons/react/20/solid';

const ColorSelector = ({
  selectedColors,
  setSelectedColors,
  userPreferences,
  setUserPreferences,
  nextStep
}) => {
  const [currentColor, setCurrentColor] = useState('#3B82F6');

  const moods = [
    { id: 'calm', name: 'Calm' },
    { id: 'energetic', name: 'Energetic' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'natural', name: 'Natural' }
  ];

  // Professional color palette for quick selection
  const quickColors = [
    '#1F2937', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6',
    '#FEF2F2', '#FECACA', '#F87171', '#EF4444', '#DC2626', '#B91C1C',
    '#FFF7ED', '#FED7AA', '#FB923C', '#F97316', '#EA580C', '#C2410C',
    '#FFFBEB', '#FDE68A', '#FBBF24', '#F59E0B', '#D97706', '#B45309',
    '#F0FDF4', '#BBF7D0', '#86EFAC', '#4ADE80', '#16A34A', '#15803D',
    '#ECFDF5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669',
    '#F0FDFA', '#CCFBF1', '#99F6E4', '#5EEAD4', '#2DD4BF', '#14B8A6',
    '#ECFEFF', '#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2',
    '#F0F9FF', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7',
    '#EFF6FF', '#DBEAFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB',
    '#F8FAFC', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569'
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
    <div className="space-y-8">
      {/* Mood Selection */}
      <div>
        <label className="text-base font-medium text-gray-900">What's your mood?</label>
        <fieldset className="mt-4">
          <legend className="sr-only">Choose a mood</legend>
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <label
                key={mood.id}
                className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium focus:outline-none ${
                  userPreferences.mood === mood.id
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="mood"
                  value={mood.id}
                  checked={userPreferences.mood === mood.id}
                  onChange={(e) => setUserPreferences({...userPreferences, mood: e.target.value})}
                  className="sr-only"
                />
                {mood.name}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Color Tools */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Color Picker */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Color Picker</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ChromePicker
              color={currentColor}
              onChange={(color) => setCurrentColor(color.hex)}
              disableAlpha
              width="100%"
            />
            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono"
                placeholder="#000000"
              />
              <button
                type="button"
                onClick={() => addColor(currentColor)}
                disabled={selectedColors.length >= 5}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Color ({selectedColors.length}/5)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Colors */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Colors</h3>
          <div className="grid grid-cols-6 gap-2">
            {quickColors.map((color, index) => (
              <button
                key={index}
                type="button"
                className="aspect-square rounded-md border border-gray-200 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                style={{ backgroundColor: color }}
                onClick={() => addColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Selected Colors */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Selected Colors</h3>
        <div className="min-h-24 rounded-lg border-2 border-dashed border-gray-300 p-6">
          {selectedColors.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500">Select colors to build your palette</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div
                    className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="absolute -top-2 -right-2 rounded-full bg-white p-1 text-gray-400 hover:text-gray-600 shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="sr-only">Remove color</span>
                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <p className="text-xs text-gray-500 mt-2 font-mono">{color}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {selectedColors.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={nextStep}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;