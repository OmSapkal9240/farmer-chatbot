/**
 * @file CropSidebar.jsx
 * @description Sidebar component for crop selection, search, and filtering.
 * Displays a list of crops and provides UI for filtering them.
 * On mobile, this collapses into a dropdown/select picker for better UX.
 * TODO: Implement the backend logic for PIN code-based regional filtering.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CropFilters from './CropFilters';
import { Search, Bot } from 'lucide-react';

const CropSidebar = ({ crops, selectedCrop, onSelectCrop }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrops = crops.filter(crop =>
    t(crop.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // TODO: Replace with actual chat panel integration
  const handleStartChat = () => {
    const message = `I have ${t(selectedCrop.name)} - with symptoms - location 421302. Please advise.`;
    alert(`Chat context sent (mock):\n"${message}"`);
    console.log('Chat context:', { 
      crop: selectedCrop.id, 
      location: '421302', // Mock PIN
      message 
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full">
      {/* Mobile View: Dropdown */}
      <div className="lg:hidden mb-4">
        <select
          value={selectedCrop?.id || ''}
          onChange={(e) => onSelectCrop(crops.find(c => c.id === e.target.value))}
          className="w-full p-2 border rounded-md bg-white"
          aria-label="Select a Crop"
        >
          {crops.map(crop => (
            <option key={crop.id} value={crop.id}>{t(crop.name)}</option>
          ))}
        </select>
      </div>

      {/* Desktop View: Full Sidebar */}
      <div className="hidden lg:block">
        <h2 className="text-xl font-bold mb-4">Select Crop</h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <CropFilters />

        <ul className="space-y-2 max-h-60 overflow-y-auto mb-4">
          {filteredCrops.map(crop => (
            <li key={crop.id}>
              <button
                onClick={() => onSelectCrop(crop)}
                className={`w-full text-left p-2 rounded-md flex items-center space-x-3 transition-colors ${
                  selectedCrop?.id === crop.id
                    ? 'bg-green-100 text-green-800 font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                <img src={crop.icon} alt={`${t(crop.name)} icon`} className="w-8 h-8 rounded-full" />
                <span>{t(crop.name)}</span>
                <span className="text-xs text-gray-500 ml-auto">{crop.seasons[0]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedCrop && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-bold text-lg mb-2">Quick Facts</h3>
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            <p><strong>Season:</strong> {selectedCrop.seasons.join(', ')}</p>
            <p><strong>Family:</strong> {selectedCrop.family}</p>
          </div>
          
          <div className="mt-4">
             <h3 className="font-bold text-lg mb-2">Seasonal Tip</h3>
             <p className="text-sm text-gray-600 bg-yellow-100 p-3 rounded-md">Ensure proper drainage during monsoon to avoid root rot.</p>
          </div>

          <button
            onClick={handleStartChat}
            className="w-full mt-6 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 active:scale-100"
            aria-label={`Start chat about ${t(selectedCrop.name)}`}
          >
            <Bot size={20} />
            <span>Start Chat (with context)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CropSidebar;
