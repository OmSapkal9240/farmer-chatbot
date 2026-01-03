/**
 * @file SeasonalTips.jsx
 * @description This file belongs to the Seasonal Advice module. It displays detailed tasks and tips.
 * It includes i18n for tips, a 'Why' tooltip, and a 'Mark done' feature using localStorage.
 * TODO: Sync the 'done' status with a user account backend.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Info, Bell, Wind, Droplets, Thermometer } from 'lucide-react';

const TaskItem = ({ task, tip, cropId, month }) => {
  const taskId = `${cropId}-${month}-${task.task}`;
  const [isDone, setIsDone] = useState(() => localStorage.getItem(taskId) === 'true');

  const handleToggleDone = () => {
    const newStatus = !isDone;
    setIsDone(newStatus);
    localStorage.setItem(taskId, newStatus);
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-md transition-colors ${isDone ? 'bg-green-900/50 text-gray-500' : 'bg-gray-700/50'}`}>
      <div>
        <span className={`${isDone ? 'line-through' : ''}`}>{task}</span>
        <p className={`text-xs text-gray-400 mt-1 ${isDone ? 'line-through' : ''}`}>{tip}</p>
      </div>
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

const SeasonalTips = ({ crop, month, advice, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          <div className="h-10 bg-gray-700 rounded mt-4"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!advice) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p>Select a crop, month, and PIN to get advice.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-300 mb-3 text-lg">Weather Insights for {month}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center">
            <Thermometer className="text-red-400 mb-2" size={24} />
            <span className="font-bold text-lg">{advice.weatherInsights.temperatureRange}</span>
            <span className="text-sm text-gray-400">Temperature</span>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center">
            <Droplets className="text-blue-400 mb-2" size={24} />
            <span className="font-bold text-lg">{advice.weatherInsights.rainfallLikelihood}</span>
            <span className="text-sm text-gray-400">Rainfall</span>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center">
            <Wind className="text-teal-400 mb-2" size={24} />
            <span className="font-bold text-lg">{advice.weatherInsights.humidityNote}</span>
            <span className="text-sm text-gray-400">Humidity</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Tasks & Tips for {month}</h2>
      <div className="space-y-3 mb-6">
        {advice.tasksAndTips.map((item, index) => (
          <TaskItem key={index} task={item.task} tip={item.tip} cropId={crop.id} month={month} />
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-300">Contextual Tips:</h3>
        {Object.entries(advice.contextualTips).map(([key, value]) => (
          <div key={key} className="p-4 bg-gray-700/50 rounded-md">
            <h4 className="font-bold capitalize text-green-400">{key.replace(/([A-Z])/g, ' $1')}</h4>
            <p className="text-gray-300 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-300">Quick Recommendations:</h3>
        <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
          {advice.quickRecommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SeasonalTips;
