/*
  Open-Meteo based weather helper (no API key).
  Uses Open-Meteo geocoding + forecast endpoints:
   - Geocoding: https://geocoding-api.open-meteo.com/v1/search?name={name}&count=1
   - Forecast:  https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,precipitation_sum&timezone=auto
  Exports:
    - getCoordsByPlace(query)  -> { lat, lon, name } or { error }
    - getCurrentWeatherByCoords(lat, lon) -> { current, daily, name } or { error }
    - getThreeDayForecastByCoords(lat, lon) -> daily[0..2] style array
  If geocoding fails or network error occurs, returns object `{ error: "...", mock: true }` with demo payload.
*/

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const demoCoords = { lat: 18.5204, lon: 73.8567, name: "Pune, IN" };

const demoCurrentAndDaily = {
  mock: true,
  name: "Demo Farm",
  current: {
    temp: 29,
    weather: "Partly cloudy",
    wind_kmh: 12,
    humidity: 62
  },
  daily: [
    { date: "2025-12-06", min: 21, max: 30, pop: 0.1 }, 
    { date: "2025-12-07", min: 20, max: 31, pop: 0.05 },
    { date: "2025-12-08", min: 22, max: 32, pop: 0.6 }
  ]
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error ${res.status}`);
  return res.json();
}

export async function getCoordsByPlace(query) {
  try {
    const q = encodeURIComponent(query);
    const url = `${GEOCODE_URL}?name=${q}&count=1&language=en&format=json`;
    const data = await fetchJson(url);
    if (!data || !data.results || data.results.length === 0) {
      return { error: "NOT_FOUND", message: "Location not found" };
    }
    const r = data.results[0];
    return { lat: r.latitude, lon: r.longitude, name: (r.name + (r.country ? ", " + r.country : "")) };
  } catch (err) {
    console.warn("Geocode error:", err.message);
    return { error: "GEO_ERROR", message: err.message, mock: true, ...demoCoords };
  }
}

export async function getCurrentWeatherByCoords(lat, lon) {
  try {
    // Use daily forecast with daily precipitation probability & temps; Open-Meteo does not give single "current" weather in the same way as others,
    // so we approximate current using today's daily values plus wind and temperature via "current_weather" param.
    const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,precipitation_sum&current_weather=true&timezone=auto`;
    const data = await fetchJson(url);
    if (!data) throw new Error("No data");
    const current = data.current_weather || {};
    // Build friendly current object
    const friendlyCurrent = {
      temp: current.temperature ?? (data.daily?.temperature_2m_max?.[0] ?? null),
      wind_kmh: current.windspeed ? Math.round(current.windspeed * 3.6) : null, // m/s -> km/h if necessary; open-meteo returns km/h for some params
      weather: current?.weathercode ?? null
    };
    // normalize daily: array of { date, min, max, pop }
    const daily = (data.daily?.time || []).map((d, i) => ({
      date: data.daily.time[i],
      min: data.daily.temperature_2m_min[i],
      max: data.daily.temperature_2m_max[i],
      pop: (data.daily.precipitation_probability_mean && data.daily.precipitation_probability_mean[i] !== undefined)
           ? data.daily.precipitation_probability_mean[i] / 100
           : ((data.daily.precipitation_sum && data.daily.precipitation_sum[i] > 0) ? 0.8 : 0)
    }));
    return { name: data.timezone ?? `${lat},${lon}`, current: friendlyCurrent, daily };
  } catch (err) {
    console.warn("Forecast error:", err.message);
    return { error: "FORECAST_ERROR", message: err.message, mock: true, ...demoCurrentAndDaily };
  }
}

export async function getThreeDayForecastByCoords(lat, lon, name = null) {
  const res = await getCurrentWeatherByCoords(lat, lon);
  if (res.error && res.mock) {
    // map demo daily to first 3 days
    return { mock: true, name: res.name || demoCurrentAndDaily.name, daily: demoCurrentAndDaily.daily.slice(0,3) };
  }
  return { mock: false, name: name || res.name, daily: (res.daily || []).slice(0,3), current: res.current };
}

export default {
  getCoordsByPlace,
  getCurrentWeatherByCoords,
  getThreeDayForecastByCoords
};
