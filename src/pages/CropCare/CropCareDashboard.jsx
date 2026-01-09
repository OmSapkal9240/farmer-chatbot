import React, { useState } from 'react';
import { crops } from '../../data/crops';
import CropDetail from './CropDetail';

const CropCareDashboard = () => {
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Select a Crop</h2>
        <ul>
          {crops.map((crop) => (
            <li key={crop.id}>
              <button
                onClick={() => setSelectedCrop(crop)}
                className={`w-full text-left p-2 rounded-md mb-2 ${selectedCrop.id === crop.id ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'}`}>
                {crop.name.split('.').pop().charAt(0).toUpperCase() + crop.name.split('.').pop().slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-8 overflow-y-auto">
        <CropDetail crop={selectedCrop} />
      </div>
    </div>
  );
};

export default CropCareDashboard;
