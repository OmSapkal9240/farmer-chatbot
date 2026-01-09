import React, { useState, useEffect } from 'react';
import { getWeather } from '../utils/weather';
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

const SearchForm = ({ isCentered, city, onCityChange, handleSearch, loading }) => (
  <form
    onSubmit={handleSearch}
    className={`w-full max-w-md flex items-center gap-2 p-2 bg-white/10 rounded-full backdrop-blur-sm transition-all duration-500 ${isCentered ? 'scale-110' : 'mb-8'}`}
  >
    <input
      type="text"
      value={city}
      onChange={onCityChange}
      placeholder="Enter a city name..."
      className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none px-4 text-lg"
    />
    <button type="submit" className="bg-blue-500 rounded-full p-3 hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-500" disabled={loading}>
      <Search size={22} />
    </button>
  </form>
);

export default function WeatherInsights() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    // Keep previous data while loading new city
    // setWeatherData(null);
    try {
      const data = await getWeather(cityName);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please check the city name.');
      setWeatherData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // No default fetch
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const commonProps = {
    city,
    onCityChange: (e) => setCity(e.target.value),
    handleSearch,
    loading,
  };

  return (
    <div className="weather-container p-4 text-white font-sans min-h-screen flex flex-col items-center" style={{ backgroundImage: `url(/background.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center p-4">
        {!weatherData && !loading && !error ? (
          <div className="flex flex-col justify-center items-center text-center h-screen">
            <h1 className="text-5xl font-bold mb-2">Weather Insights</h1>
            <p className="text-gray-300 mb-8">Get real-time weather forecasts for any city.</p>
            <SearchForm isCentered={true} {...commonProps} />
          </div>
        ) : (
          <>
            <SearchForm isCentered={false} {...commonProps} />
            {loading && (
              <div className="flex flex-col items-center justify-center mt-8">
                <div
                  style={{ animation: 'spin 1s linear infinite' }}
                  className="w-16 h-16 border-4 border-t-blue-500 border-white/20 rounded-full"
                />
                <p className="mt-4">Loading weather...</p>
              </div>
            )}
            {error && <p className="text-red-400 bg-red-900/50 p-4 rounded-lg mt-8">{error}</p>}
            {weatherData && (
              <div className="w-full max-w-md mt-8">
                <Header city={weatherData.city} />
                <CurrentWeather data={weatherData} />
                <HourlyForecast hourly={weatherData.hourly} />
                <TenDayForecast daily={weatherData.daily} />
              </div>
            )}
          </>
        )}
      </div>
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
  <div className="text-center mb-8">
    <h2 className="text-8xl font-thin relative">{data.currentTemp}°
      <span className="absolute top-0 -right-8 text-2xl">C</span>
    </h2>
    <p className="text-lg">{data.condition}</p>
    <p className="text-sm text-gray-400">Feels like {data.feelsLike}°</p>
    <p className="text-sm">High: {data.high}° • Low: {data.low}°</p>
  </div>
);

const HourlyForecast = ({ hourly }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8">
    <h3 className="text-sm text-gray-400 mb-4">Hourly forecast</h3>
    <div className="flex justify-between overflow-x-auto py-2">
      {hourly.map((h, i) => (
        <div key={i} className="flex flex-col items-center flex-shrink-0 px-3">
          <p className="text-sm">{h.time}</p>
          <HourlyIcon code={h.code} size={28} />
          <p className="font-bold">{h.temp}°</p>
        </div>
      ))}
    </div>
  </div>
);

const TenDayForecast = ({ daily }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
    <h3 className="text-sm text-gray-400 mb-2">10-day forecast</h3>
    {daily.map((d, i) => (
      <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-none">
        <p className="font-medium w-1/3">{i === 0 ? 'Today' : d.day}</p>
        <WeatherIcon code={d.code} size={28} />
        <p className="font-medium w-1/3 text-right">{d.low}° / {d.high}°</p>
      </div>
    ))}
  </div>
);
