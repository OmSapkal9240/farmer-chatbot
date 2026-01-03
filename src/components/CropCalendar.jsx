/**
 * @file CropCalendar.jsx
 * @description An interactive mini calendar component showing recommended tasks for each month.
 * Tasks are displayed as chips for the selected month.
 * This is a client-side component using mock data.
 * TODO: Integrate with a real scheduling or task management API.
 */

import React, { useState } from 'react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CropCalendar = ({ calendarData }) => {
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);

  const tasksForMonth = calendarData[selectedMonth] || ['No specific tasks for this month.'];

  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <h3 className="font-bold text-lg mb-4 text-[#e8f1ff]">Monthly Crop Calendar</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {months.map(month => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              selectedMonth === month
                ? 'bg-[#34e89e] text-black shadow-lg shadow-teal-500/30'
                : 'bg-white/10 text-[#9fb3c8] hover:bg-white/20 border border-white/10'
            }`}
          >
            {month}
          </button>
        ))}
      </div>
      <div className="mt-4 p-4 bg-black/20 rounded-md border border-white/10">
        <h4 className="font-semibold text-md mb-2 text-[#e8f1ff]">Tasks for {selectedMonth}:</h4>
        <ul className="list-disc list-inside space-y-1 text-[#9fb3c8]">
          {tasksForMonth.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CropCalendar;
