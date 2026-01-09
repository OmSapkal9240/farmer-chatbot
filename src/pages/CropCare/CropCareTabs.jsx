import React, { useState } from 'react';
import InfoCard from './InfoCard';
import Accordion from './Accordion';

const CropCareTabs = ({ crop }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'cropCare', label: 'Crop Care' },
    { id: 'pestsAndDiseases', label: 'Pests & Diseases' },
    { id: 'fertilizer', label: 'Fertilizer' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'chat', label: 'Chat' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <InfoCard title="Overview" data={crop.overview} />;
      case 'cropCare':
        return (
          <div>
            <Accordion title="Climate and Soil"><InfoCard data={crop.climateAndSoil} /></Accordion>
            <Accordion title="Sowing and Planting"><InfoCard data={crop.sowingAndPlanting} /></Accordion>
            <Accordion title="Irrigation"><InfoCard data={crop.irrigation} /></Accordion>
            <Accordion title="Weed Management"><InfoCard data={crop.weedManagement} /></Accordion>
          </div>
        );
      case 'pestsAndDiseases':
        return <InfoCard title="Pest and Disease Care" data={crop.pestAndDisease} />;
      case 'fertilizer':
        return <InfoCard title="Nutrient and Fertilizer Care" data={crop.nutrientCare} />;
      case 'calendar':
        return <InfoCard title="Growth Stage Calendar" data={crop.growthCalendar} />;
      case 'chat':
        return <div>Chat with an expert about {crop.name}.</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default CropCareTabs;
