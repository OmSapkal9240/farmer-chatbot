/**
 * @file seasonUtils.js
 * @description This file belongs to the Seasonal Advice module. It contains helper functions for the module.
 * TODO: Enhance these functions to interact with a real backend API.
 */

import { SEASONAL_DATA } from '../data/seasonal';

/**
 * Retrieves tasks for a specific crop and month, with mock adjustments based on PIN code.
 * @param {string} cropId - The ID of the crop (e.g., 'tomato').
 * @param {string} month - The name of the month (e.g., 'January').
 * @param {string} pin - The PIN code for mock regional adjustments.
 * @returns {Array} - An array of task objects for the given crop and month.
 */
export const getTasksForCropMonth = (cropId, month, pin) => {
  // TODO: Replace this with a real API call that uses the PIN code for localized advice.
  const cropTasks = SEASONAL_DATA.tasks[cropId];
  if (!cropTasks || !cropTasks[month]) {
    return [{ type: 'task', task: 'No specific advice for this month.' }];
  }

  let tasks = [...cropTasks[month]];

  // Mock logic based on PIN code
  if (pin && pin.length === 6) {
    const lastDigit = parseInt(pin.slice(-1), 10);
    if (lastDigit % 2 === 0) {
      // Even PIN: suggest moderate rainfall precautions
      tasks.push({ type: 'irrigate', task: 'Prepare for moderate rainfall; ensure good drainage.' });
    } else {
      // Odd PIN: suggest low rainfall precautions
      tasks.push({ type: 'irrigate', task: 'Conserve water; check soil moisture frequently.' });
    }
  }

  return tasks;
};

/**
 * Formats the seasonal schedule data for export.
 * @param {object} schedule - The schedule object containing crop, region, and tasks.
 * @param {string} format - The desired format ('json' or 'text').
 * @returns {Blob} - A Blob object containing the formatted data.
 */
export const formatExportData = (schedule, format = 'json') => {
  // TODO: Integrate a more robust client-side PDF/CSV generation library if needed.
  if (format === 'json') {
    const jsonString = JSON.stringify(schedule, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  } else {
    // Simple text format
    let textContent = `Seasonal Schedule\n`;
    textContent += `--------------------\n`;
    textContent += `Crop: ${schedule.crop.name}\n`;
    textContent += `Region/PIN: ${schedule.pin}\n`;
    textContent += `Month: ${schedule.month}\n\n`;
    textContent += `Tasks:\n`;
    schedule.tasks.forEach(task => {
      textContent += `- [${task.type.toUpperCase()}] ${task.task}\n`;
    });
    return new Blob([textContent], { type: 'text/plain' });
  }
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
