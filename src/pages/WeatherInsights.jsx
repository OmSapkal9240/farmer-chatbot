import React, { useState, useEffect } from 'react';
import { getWeather } from '../utils/weather';
import { motion } from 'framer-motion';
import { MapPin, Sun, Cloud, CloudRain, CloudSnow, Moon, Search } from 'lucide-react';

const WeatherIcon = ({ code, size = 24 }) => {
  if (code >= 0 && code <= 1) return <Sun size={size} className="text-yellow-400" />;
  if (code >= 2 && code <= 3) return <Cloud size={size} className="text-gray-400" />;
  if (code >= 51 && code <= 67) return <CloudRain size={size} className="text-blue-400" />;
  if (code >= 71 && code <= 77) return <CloudSnow size={size} className="text-white" />;
  return <Cloud size={size} className="text-gray-400" />;
};

const HourlyIcon = ({ code, size = 24 }) => {
  if (code >= 0 && code <= 1) return <Moon size={size} className="text-gray-400" />;
  return <WeatherIcon code={code} size={size} />;
};

export default function WeatherInsights() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const fetchWeatherData = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);
    try {
      const data = await getWeather(cityName);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please check the city name.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData('Pune'); // Fetch default weather on mount
  }, []);

    const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  return (
    <div className="weather-container p-4 text-white font-sans min-h-screen flex flex-col items-center">
      <form onSubmit={handleSearch} className="w-full max-w-md flex items-center gap-2 p-2 bg-white/10 rounded-full mb-8">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city..."
          className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none px-4"
        />
        <button type="submit" className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition">
          <Search size={20} />
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {weatherData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Header city={weatherData.city} />
          <CurrentWeather data={weatherData} />
          <HourlyForecast hourly={weatherData.hourly} />
          <TenDayForecast daily={weatherData.daily} />
        </motion.div>
      )}
    </div>
  );
}

const Header = ({ city }) => (
  <div className="flex items-center justify-center p-2 mb-4">
    <MapPin size={20} className="mr-2" />
    <h1 className="text-xl font-bold">{city}</h1>
  </div>
);

const CurrentWeather = ({ data }) => (
  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-center mb-8">
    <h2 className="text-8xl font-thin relative">{data.currentTemp}°
      <span className="absolute top-0 -right-8 text-2xl">C</span>
    </h2>
    <p className="text-lg">{data.condition}</p>
    <p className="text-sm text-gray-400">Feels like {data.feelsLike}°</p>
    <p className="text-sm">High: {data.high}° • Low: {data.low}°</p>
  </motion.div>
);

const HourlyForecast = ({ hourly }) => (
  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8">
    <h3 className="text-sm text-gray-400 mb-4">Hourly forecast</h3>
    <div className="flex justify-between">
      {hourly.map((h, i) => (
        <div key={i} className="flex flex-col items-center">
          <p className="text-sm">{h.time}</p>
          <HourlyIcon code={h.code} size={28} />
          <p className="font-bold">{h.temp}°</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const TenDayForecast = ({ daily }) => (
  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
    <h3 className="text-sm text-gray-400 mb-2">10-day forecast</h3>
    {daily.map((d, i) => (
      <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-none">
        <div>
          <p className="font-medium">{i === 0 ? 'Today' : d.day}</p>
          <p className="text-xs text-gray-400">{d.date}</p>
        </div>
        <WeatherIcon code={d.code} size={28} />
        <p className="font-medium">{d.low}° / {d.high}°</p>
      </div>
    ))}
  </motion.div>
);
