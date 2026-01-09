// @/src/components/CropSidebar.jsx

import React, { useState, useMemo } from 'react';
import CropCard from './CropCard';
import { Search } from 'lucide-react';

const CROP_TYPES = ['All', 'Cereal', 'Pulse', 'Oilseed', 'Vegetable', 'Fruit', 'Fiber'];
const SEASONS = ['All', 'Kharif', 'Rabi', 'Zaid'];

const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded-full transition-all duration-200 transform hover:scale-105 ${ 
      isActive 
        ? 'bg-teal-600 text-white shadow-md'
        : 'bg-gray-700/50 hover:bg-gray-600/80 text-gray-300'
    }`}>
    {label}
  </button>
);

const CropSidebar = ({ crops, selectedCrop, onSelectCrop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredCrops = useMemo(() => {
    if (!Array.isArray(crops)) {
      return [];
    }
    return crops.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeason = seasonFilter === 'All' || crop.season === seasonFilter;
      const matchesType = typeFilter === 'All' || crop.type === typeFilter;
      return matchesSearch && matchesSeason && matchesType;
    });
  }, [crops, searchTerm, seasonFilter, typeFilter]);

  return (
    <div className="bg-[#132b45] p-4 rounded-xl border border-gray-700/50 h-full flex flex-col">
      <h3 className="text-xl font-bold text-teal-300 mb-1">Select Crop</h3>
      <p className="text-xs text-gray-400 mb-4">Based on your location and season</p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text"
          placeholder="Search crops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900/70 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-300 mb-2">Season</p>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map(season => (
            <FilterButton 
              key={season}
              label={season}
              isActive={seasonFilter === season}
              onClick={() => setSeasonFilter(season)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-300 mb-2">Crop Type</p>
        <div className="flex flex-wrap gap-2">
          {CROP_TYPES.map(type => (
            <FilterButton 
              key={type}
              label={type}
              isActive={typeFilter === type}
              onClick={() => setTypeFilter(type)}
            />
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-2 pr-1 -mr-2">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              isSelected={selectedCrop?.id === crop.id}
              onSelect={onSelectCrop}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 mt-8">No crops match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default CropSidebar;