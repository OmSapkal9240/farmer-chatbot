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
import CropSidebar from './CropSidebar';
import CropDetailCard from './CropDetailCard';
import { getCurrentLocation, getLocationDetails, getWeatherData, geocodeByPin } from '../utils/locationApi';
import { detectSeason, getRecommendedCrops } from '../utils/cropLogic';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorBanner from './ErrorBanner';
import ManualLocationInput from './ManualLocationInput';

const CropCarePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedCrops, setRecommendedCrops] = useState([]);

  useEffect(() => {
    const initialize = async (coords) => {
      try {
        setLoading(true);
        setError(null);
        const [locationDetails, weatherData] = await Promise.all([
          getLocationDetails(coords.latitude, coords.longitude),
          getWeatherData(coords.latitude, coords.longitude)
        ]);
        setLocation(locationDetails);
        setWeather(weatherData);

        const month = new Date().getMonth();
        const season = detectSeason(month, weatherData.rainfall);
        const crops = getRecommendedCrops(locationDetails.state, season);
        setRecommendedCrops(crops);

        const cropIdFromUrl = searchParams.get('crop');
        const lastViewedCropId = localStorage.getItem('lastViewedCrop');
        const initialCropId = cropIdFromUrl || lastViewedCropId || crops[0]?.id;
        
        const initialCrop = crops.find(c => c.id === initialCropId);
        setSelectedCrop(initialCrop || crops[0]);

        if (initialCrop && !cropIdFromUrl) {
          setSearchParams({ crop: initialCrop.id }, { replace: true });
        } else if (!initialCrop && crops.length > 0) {
          setSearchParams({ crop: crops[0].id }, { replace: true });
        }

      } catch (err) {
        console.error(err);
        setError('Could not fetch location or weather data. Please enable location services or enter a PIN code manually.');
      } finally {
        setLoading(false);
      }
    };

    const fetchInitialData = async () => {
      try {
        const coords = await getCurrentLocation();
        await initialize(coords);
      } catch (err) {
        console.error(err);
        setError('Geolocation permission denied. Please enter your PIN code manually.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [searchParams, setSearchParams]);

  const handlePinSubmit = async (pin) => {
    try {
      setLoading(true);
      setError(null);
      const locationData = await geocodeByPin(pin);
      const weatherData = await getWeatherData(locationData.lat, locationData.lon);
      setLocation(locationData);
      setWeather(weatherData);

      const month = new Date().getMonth();
      const season = detectSeason(month, weatherData.rainfall);
      const crops = getRecommendedCrops(locationData.state, season);
      setRecommendedCrops(crops);
      setSelectedCrop(crops[0]); // Auto-select the first crop
    } catch (err) {
      console.error(err);
      setError('Could not fetch data for the provided PIN code. Please check the PIN and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
    setSearchParams({ crop: crop.id });
    localStorage.setItem('lastViewedCrop', crop.id);
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-gradient-to-br from-[#0f1b2e] to-[#132b45] text-[#e8f1ff] rounded-lg">
      <header className="mb-6">
        {error && !loading && <ManualLocationInput onPinSubmit={handlePinSubmit} />}
        {error && <ErrorBanner message={error} />}
        <h1 className="text-3xl font-bold text-[#34e89e]">Crop Care Advisory</h1>
        <p className="text-[#9fb3c8]">Your guide to healthy crops and better yields.</p>
        {location && (
          <p className="text-sm text-teal-300 mt-1">
            Showing recommendations for: {location.district}, {location.state}
          </p>
        )}
      </header>
      {loading ? (
        <LoadingSkeleton />
      ) : (
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Sidebar (becomes a top section on mobile) */}
        <aside className="w-full lg:w-1/3 lg:max-w-sm mb-6 lg:mb-0">
          <CropSidebar
            crops={recommendedCrops}
            selectedCrop={selectedCrop}
            onSelectCrop={handleSelectCrop}
            weather={weather}
            location={location}
          />
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-2/3">
          {selectedCrop ? (
            <CropDetailCard crop={selectedCrop} weather={weather} location={location} />
          ) : (
            <div className="flex items-center justify-center h-full bg-[#0f1b2e]/50 rounded-lg">
              <p className="text-[#9fb3c8]">Please select a crop to see the details.</p>
            </div>
          )}
        </main>
      </div>
      )}
    </div>
  );
};

export default CropCarePage;
