// @/src/components/CropCard.jsx

import React from 'react';

/**
 * A card component to display a summary of a crop in the selection list.
 * @param {object} props - The component props.
 * @param {object} props.crop - The crop data object.
 * @param {boolean} props.isSelected - Whether the crop is currently selected.
 * @param {function} props.onSelect - The function to call when the card is clicked.
 */
const CropCard = ({ crop, isSelected, onSelect }) => {
  const seasonColors = {
    Kharif: 'bg-orange-800/60 text-orange-200 border-orange-700',
    Rabi: 'bg-blue-800/60 text-blue-200 border-blue-700',
    Zaid: 'bg-green-800/60 text-green-200 border-green-700',
    Any: 'bg-gray-700/60 text-gray-200 border-gray-600',
  };

  const cardClasses = `
    flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] 
    ${isSelected 
      ? 'bg-teal-800/50 border-l-4 border-teal-400' 
      : 'bg-[#1a3655] hover:bg-teal-900/40 border-l-4 border-transparent'
    }
  `;

  return (
    <div className={cardClasses} onClick={() => onSelect(crop)}>
      <img 
        src={crop.image_url} 
        alt={crop.name} 
        className="w-12 h-12 rounded-md object-cover mr-4"
      />
      <div className="flex-grow">
        <h4 className="font-bold text-base text-white">{crop.name}</h4>
        <p className="text-sm text-gray-400">{crop.type}</p>
      </div>
      <div className={`text-xs px-2 py-1 rounded-full border ${seasonColors[crop.season] || seasonColors.Any}`}>
        {crop.season}
      </div>
    </div>
  );
};

export default CropCard;