/**
 * @file CropFilters.jsx
 * @description A component providing UI for filtering crops.
 * For the hackathon demo, these are visual placeholders.
 * TODO: Implement the filtering logic. This will involve lifting state up
 * to the parent component (CropCarePage) and passing down filter handlers.
 */

import React from 'react';

const CropFilters = () => {
  // TODO: Make these filters functional
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-2 text-gray-700">Filters</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="region-pin" className="block text-sm font-medium text-gray-600">Region/PIN</label>
          <input
            type="text"
            id="region-pin"
            placeholder="e.g., 421302"
            className="w-full p-2 mt-1 border rounded-md text-sm"
            disabled // Disabled for demo
          />
        </div>
        <div>
          <label htmlFor="season" className="block text-sm font-medium text-gray-600">Season</label>
          <select id="season" className="w-full p-2 mt-1 border rounded-md text-sm bg-white" disabled>
            <option>Kharif</option>
            <option>Rabi</option>
            <option>Zaid</option>
          </select>
        </div>
        <div>
          <label htmlFor="crop-family" className="block text-sm font-medium text-gray-600">Crop Family</label>
          <select id="crop-family" className="w-full p-2 mt-1 border rounded-md text-sm bg-white" disabled>
            <option>All</option>
            <option>Solanaceae</option>
            <option>Poaceae</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CropFilters;
