/**
 * @file SeasonExport.jsx
 * @description This file belongs to the Seasonal Advice module. It handles the UI for saving and exporting.
 * The export logic is purely client-side using Blobs.
 * TODO: Replace client-side save with a backend API call.
 */

import React from 'react';
import { Save, Download } from 'lucide-react';
import { formatExportData } from '../utils/seasonUtils';

const SeasonExport = ({ schedule, onSave }) => {

  const handleDownload = (format) => {
    const blob = formatExportData(schedule, format);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seasonal-schedule-${schedule.crop.id}-${schedule.month}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-6 border-t border-gray-700 space-y-4">
      <button 
        onClick={onSave}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Save size={20} />
        Save Schedule
      </button>
      <div className="flex gap-4">
        <button 
          onClick={() => handleDownload('json')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors"
        >
          <Download size={20} />
          Download JSON
        </button>
        <button 
          onClick={() => handleDownload('txt')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors"
        >
          <Download size={20} />
          Download Text
        </button>
      </div>
    </div>
  );
};

export default SeasonExport;
