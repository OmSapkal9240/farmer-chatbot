// @/src/utils/location.js

/**
 * @file location.js
 * @description Location-related utility functions for the Crop Care module.
 * Uses Browser Geolocation and OpenCage for reverse geocoding.
 */

// IMPORTANT: You must add your OpenCage API key to your .env file.
// Create a .env file in the root of your project and add the following line:
// VITE_OPENCAGE_API_KEY=your_api_key_here
const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

/**
 * Gets the user's current GPS location using the browser's Geolocation API.
 * @returns {Promise<object>} A promise that resolves with latitude and longitude.
 */
export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'An unknown error occurred while fetching location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please grant permission to get localized advice.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your connection or device settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        reject(new Error(errorMessage));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

/**
 * Converts latitude and longitude to detailed address information using OpenCage API.
 * @param {number} lat - The latitude.
 * @param {number} lon - The longitude.
 * @returns {Promise<object>} A promise that resolves with structured location details.
 */
export const getLocationFromCoords = async (lat, lon) => {
  if (!OPENCAGE_API_KEY) {
    throw new Error('OpenCage API key is missing. Please add it to your .env file.');
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}&language=en&pretty=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocoding request failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results.length === 0) {
      throw new Error('Could not find location details for the given coordinates.');
    }

    const components = data.results[0].components;
    return {
      latitude: lat,
      longitude: lon,
      city: components.city || components.town || components.village || 'N/A',
      district: components.state_district || components.county || 'N/A',
      state: components.state || 'N/A',
      pincode: components.postcode || 'N/A',
      country: components.country || 'N/A',
    };
  } catch (error) {
    console.error('Error fetching location details from OpenCage:', error);
    throw new Error('Failed to resolve location details. Please try again.');
  }
};


