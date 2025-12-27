/**
 * @file SeasonalAdvicePage.jsx
 * @description This file belongs to the Seasonal Advice module. It's the main page component.
 * It manages the state for the selected crop, month, filters, and orchestrates the child components.
 * TODO: Replace mock loading with actual data fetching from a backend.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getCoordinatesForPin, getWeatherForecast, getSeasonalAdvice } from '../utils/api';
import { MONTHS } from '../utils/seasonUtils';
import { SEASONAL_DATA } from '../data/seasonal';
import SeasonSidebar from '../components/SeasonSidebar';
import SeasonalCalendar from '../components/SeasonalCalendar';
import SeasonalTips from '../components/SeasonalTips';

const SeasonalAdvicePage = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [pin, setPin] = useState('');
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetAdvice = useCallback(async () => {
    if (!selectedCrop) {
      setError('Please select a crop.');
      return;
    }
    if (pin.length !== 6) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { latitude, longitude, name: region } = await getCoordinatesForPin(pin);
      const weatherData = await getWeatherForecast(latitude, longitude, selectedMonth);

      const weatherSummary = `Based on last year's data: Average temperature range: ${Math.min(...weatherData.temperature_2m_min).toFixed(1)}°C to ${Math.max(...weatherData.temperature_2m_max).toFixed(1)}°C. Total precipitation: ${weatherData.precipitation_sum.reduce((a, b) => a + b, 0).toFixed(1)}mm.`;

      const aiAdvice = await getSeasonalAdvice(selectedCrop, region, selectedMonth, weatherSummary);
      setAdvice(aiAdvice);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCrop, selectedMonth, pin]);

  const handleStartOver = () => {
    setAdvice(null);
    setError(null);
    setSelectedCrop(null);
    setPin('');
  };

  
    return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-900 text-white rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-green-400">Seasonal Farming Advice</h1>
        <p className="text-gray-400 mt-2">Your monthly guide to optimal crop management.</p>
      </header>

      <div>
        {advice ? (
          // Output View
          <div>
            <div className="text-center mb-6">
              <button 
                onClick={handleStartOver}
                className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                &larr; Start Over
              </button>
              <h2 className="text-2xl font-bold">Farming Advice for {selectedCrop.name} in {selectedMonth}</h2>
              <p className="text-gray-400">Location PIN: {pin}</p>
            </div>
            <SeasonalTips
              crop={selectedCrop}
              month={selectedMonth}
              advice={advice}
              isLoading={isLoading}
            />
          </div>
        ) : (
          // Input View
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <aside className="w-full lg:w-1/3 lg:max-w-md mb-8 lg:mb-0">
              <SeasonSidebar
                crops={SEASONAL_DATA.crops}
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
                pin={pin}
                onPinChange={setPin}
                isLoading={isLoading}
                onGetAdvice={handleGetAdvice}
              />
            </aside>
            <main className="w-full lg:w-2/3">
              <SeasonalCalendar
                selectedMonth={selectedMonth}
                onSelectMonth={setSelectedMonth}
              />
              <div className="mt-6 text-center p-4 bg-gray-800 rounded-lg">
                {error && <div className="text-red-500 mb-4">Error: {error}</div>}
                <p className="text-gray-400">Please select a crop, enter a PIN, and choose a month to get personalized advice.</p>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonalAdvicePage;
