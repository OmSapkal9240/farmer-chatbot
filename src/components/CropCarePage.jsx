/**
 * @file CropCarePage.jsx
 * @description Main feature component for the Crop Care module.
 * Manages the layout, state for selected crop, and renders the sidebar and detail views.
 * Handles responsiveness for desktop (two-column) and mobile (stacked) layouts.
 * TODO: Connect to a real weather API for localized advice based on PIN code.
 * TODO: Implement the chat context functionality with a real chat agent (e.g., OpenAI, Windsurf).
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { crops } from '../data/crops';
import CropSidebar from './CropSidebar';
import CropDetailCard from './CropDetailCard';

const CropCarePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    // Check URL params first, then localStorage, then default to the first crop
    const cropIdFromUrl = searchParams.get('crop');
    const lastViewedCropId = localStorage.getItem('lastViewedCrop');
    const initialCropId = cropIdFromUrl || lastViewedCropId || crops[0]?.id;

    if (initialCropId) {
      const crop = crops.find(c => c.id === initialCropId);
      if (crop) {
        setSelectedCrop(crop);
        // Ensure URL reflects the state if it wasn't the source
        if (!cropIdFromUrl || cropIdFromUrl !== initialCropId) {
          setSearchParams({ crop: initialCropId });
        }
      }
    }
  }, [searchParams, setSearchParams]);

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
    setSearchParams({ crop: crop.id });
    localStorage.setItem('lastViewedCrop', crop.id);
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-gray-100 text-gray-800 rounded-lg">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Crop Care Advisory</h1>
        <p className="text-gray-600">Your guide to healthy crops and better yields.</p>
      </header>
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Sidebar (becomes a top section on mobile) */}
        <aside className="w-full lg:w-1/3 lg:max-w-sm mb-6 lg:mb-0">
          <CropSidebar
            crops={crops}
            selectedCrop={selectedCrop}
            onSelectCrop={handleSelectCrop}
          />
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-2/3">
          {selectedCrop ? (
            <CropDetailCard crop={selectedCrop} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <p className="text-gray-500">Please select a crop to see the details.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CropCarePage;
