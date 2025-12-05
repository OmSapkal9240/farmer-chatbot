// src/lib/weatherApi.js

// IMPORTANT: User must set this environment variable.
// VITE_OPENWEATHER_API_KEY in WindSurf → Project Settings → Environment
const KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function fetchWeather(url) {
  if (!KEY) {
    throw new Error('API key missing. Set VITE_OPENWEATHER_API_KEY in your environment.');
  }
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch weather data.');
  }
  return response.json();
}

export async function getCurrentWeatherByCity(city) {
  const url = `${API_BASE_URL}/weather?q=${city}&units=metric&appid=${KEY}`;
  return fetchWeather(url);
}

export async function getCurrentWeatherByCoords(lat, lon) {
  const url = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`;
  return fetchWeather(url);
}

export async function getThreeDayForecastByCoords(lat, lon) {
  // The 'onecall' endpoint provides daily forecast which is what we need.
  // We will get 8 days and use the next 3.
  const url = `${API_BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current,alerts&units=metric&appid=${KEY}`;
  const data = await fetchWeather(url);
  return data.daily.slice(1, 4); // Get forecast for the next 3 days
}
