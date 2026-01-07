import { MONTHS } from './seasonUtils';

export const getCoordinatesForPin = async (pin) => {
  const VITE_RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!VITE_RAPIDAPI_KEY) {
    throw new Error('VITE_RAPIDAPI_KEY is not set in the environment. Please add it to your .env file.');
  }

  if (!/^[1-9][0-9]{5}$/.test(pin)) {
    throw new Error('Invalid PIN code.');
  }

  const url = `https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${pin}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': VITE_RAPIDAPI_KEY,
      'x-rapidapi-host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
    }
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Failed to fetch location data from RapidAPI.');
  }

  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error('PIN code not found or API error.');
  }

  const location = data[0];
  const { lat, lng, district, state } = location;
  const name = `${district}, ${state}`;

  if (!lat || !lng) {
    throw new Error('Could not find coordinates for the location.');
  }

  return { latitude: parseFloat(lat), longitude: parseFloat(lng), name };
};

export const getWeatherForecast = async (latitude, longitude, month) => {
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex === -1) {
    throw new Error('Invalid month provided.');
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const year = monthIndex > currentMonth ? currentYear - 1 : currentYear;

  const startDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];
  const endDate = new Date(year, monthIndex + 1, 0).toISOString().split('T')[0];

  const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather forecast data.');
  }
  const data = await response.json();
  return data.daily;
};

export const getWeather = async (cityName) => {
  if (!cityName) return null;

  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();
    if (!geoData.results) throw new Error('City not found');
    const { latitude, longitude, name } = geoData.results[0];

    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
    const data = await weatherResponse.json();

    const now = new Date();
    const timeIndex = data.hourly.time.findIndex(t => new Date(t) >= now);

    return {
      city: name,
      currentTemp: Math.round(data.hourly.temperature_2m[timeIndex]),
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
      condition: 'Clear', // Simplified
      feelsLike: Math.round(data.hourly.temperature_2m[timeIndex] - 2), // Simplified
      hourly: data.hourly.time.slice(timeIndex, timeIndex + 5).map((t, i) => ({
        time: new Date(t).getHours() + ':00',
        temp: Math.round(data.hourly.temperature_2m[timeIndex + i]),
        code: data.hourly.weathercode[timeIndex + i],
      })),
      daily: data.daily.time.slice(0, 10).map((d, i) => ({
        day: new Date(d).toLocaleDateString('en-US', { weekday: 'long' }),
        date: new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        code: data.daily.weathercode[i],
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
      })),
    };
  } catch (err) {
    console.error('Failed to fetch weather data:', err);
    throw err;
  }
};
