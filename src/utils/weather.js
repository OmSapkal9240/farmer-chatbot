import { MONTHS } from './seasonUtils';

export const getCoordinatesForPin = async (pin) => {
  if (!/^[1-9][0-9]{5}$/.test(pin)) {
    throw new Error('Invalid PIN code.');
  }
  const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
  if (!response.ok) {
    throw new Error('Failed to fetch location data.');
  }
  const data = await response.json();
  if (data[0].Status !== 'Success') {
    throw new Error('PIN code not found.');
  }
  const { District, State } = data[0].PostOffice[0];
  // Using a geocoding API to get lat/long from district and state
  const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${District},%20${State}&count=1&language=en&format=json`);
  const geoData = await geoResponse.json();
  if (!geoData.results) {
    throw new Error('Could not find coordinates for the location.');
  }
  const { latitude, longitude, name } = geoData.results[0];
  return { latitude, longitude, name };
};

export const getWeatherForecast = async (latitude, longitude, month) => {
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex === -1) {
    throw new Error('Invalid month provided.');
  }

  const year = new Date().getFullYear();
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
