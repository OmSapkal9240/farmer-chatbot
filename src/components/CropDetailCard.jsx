/**
 * @file CropDetailCard.jsx
 * @description Displays detailed information about a selected crop.
 * Includes a hero image, tabs for different information categories (Overview, Symptoms, etc.),
 * and renders the content for the active tab. Uses micro-animations for a polished feel.
 * TODO: Implement client-side PDF generation for the 'Download PDF' button.
 * TODO: Connect 'Save to My Farm' to a more persistent storage or user account feature.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Download, Save, Image as ImageIcon, ChevronDown } from 'lucide-react';
import CropCalendar from './CropCalendar';
import CropGallery from './CropGallery';
import Chatbot from './Chatbot';

const CropDetailCard = ({ crop }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleAccordionToggle = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleOpenGallery = (images) => {
    setGalleryImages(images);
    setGalleryOpen(true);
  };

  const handleDownloadPdf = () => {
    // Mock PDF generation
    const pdfContent = `Crop Care Plan for ${t(crop.name)}\n\n${JSON.stringify(crop, null, 2)}`;
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${crop.id}-care-plan.txt`; // Changed to .txt for simplicity
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Downloaded a sample plan. (mock)');
  };

  const handleSaveToFarm = () => {
    // Mock saving to localStorage
    let myFarm = JSON.parse(localStorage.getItem('myFarm')) || [];
    if (!myFarm.includes(crop.id)) {
      myFarm.push(crop.id);
      localStorage.setItem('myFarm', JSON.stringify(myFarm));
      alert(`${t(crop.name)} saved to 'My Farm'.`);
    }
  };

  const tabs = ['overview', 'management', 'fertilizer', 'calendar', 'chat'];

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside ml-2 text-[#9fb3c8]">
          {value.map((item, index) => (
            <li key={index}>{typeof item === 'object' ? renderObject(item) : item}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return renderObject(value);
    }
    return <p className="text-[#9fb3c8]">{value}</p>;
  };

  const renderObject = (obj) => (
    <div className="space-y-2 mt-1">
      {Object.entries(obj).map(([key, val]) => (
        <div key={key}>
          <strong className="text-[#e8f1ff] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
          <div className="pl-2">{renderValue(val)}</div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    if (!crop) return null;

    const sections = {
      overview: crop.overview,
      climate: crop.climateAndSoil,
      sowing: crop.sowingAndPlanting,
      irrigation: crop.irrigation,
      nutrients: crop.nutrientCare,
      pests: crop.pestAndDisease,
      weeds: crop.weedManagement,
      harvesting: crop.harvesting,
      tips: crop.farmerTips,
    };

    switch (activeTab) {
      case 'overview':
        return (
            <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5">
                {renderObject(sections.overview)}
                <h4 className="font-bold text-lg mb-2 text-[#e8f1ff] mt-4">Climate & Soil</h4>
                {renderObject(sections.climate)}
                <h4 className="font-bold text-lg mb-2 text-[#e8f1ff] mt-4">Sowing & Planting</h4>
                {renderObject(sections.sowing)}
            </div>
        );
      case 'management':
        return (
            <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5">
                <h4 className="font-bold text-lg mb-2 text-[#e8f1ff]">Irrigation</h4>
                {renderObject(sections.irrigation)}
                <h4 className="font-bold text-lg mb-2 text-[#e8f1ff] mt-4">Pest and Disease</h4>
                {renderObject(sections.pests)}
                <h4 className="font-bold text-lg mb-2 text-[#e8f1ff] mt-4">Weed Management</h4>
                {renderObject(sections.weeds)}
            </div>
        );
      case 'fertilizer':
        return (
            <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                <h4 className="font-bold text-lg mb-2 text-[#e8f1ff]">Nutrient Care</h4>
                {renderObject(sections.nutrients)}
            </div>
        );
      case 'calendar':
        return <CropCalendar calendarData={crop.growthCalendar} />;
      case 'chat':
        return <Chatbot crop={crop} />;
      default:
        return <p>Select a tab</p>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0f1b2e] to-[#132b45] border border-teal-300/20 rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img src={crop.heroImage} alt={`${t(crop.name)} hero banner`} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h2 className="text-3xl font-bold text-[#e8f1ff]">{t(crop.name)}</h2>
          <p className="text-[#9fb3c8] italic">{crop.scientificName}</p>
        </div>
        <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
          <Star size={14} />
          <span>Difficulty: Easy</span>
        </span>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="border-b border-white/10">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-3 px-2 border-b-2 font-semibold text-base capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-[#34e89e] text-[#34e89e]'
                      : 'border-transparent text-[#9fb3c8] hover:text-[#e8f1ff] hover:border-white/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleSaveToFarm} className="p-2 text-[#9fb3c8] hover:bg-white/10 rounded-full transition-colors" aria-label="Save to My Farm"><Save size={20} /></button>
            <button onClick={handleDownloadPdf} className="p-2 text-[#9fb3c8] hover:bg-white/10 rounded-full transition-colors" aria-label="Download as PDF"><Download size={20} /></button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      {isGalleryOpen && <CropGallery images={galleryImages} onClose={() => setGalleryOpen(false)} cropName={t(crop.name)} />}
    </div>
  );
};

export default CropDetailCard;
