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

const SeasonSidebar = ({ crops, selectedCrop, onSelectCrop, pin, onPinChange, currentMonth, tasks }) => {

  const handleSaveSchedule = () => {
    // TODO: Replace with a call to a backend service.
    const savedSchedules = JSON.parse(localStorage.getItem('seasonal_schedules')) || [];
    const newSchedule = {
      id: `sched_${selectedCrop.id}_${Date.now()}`,
      crop: selectedCrop,
      pin,
      month: currentMonth,
      tasks,
      savedAt: new Date().toISOString(),
    };
    savedSchedules.push(newSchedule);
    localStorage.setItem('seasonal_schedules', JSON.stringify(savedSchedules));
    alert('Schedule saved locally!');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <div>
        <label htmlFor="crop-select" className="block text-sm font-bold text-gray-300 mb-2">Select Crop</label>
        <select
          id="crop-select"
          value={selectedCrop.id}
          onChange={(e) => onSelectCrop(crops.find(c => c.id === e.target.value))}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500"
        >
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
            className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <SeasonFilters />

      <div className="pt-6 border-t border-gray-700">
        <h3 className="text-lg font-bold text-gray-200 mb-3">Quick Recommendations</h3>
        <div className="p-4 bg-gray-700/50 rounded-md text-sm text-gray-300 space-y-2">
          <p><strong>For {selectedCrop.name} in {currentMonth}:</strong></p>
          <ul className="list-disc list-inside">
            <li>Check for early signs of pests.</li>
            <li>Ensure irrigation matches mock rainfall forecast for PIN {pin}.</li>
            <li>Prepare for upcoming fertilizer application.</li>
          </ul>
        </div>
      </div>

      <SeasonExport 
        schedule={{ crop: selectedCrop, pin, month: currentMonth, tasks }}
        onSave={handleSaveSchedule} 
      />
    </div>
  );
};

export default SeasonSidebar;
