/**
 * @file SeasonalTips.jsx
 * @description This file belongs to the Seasonal Advice module. It displays detailed tasks and tips.
 * It includes i18n for tips, a 'Why' tooltip, and a 'Mark done' feature using localStorage.
 * TODO: Sync the 'done' status with a user account backend.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getWeather } from '../utils/weather';
import { CheckCircle, Info, Bell } from 'lucide-react';
import { SEASONAL_DATA } from '../data/seasonal';
import WeatherCard from './WeatherCard';

const TaskItem = ({ task, cropId, month }) => {
  const taskId = `${cropId}-${month}-${task.task}`;
  const [isDone, setIsDone] = useState(() => localStorage.getItem(taskId) === 'true');

  const handleToggleDone = () => {
    const newStatus = !isDone;
    setIsDone(newStatus);
    localStorage.setItem(taskId, newStatus);
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-md transition-colors ${isDone ? 'bg-green-900/50 text-gray-500' : 'bg-gray-700/50'}`}>
      <span className={`${isDone ? 'line-through' : ''}`}>{task.task}</span>
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-white" title="Set Reminder (mock)"><Bell size={16} /></button>
        <button onClick={handleToggleDone} className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white">
          <CheckCircle size={16} className={`${isDone ? 'text-green-400' : ''}`} />
          <span>{isDone ? 'Done' : 'Mark Done'}</span>
        </button>
      </div>
    </div>
  );
};

const SeasonalTips = ({ crop, month, tasks, isLoading }) => {
  const { t, i18n } = useTranslation();
  const tips = SEASONAL_DATA.tips[crop.id] || {};
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const data = await getWeather('Pune'); // Hardcoded for now, can be dynamic
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setWeatherData(null); // Clear previous data on error
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [i18n.language]);

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-300 mb-3 text-lg">Weather Insights</h3>
        <WeatherCard weatherData={weatherData} isLoading={weatherLoading} />
      </div>

      <h2 className="text-xl font-bold mb-4">Tasks & Tips for {month}</h2>
      
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-gray-300">Tasks:</h3>
        {tasks.map((task, index) => (
          <TaskItem key={index} task={task} cropId={crop.id} month={month} />
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-300">Contextual Tips:</h3>
        {Object.entries(tips).map(([key, tip]) => (
          <div key={key} className="p-4 bg-gray-700/50 rounded-md">
            <h4 className="font-bold capitalize text-green-400">{key}</h4>
            <p className="text-gray-300 mt-1">{t(tip[i18n.language] || tip.en)}</p>
            <div className="group relative inline-block mt-2">
              <Info size={16} className="text-blue-400 cursor-pointer" />
              <div className="absolute bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {tip.why}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonalTips;
