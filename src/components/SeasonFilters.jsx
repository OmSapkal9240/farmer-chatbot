/**
 * @file SeasonFilters.jsx
 * @description This file belongs to the Seasonal Advice module. It provides UI for filtering advice.
 * For the demo, these are visual placeholders with no active logic.
 * TODO: Implement the filtering logic by lifting state and passing down event handlers.
 */

import React from 'react';

const SeasonFilters = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-200">Filters</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="season-filter" className="block text-sm font-medium text-gray-400">Season</label>
          <select id="season-filter" className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white" disabled>
            <option>All</option>
            <option>Kharif</option>
            <option>Rabi</option>
            <option>Zaid</option>
          </select>
        </div>
        <div>
          <label htmlFor="practice-filter" className="block text-sm font-medium text-gray-400">Farming Practice</label>
          <select id="practice-filter" className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white" disabled>
            <option>Any</option>
            <option>Organic</option>
            <option>Conventional</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SeasonFilters;
