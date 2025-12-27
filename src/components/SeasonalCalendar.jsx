/**
 * @file SeasonalCalendar.jsx
 * @description This file belongs to the Seasonal Advice module. It displays an interactive calendar.
 * It shows months as selectable chips and indicates which months have tasks.
 * TODO: Add more sophisticated visualizations, like a Gantt chart view of tasks.
 */

import React from 'react';
import { MONTHS } from '../utils/seasonUtils';


const SeasonalCalendar = ({ selectedMonth, onSelectMonth }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Crop Calendar</h2>
      <div className="flex flex-wrap gap-3">
        {MONTHS.map(month => (
          <button
            key={month}
            onClick={() => onSelectMonth(month)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 w-28 h-16 flex justify-center items-center ${
              selectedMonth === month
                ? 'bg-green-600 text-white scale-105 shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeasonalCalendar;
