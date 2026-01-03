/**
 * @file SeasonSidebar.jsx
 * @description This file belongs to the Seasonal Advice module. It's the sidebar component.
 * It handles crop selection, PIN input, and actions like saving or exporting schedules.
 * TODO: Connect save/export functionality to a real user account backend.
 */

import React from 'react';
import SeasonFilters from './SeasonFilters';
import SeasonExport from './SeasonExport';
import { MapPin } from 'lucide-react';

const SeasonSidebar = ({ crops, selectedCrop, onSelectCrop, pin, onPinChange, isLoading, onGetAdvice }) => {

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <div>
        <label htmlFor="crop-select" className="block text-sm font-bold text-gray-300 mb-2">Select Crop</label>
        <select
          id="crop-select"
          value={selectedCrop ? selectedCrop.id : ''}
          onChange={(e) => {
            const crop = crops.find(c => c.id === e.target.value);
            onSelectCrop(crop || null);
          }}
          disabled={isLoading}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" disabled>Select a crop...</option>
          {crops.map(crop => (
            <option key={crop.id} value={crop.id}>{crop.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pin-input" className="block text-sm font-bold text-gray-300 mb-2">Region / PIN Code</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="pin-input"
            type="text"
            value={pin}
            onChange={(e) => onPinChange(e.target.value)}
            placeholder="Enter 6-digit PIN"
            maxLength={6}
            disabled={isLoading}
            className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <SeasonFilters />

      <button
        onClick={onGetAdvice}
        disabled={isLoading}
        className="w-full p-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Getting Advice...' : 'Get Advice'}
      </button>

          </div>
  );
};

export default SeasonSidebar;
