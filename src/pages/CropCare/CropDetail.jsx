import React from 'react';
import CropCareTabs from './CropCareTabs';

const CropDetail = ({ crop }) => {
  if (!crop) {
    return <div className="text-center text-slate-500">Select a crop to see the details.</div>;
  }

  const cropName = crop.name.split('.').pop().charAt(0).toUpperCase() + crop.name.split('.').pop().slice(1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-2">{cropName}</h2>
        <div className="flex items-center space-x-4 text-slate-500">
          <span className="italic text-sm">{crop.scientificName}</span>
          <span className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">{crop.difficulty}</span>
        </div>
      </div>
      <img src={crop.heroImage} alt={cropName} className="w-full h-64 object-cover rounded-lg mb-8 shadow-md" />
      <CropCareTabs crop={crop} />
    </div>
  );
};

export default CropDetail;
