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
import { Search, Bot, Info, AlertTriangle } from 'lucide-react';
import RecommendedProducts from './RecommendedProducts';
import { getDynamicWeatherTip } from '../utils/cropLogic';

const CropSidebar = ({ crops, selectedCrop, onSelectCrop, weather }) => {
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
    <div className="bg-black/20 backdrop-blur-lg border border-teal-300/20 p-4 rounded-lg shadow-lg h-full">
      {/* Mobile View: Dropdown */}
      <div className="lg:hidden mb-4">
        <select
          value={selectedCrop?.id || ''}
          onChange={(e) => onSelectCrop(crops.find(c => c.id === e.target.value))}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500"
          aria-label="Select a Crop"
        >
          {crops.map(crop => (
            <option key={crop.id} value={crop.id}>{t(crop.name)}</option>
          ))}
        </select>
      </div>

      {/* Desktop View: Full Sidebar */}
      <div className="hidden lg:block">
        <h2 className="text-xl font-bold mb-4 text-[#e8f1ff]">Select Crop</h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        
        <ul className="space-y-1 max-h-60 overflow-y-auto mb-4 pr-2">
          {filteredCrops.map(crop => (
            <li key={crop.id}>
              <button
                onClick={() => onSelectCrop(crop)}
                className={`w-full text-left p-2.5 rounded-md flex items-center space-x-3 transition-all duration-200 ${
                  selectedCrop?.id === crop.id
                    ? 'bg-[#34e89e]/20 text-[#34e89e] font-semibold border-l-2 border-[#34e89e]'
                    : 'text-[#9fb3c8] hover:bg-white/10'
                }`}
              >
                <img src={crop.icon} alt={`${t(crop.name)} icon`} className="w-8 h-8 rounded-full" />
                <span>{t(crop.name)}</span>
                <span className="text-xs text-[#9fb3c8] ml-auto">{crop.seasons[0]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedCrop && (
        <div className="mt-4 border-t border-teal-300/20 pt-4">
          <h3 className="flex items-center space-x-2 font-bold text-lg mb-2 text-[#e8f1ff]"><Info size={18} className="text-blue-400" /><span>Quick Facts</span></h3>
          <div className="text-sm text-[#9fb3c8] bg-black/20 p-3 rounded-md">
            <p><strong className="text-[#e8f1ff]">Season:</strong> {selectedCrop.seasons.join(', ')}</p>
            <p><strong className="text-[#e8f1ff]">Family:</strong> {selectedCrop.family}</p>
          </div>
          
          <div className="mt-4">
             <h3 className="flex items-center space-x-2 font-bold text-lg mb-2 text-[#e8f1ff]"><AlertTriangle size={18} className="text-yellow-400" /><span>Seasonal Tip</span></h3>
             <p className="text-sm text-yellow-200 bg-yellow-400/10 p-3 rounded-md border border-yellow-400/20">{getDynamicWeatherTip(weather, selectedCrop)}</p>
          </div>

          <RecommendedProducts cropId={selectedCrop.id} />

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
