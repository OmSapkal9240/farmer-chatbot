/**
 * @file SeasonalAdvicePage.jsx
 * @description This file belongs to the Seasonal Advice module. It's the main page component.
 * It manages the state for the selected crop, month, filters, and orchestrates the child components.
 * TODO: Replace mock loading with actual data fetching from a backend.
 */

import React, { useState, useEffect } from 'react';
import { SEASONAL_DATA } from '../data/seasonal';
import { getTasksForCropMonth, MONTHS } from '../utils/seasonUtils';
import SeasonSidebar from '../components/SeasonSidebar';
import SeasonalCalendar from '../components/SeasonalCalendar';
import SeasonalTips from '../components/SeasonalTips';

const SeasonalAdvicePage = () => {
  const [selectedCrop, setSelectedCrop] = useState(SEASONAL_DATA.crops[0]);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [pin, setPin] = useState('421302'); // Default PIN for demo
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading when crop or month changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      const newTasks = getTasksForCropMonth(selectedCrop.id, selectedMonth, pin);
      setTasks(newTasks);
      setIsLoading(false);
    }, 500); // 500ms mock delay

    return () => clearTimeout(timer);
  }, [selectedCrop, selectedMonth, pin]);

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-900 text-white rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-green-400">Seasonal Farming Advice</h1>
        <p className="text-gray-400 mt-2">Your monthly guide to optimal crop management.</p>
      </header>

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 lg:max-w-md mb-8 lg:mb-0">
          <SeasonSidebar
            crops={SEASONAL_DATA.crops}
            selectedCrop={selectedCrop}
            onSelectCrop={setSelectedCrop}
            pin={pin}
            onPinChange={setPin}
            currentMonth={selectedMonth}
            tasks={tasks}
          />
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-2/3">
          <SeasonalCalendar
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            tasksByMonth={SEASONAL_DATA.tasks[selectedCrop.id]}
          />
          <div className="mt-6">
            <SeasonalTips
              crop={selectedCrop}
              month={selectedMonth}
              tasks={tasks}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeasonalAdvicePage;
