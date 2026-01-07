// @/src/components/CropSidebar.jsx

import React from 'react';
import { Leaf } from 'lucide-react';

const CropSidebar = ({ crops, selectedCrop, onSelectCrop, location }) => {
  return (
    <div className="bg-[#0f1b2e]/60 border border-teal-900/50 rounded-lg p-4 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-teal-300 mb-4">Recommended Crops</h2>
      {location && (
        <p className="text-xs text-gray-400 mb-4 -mt-2">
          Based on your location: {location.district}, {location.state}
        </p>
      )}
      <div className="space-y-2">
        {crops.length > 0 ? (
          crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => onSelectCrop(crop)}
              className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition-all duration-200 group ring-1 ring-transparent hover:bg-teal-500/10 hover:ring-teal-400/50 focus:outline-none focus:ring-teal-400/80 ${selectedCrop?.id === crop.id ? 'bg-teal-500/20 ring-teal-400/70 shadow-lg shadow-teal-500/10' : 'bg-gray-800/20'}`}>
              <div className={`p-2 rounded-md ${selectedCrop?.id === crop.id ? 'bg-teal-500/30' : 'bg-gray-700/50 group-hover:bg-teal-500/20'}`}>
                <Leaf className={`w-6 h-6 transition-colors ${selectedCrop?.id === crop.id ? 'text-teal-300' : 'text-gray-400 group-hover:text-teal-400'}`} />
              </div>
              <span className={`font-semibold transition-colors ${selectedCrop?.id === crop.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                {crop.name}
              </span>
            </button>
          ))
        ) : (
          <div className="text-center py-8 px-4 bg-gray-800/30 rounded-lg">
            <p className="text-gray-400">No crop recommendations available for your current location and season.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropSidebar;
