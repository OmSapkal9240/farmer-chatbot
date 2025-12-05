/**
 * @file SeasonalCalendar.jsx
 * @description This file belongs to the Seasonal Advice module. It displays an interactive calendar.
 * It shows months as selectable chips and indicates which months have tasks.
 * TODO: Add more sophisticated visualizations, like a Gantt chart view of tasks.
 */

import React from 'react';
import { MONTHS } from '../utils/seasonUtils';

const taskTypeColors = {
  sowing: 'bg-green-500',
  irrigate: 'bg-blue-500',
  fertilizer: 'bg-orange-500',
  'pest-alert': 'bg-red-500',
  harvest: 'bg-yellow-500',
  task: 'bg-gray-500',
};

const SeasonalCalendar = ({ selectedMonth, onSelectMonth, tasksByMonth }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Crop Calendar</h2>
      <div className="flex flex-wrap gap-3">
        {MONTHS.map(month => {
          const tasks = tasksByMonth[month] || [];
          const hasTasks = tasks.length > 0;

          return (
            <button
              key={month}
              onClick={() => onSelectMonth(month)}
              className={`relative px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 w-28 h-20 flex flex-col justify-between items-start ${
                selectedMonth === month
                  ? 'bg-green-600 text-white scale-105 shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{month}</span>
              {hasTasks && (
                <div className="flex space-x-1 self-end">
                  {tasks.slice(0, 3).map((task, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${taskTypeColors[task.type] || 'bg-gray-400'}`} title={task.type}></div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonalCalendar;
