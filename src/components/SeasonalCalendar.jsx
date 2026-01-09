import React from 'react';
import { useTranslation } from 'react-i18next';
import { MONTHS } from '../utils/seasonUtils';

const SeasonalCalendar = ({ selectedMonth, onSelectMonth }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{t('seasonal.calendar.title')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {MONTHS.map(month => (
          <button
            key={month}
            onClick={() => onSelectMonth(month)}
            className={`py-3 px-2 text-sm font-bold rounded-lg transition-all duration-200 flex justify-center items-center text-center ${
              selectedMonth === month
                ? 'bg-green-600 text-white scale-105 shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {t(`months.${month.toLowerCase()}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeasonalCalendar;
