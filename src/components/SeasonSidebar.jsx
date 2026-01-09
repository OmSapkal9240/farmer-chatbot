import React from 'react';
import { useTranslation } from 'react-i18next';

const SeasonSidebar = ({ crops, selectedCrop, onSelectCrop, pin, onPinChange, isLoading, onGetAdvice }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <div>
        <label htmlFor="crop-select" className="block text-sm font-medium text-gray-300 mb-2">{t('seasonal.sidebar.select_crop')}</label>
        <select
          id="crop-select"
          value={selectedCrop ? selectedCrop.id : ''}
          onChange={(e) => {
            const crop = crops.find(c => c.id === e.target.value);
            onSelectCrop(crop);
          }}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="" disabled>{t('seasonal.sidebar.select_a_crop')}</option>
          {crops.map(crop => (
            <option key={crop.id} value={crop.id}>{crop.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pin-input" className="block text-sm font-medium text-gray-300 mb-2">{t('seasonal.sidebar.region_pin')}</label>
        <input
          id="pin-input"
          type="text"
          value={pin}
          onChange={(e) => onPinChange(e.target.value)}
          placeholder={t('seasonal.sidebar.enter_pin')}
          maxLength="6"
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-3">{t('seasonal.sidebar.filters')}</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="season-filter" className="block text-sm font-medium text-gray-300 mb-2">{t('seasonal.sidebar.season')}</label>
            <select id="season-filter" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>{t('seasonal.sidebar.all')}</option>
              <option>{t('seasonal.sidebar.kharif')}</option>
              <option>{t('seasonal.sidebar.rabi')}</option>
              <option>{t('seasonal.sidebar.zaid')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="practice-filter" className="block text-sm font-medium text-gray-300 mb-2">{t('seasonal.sidebar.farming_practice')}</label>
            <select id="practice-filter" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>{t('seasonal.sidebar.any')}</option>
              <option>{t('seasonal.sidebar.organic')}</option>
              <option>{t('seasonal.sidebar.conventional')}</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={onGetAdvice}
        disabled={isLoading || !selectedCrop || pin.length !== 6}
        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
      >
        {isLoading ? t('seasonal.sidebar.loading') : t('seasonal.sidebar.get_advice')}
      </button>
    </div>
  );
};

export default SeasonSidebar;
