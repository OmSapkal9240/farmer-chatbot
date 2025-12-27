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
