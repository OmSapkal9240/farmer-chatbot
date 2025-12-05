// src/pages/WeatherInsights.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Wind, Droplets, Sunrise, Sunset, Search, MapPin } from 'lucide-react';
import { getCurrentWeatherByCity, getCurrentWeatherByCoords, getThreeDayForecastByCoords } from '../lib/weatherApi';
import WeatherCard from '../components/WeatherCard';

const WeatherInsights = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async (latitude, longitude, cityName) => {
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);

    try {
      const currentWeatherData = cityName
        ? await getCurrentWeatherByCity(cityName)
        : await getCurrentWeatherByCoords(latitude, longitude);

      const forecastData = await getThreeDayForecastByCoords(
        currentWeatherData.coord.lat,
        currentWeatherData.coord.lon
      );

      setWeather(currentWeatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchWeatherData(null, null, query);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude, null);
        },
        (err) => {
          setError('Geolocation failed. Please enable location services or use the search bar.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const getFarmingAdvice = () => {
    if (!weather) return [];
    const advice = [];
    if (weather.main.temp > 35) {
      advice.push('High heat: Water crops early in the morning or late in the evening to reduce evaporation.');
    }
    if (weather.main.humidity > 80) {
      advice.push('High humidity: Increased risk of fungal diseases. Avoid spraying and ensure good air circulation.');
    }
    if (weather.wind.speed > 8) { // 8 m/s
      advice.push('High winds: Avoid spraying pesticides or herbicides as they may drift.');
    }
    // Note: OpenWeather 'onecall' for forecast includes rain probability, but the basic 'weather' endpoint doesn't.
    // This is a placeholder; for accurate rain chance, the API structure would need adjustment.
    if (weather.weather[0].main === 'Rain') {
        advice.push('Rain expected: Postpone applying fertilizers or pesticides to prevent washout.');
    }
    return advice.length > 0 ? advice : ['Weather conditions are favorable. Monitor crops as usual.'];
  };

  const farmingAdvice = getFarmingAdvice();

  const containerVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
  };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 relative overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <motion.div 
        className="max-w-4xl mx-auto z-10 relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-orbitron text-center mb-8 font-bold tracking-wider">Weather Insights</motion.h1>

        <motion.form variants={itemVariants} onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city or pincode..."
            className="flex-grow bg-white/10 backdrop-blur-md text-white placeholder-gray-400 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          <div className="flex gap-4">
            <button type="submit" className="w-full sm:w-auto flex-1 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold rounded-full px-6 py-3 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-400/50 glow-on-hover">
              <Search className="inline-block mr-2" /> Search
            </button>
            <button type="button" onClick={handleGeolocation} className="w-full sm:w-auto flex-1 bg-white/10 backdrop-blur-md text-white font-bold rounded-full px-6 py-3 hover:bg-white/20 transition-colors duration-300 shadow-lg hover:shadow-emerald-400/50 glow-on-hover">
              <MapPin className="inline-block mr-2" /> Use My Location
            </button>
          </div>
        </motion.form>

        {loading && <div className="text-center text-lg">Loading weather data...</div>}
        {error && <div className="text-center bg-red-500/30 p-4 rounded-xl">Error: {error}</div>}

        {weather && (
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            {/* Main Summary Card */}
            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
              <div>
                <h2 className="text-3xl font-bold font-orbitron">{weather.name}</h2>
                <p className="text-gray-300 capitalize">{weather.weather[0].description}</p>
              </div>
              <div className="flex items-center">
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather icon" className="w-24 h-24 sm:w-32 sm:h-32" />
                <p className="text-5xl sm:text-7xl font-bold">{Math.round(weather.main.temp)}°C</p>
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <MetricCard icon={<Droplets />} title="Humidity" value={`${weather.main.humidity}%`} />
              <MetricCard icon={<Wind />} title="Wind Speed" value={`${(weather.wind.speed * 3.6).toFixed(1)} km/h`} />
              <MetricCard icon={<Sunrise />} title="Sunrise" value={new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
              <MetricCard icon={<Sunset />} title="Sunset" value={new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
            </motion.div>

            {/* 3-Day Forecast */}
            <motion.h3 variants={itemVariants} className="text-2xl font-orbitron font-bold mb-4">3-Day Forecast</motion.h3>
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {forecast.map((day, index) => (
                <WeatherCard
                  key={index}
                  day={new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                  icon={day.weather[0].icon}
                  maxTemp={day.temp.max}
                  minTemp={day.temp.min}
                  tip={getForecastTip(day)}
                />
              ))}
            </motion.div>

            {/* Farming Advice */}
            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8">
              <h3 className="text-2xl font-orbitron font-bold mb-4">Farming Advice</h3>
              <ul className="list-disc list-inside space-y-2 text-emerald-200">
                {farmingAdvice.map((advice, index) => <li key={index}>{advice}</li>)}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const MetricCard = ({ icon, title, value }) => (
  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 flex flex-col items-center justify-center text-center">
    <div className="text-cyan-300 mb-2">{React.cloneElement(icon, { size: 32 })}</div>
    <p className="text-gray-300 text-sm">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const getForecastTip = (day) => {
    if (day.temp.max > 35) return "High heat stress. Ensure adequate water.";
    if ((day.rain || 0) > 5) return "Rain expected. Check drainage."; // rain is in mm
    if (day.wind_speed > 8) return "Windy. Protect young plants.";
    if (day.humidity > 80) return "High humidity. Watch for fungus.";
    return "Conditions look stable.";
}

export default WeatherInsights;
