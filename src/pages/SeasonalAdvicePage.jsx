// @/src/pages/CropCarePage.jsx
// This file implements the complete Crop Care module using a robust, isolated provider pattern.

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBrowserLocation, getLocationFromCoords } from '../utils/location';
import { CROP_CARE_DETAILS, CROP_RECOMMENDATION_RULES, detectSeason } from '../data/cropData';

import CropSidebar from '../components/CropSidebar';
import CropDetailCard from '../components/CropDetailCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorBanner from '../components/ErrorBanner';
import { RefreshCw, MapPin } from 'lucide-react';

// Location Provider: Manages all location state and logic, ensuring it's scoped to Crop Care.
const CropCareLocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchAndSetLocation = async () => {
      setLoading(true);
      const cachedLocation = localStorage.getItem('cropCareLocation');

      if (cachedLocation) {
        try {
          const parsedLocation = JSON.parse(cachedLocation);
          setLocation(parsedLocation);
          setLoading(false);
          return;
        } catch (e) {
          localStorage.removeItem('cropCareLocation');
        }
      }

      setInfo('Requesting location permission...');
      try {
        const coords = await getBrowserLocation();
        setInfo('Permission granted. Fetching location details...');
        const locationDetails = await getLocationFromCoords(coords.latitude, coords.longitude);
        setLocation(locationDetails);
        localStorage.setItem('cropCareLocation', JSON.stringify(locationDetails));
      } catch (err) {
        setError(err.message || 'Could not determine your location. Please enable location services in your browser.');
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetLocation();
  }, []);

  const handleChangeLocation = () => {
    localStorage.removeItem('cropCareLocation');
    window.location.reload();
  };

  return children({ location, loading, error, info, handleChangeLocation });
};

// UI Component: Renders the UI based on props from the provider.
const CropCareUI = ({ location, loading, error, info, handleChangeLocation }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [recommendedCrops, setRecommendedCrops] = useState([]);

  useEffect(() => {
    if (location) {
      const month = new Date().getMonth();
      const season = detectSeason(month);
      const stateRules = CROP_RECOMMENDATION_RULES[location.state] || CROP_RECOMMENDATION_RULES.default;
      const cropIds = stateRules[season] || [];
      const crops = cropIds.map(id => CROP_CARE_DETAILS[id]).filter(Boolean);
      setRecommendedCrops(crops);

      const cropIdFromUrl = searchParams.get('crop');
      const initialCrop = crops.find(c => c.id === cropIdFromUrl);

      if (initialCrop) {
        setSelectedCropId(initialCrop.id);
      } else if (crops.length > 0) {
        setSelectedCropId(crops[0].id);
      }
    }
  }, [location]);

  useEffect(() => {
    if (selectedCropId) {
      setSearchParams({ crop: selectedCropId }, { replace: true });
    }
  }, [selectedCropId, setSearchParams]);

  const handleSelectCrop = (crop) => {
    setSelectedCropId(crop.id);
  };

  const selectedCrop = CROP_CARE_DETAILS[selectedCropId];

  return (
    <div className="container mx-auto p-4 font-sans bg-gradient-to-br from-[#0f1b2e] to-[#132b45] text-[#e8f1ff] rounded-lg">
      <header className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#34e89e]">Crop Care Advisory</h1>
            <p className="text-[#9fb3c8]">Your guide to healthy crops and better yields.</p>
          </div>
          {location && (
            <button onClick={handleChangeLocation} className="flex items-center gap-2 text-sm text-teal-300 bg-teal-900/50 hover:bg-teal-900/80 px-3 py-2 rounded-md transition-colors">
              <RefreshCw size={14} />
              Change Location
            </button>
          )}
        </div>

        {location && !error && (
          <div className="mt-4 p-3 bg-teal-900/50 border border-teal-700 rounded-lg flex items-center gap-3">
            <MapPin className="text-teal-300" size={20} />
            <span className="text-base text-teal-100">
              Crop advice for <strong>{location.district}, {location.state}</strong>
            </span>
          </div>
        )}

        {info && !location && <ErrorBanner message={info} type="info" />}
        {error && <ErrorBanner message={error} type="error" />}
      </header>

      {loading ? (
        <LoadingSkeleton />
      ) : location ? (
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <aside className="w-full lg:w-1/3 lg:max-w-sm mb-6 lg:mb-0">
            <CropSidebar
              crops={recommendedCrops}
              selectedCrop={selectedCrop}
              onSelectCrop={handleSelectCrop}
              location={location}
            />
          </aside>
          <main className="w-full lg:w-2/3">
            {selectedCrop ? (
              <CropDetailCard crop={selectedCrop} />
            ) : (
              <div className="flex items-center justify-center h-full bg-[#0f1b2e]/50 rounded-lg p-8 text-center">
                <p className="text-[#9fb3c8]">No recommended crops found for your location and season. Try changing the filters.</p>
              </div>
            )}
          </main>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-400">Please grant location access to receive personalized crop advisories.</p>
        </div>
      )}
    </div>
  );
};

// Main export that wraps the UI with the location provider.
const CropCarePage = () => (
  <CropCareLocationProvider>
    {(props) => <CropCareUI {...props} />}
  </CropCareLocationProvider>
);

export default CropCarePage;
