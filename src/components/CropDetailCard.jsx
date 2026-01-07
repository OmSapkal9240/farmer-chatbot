// @/src/components/CropDetailCard.jsx

import React, { useState } from 'react';
import { BookOpen, Bug, ShieldCheck, TestTube2, CalendarDays, AlertTriangle } from 'lucide-react';
import RecommendedProducts from './RecommendedProducts';
import { getContextualTip } from '../utils/cropLogic';

// TabButton Component
const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 ${
      isActive
        ? 'text-teal-300 border-teal-400 bg-teal-900/30'
        : 'text-gray-400 border-transparent hover:bg-gray-700/50 hover:text-white'
    }`}>
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

// Main Component
const CropDetailCard = ({ crop }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!crop) return null;

  const contextualTip = getContextualTip(crop.id);
  const currentMonth = new Date().getMonth(); // 0-11

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Overview</h3>
            <p className="text-gray-300 mb-4">{crop.details.overview.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-300 mb-2">Climate Requirements</h4>
                <p className="text-gray-400 text-sm">{crop.details.overview.climate}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-300 mb-2">Soil Requirements</h4>
                <p className="text-gray-400 text-sm">{crop.details.overview.soil}</p>
              </div>
            </div>
          </div>
        );
      case 'symptoms':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Common Pests & Diseases</h3>
            <div className="space-y-4">
              {crop.details.symptoms.map((symptom, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-300 flex items-center gap-2"><Bug size={16} /> {symptom.name}</h4>
                  <p className="text-gray-400 text-sm mt-1">{symptom.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'management':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Management Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Do's</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {crop.details.management.dos.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-300 mb-2">Don'ts</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {crop.details.management.donts.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        );
      case 'fertilizer':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Fertilizer Plan</h3>
            <div className="space-y-4">
              {crop.details.fertilizer.plan.map((stage, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-300">{stage.stage}</h4>
                  <p className="text-gray-400 text-sm mt-1">{stage.recommendation}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 italic"><strong>Disclaimer:</strong> This is an advisory only. Consult a local agricultural expert for precise dosages.</p>
          </div>
        );
      case 'calendar':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Farming Calendar</h3>
            <div className="space-y-2">
              {crop.details.calendar.map((task, index) => (
                <div key={index} className={`flex items-start gap-4 p-3 rounded-lg border-l-4 ${
                  task.months.includes(currentMonth) ? 'bg-teal-900/50 border-teal-400' : 'bg-gray-800/50 border-gray-600'
                }`}>
                  <div className="font-semibold text-gray-300 w-28 flex-shrink-0">{task.monthRange}</div>
                  <div className="text-gray-400">{task.task}</div>
                  {task.months.includes(currentMonth) && <span className="text-xs font-bold text-teal-200 ml-auto">CURRENT</span>}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'symptoms', label: 'Symptoms', icon: Bug },
    { id: 'management', label: 'Management', icon: ShieldCheck },
    { id: 'fertilizer', label: 'Fertilizer', icon: TestTube2 },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  ];

  return (
    <div className="bg-[#132b45] rounded-xl border border-gray-700/50">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <h2 className="text-3xl font-bold text-white">{crop.name}</h2>
        <p className="text-gray-400 mt-1">{crop.details.basic.description}</p>
        
        {/* Basic Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Sowing Window</p>
                <p className="font-bold text-white text-md">{crop.details.basic.sowingWindow}</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Seed Rate</p>
                <p className="font-bold text-white text-md">{crop.details.basic.seedRate}</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Spacing</p>
                <p className="font-bold text-white text-md">{crop.details.basic.spacing}</p>
            </div>
        </div>
      </div>

      {/* Contextual Alert */}
      {contextualTip && (
        <div className="p-6 border-b border-gray-700/50">
          <div className="bg-yellow-900/40 border border-yellow-700 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="text-yellow-300 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-yellow-200">Seasonal Alert</h4>
              <p className="text-yellow-300 text-sm">{contextualTip}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Tabs */}
          <div className="border-b border-gray-700/50 px-4">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <TabButton 
                  key={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            <div key={activeTab} className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Recommended Products Sidebar */}
        <div className="lg:w-1/3 lg:border-l border-gray-700/50 p-6">
          <RecommendedProducts cropId={crop.id} />
        </div>
      </div>
    </div>
  );
};

export default CropDetailCard;
