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
import { getCurrentLocation, getLocationDetails, getWeatherData } from '../utils/locationApi';
import { detectSeason, getRecommendedCrops } from '../utils/cropLogic';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorBanner from './ErrorBanner';

const CropCarePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('📍 Detecting your location using GPS…');
    const [error, setError] = useState(null);
  const [isGpsDenied, setIsGpsDenied] = useState(false);
  const [recommendedCrops, setRecommendedCrops] = useState([]);

    useEffect(() => {
    const isSecureContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    const handleGpsError = (error) => {
      console.error('GPS Error:', error);
      let message = 'Unable to access GPS location. Please allow location access in browser settings and retry.';
      if (error.code === 1) { // PERMISSION_DENIED
        message = 'Location access was denied. Please enable it in your browser settings to get crop advice.';
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        message = 'Your location could not be determined at this time. Please try again.';
      } else if (error.code === 3) { // TIMEOUT
        message = 'The request to get your location timed out. Please try again.';
      }
      setError(message);
      setLoading(false);
    };

    const fetchGpsLocation = () => {
      setLoadingMessage('📍 Detecting your location using GPS…');
      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationDetails = await getLocationDetails(latitude, longitude);
            localStorage.setItem('cropCareLocation', JSON.stringify({ coords: { latitude, longitude }, details: locationDetails }));
            await initialize({ latitude, longitude }, locationDetails);
          } catch (initError) {
            console.error('Initialization Error:', initError);
            setError('Could not load crop recommendations. Please try again.');
            setLoading(false);
          }
        },
        handleGpsError,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    };

    const checkPermissionsAndFetch = async () => {
      if (!isSecureContext) {
        setError('Location requires a secure connection (HTTPS) or localhost to work in browsers.');
        setLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
        return;
      }

      const cachedLocation = localStorage.getItem('cropCareLocation');
      if (cachedLocation) {
        try {
          const parsedLocation = JSON.parse(cachedLocation);
          await initialize(parsedLocation.coords, parsedLocation.details);
          return;
        } catch (e) {
          console.warn('Could not parse cached location, fetching fresh data.');
          localStorage.removeItem('cropCareLocation');
        }
      }

      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        if (permissionStatus.state === 'granted') {
          fetchGpsLocation();
        } else if (permissionStatus.state === 'prompt') {
          fetchGpsLocation();
        } else if (permissionStatus.state === 'denied') {
          setError('Location access was denied. Please enable it in your browser settings to get crop advice.');
          setLoading(false);
        }
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            fetchGpsLocation();
          }
        };
      } catch (permError) {
        console.error('Permission query error:', permError);
        // Fallback for browsers that might not support permissions.query
        fetchGpsLocation();
      }
    };

    const initialize = async (coords, locationDetails) => {
      setLoadingMessage('Fetching weather and crop data…');
      try {
        const weatherData = await getWeatherData(coords.latitude, coords.longitude);
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
        console.error('Initialization Error:', err);
        setError('Could not load crop recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkPermissionsAndFetch();
  }, [searchParams, setSearchParams]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Re-trigger the effect
    window.location.reload();
  };


  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
    setSearchParams({ crop: crop.id });
    localStorage.setItem('lastViewedCrop', crop.id);
  };

  return (
    <div className="container mx-auto p-4 font-sans rounded-lg">
      <header className="mb-6">
                        {error && <ErrorBanner message={error} onRetry={handleRetry} />}
        {!loading && !error && location && (
          <div className="bg-green-500/10 border border-green-400 text-green-300 text-sm rounded-lg p-3 mb-4">
            📍 Crop advice for {location.district}, {location.state}
          </div>
        )}
        <h1 className="text-3xl font-bold text-[#34e89e]">Crop Care Advisory</h1>
        <p className="text-[#9fb3c8]">Your guide to healthy crops and better yields.</p>
              </header>
      {loading ? (
                <div className="text-center py-10">
          <p className="text-lg text-gray-400">{loadingMessage}</p>
        </div>
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
                            <p className="text-[#9fb3c8]">Waiting for location to load crop recommendations…</p>
            </div>
          )}
        </main>
      </div>
      )}
    </div>
  );
};

export default CropCarePage;
