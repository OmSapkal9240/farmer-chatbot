const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/**
 * Gets the user's current geographical position.
 * @returns {Promise<GeolocationCoordinates>} A promise that resolves with the coordinates.
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error)
    );
  });
};

/**
 * Fetches location details (state, district, PIN) from latitude and longitude.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<object>} A promise that resolves with the location details.
 */
export const getLocationDetails = async (lat, lon) => {
  if (!OPENCAGE_API_KEY) {
    throw new Error('OpenCage API key is missing.');
  }
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch location details from OpenCage API.');
  }
  const data = await response.json();
  const components = data.results[0]?.components;
  return {
    state: components?.state,
    district: components?.state_district || components?.county,
    pin: components?.postcode,
  };
};

/**
 * Fetches weather data from latitude and longitude.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<object>} A promise that resolves with the weather data.
 */

export const getWeatherData = async (lat, lon) => {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeatherMap API key is missing.');
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data from OpenWeatherMap API.');
  }
  const data = await response.json();
  return {
    temp: data.main.temp,
    humidity: data.main.humidity,
    rainfall: data.rain?.['1h'] || 0, // Rainfall in the last hour in mm
    wind: data.wind.speed, // Wind speed in m/s
  };
};
