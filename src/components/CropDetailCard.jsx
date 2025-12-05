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

  const tabs = ['overview', 'symptoms', 'management', 'fertilizer', 'calendar'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <p className="text-gray-700">{t(crop.overview.description)}</p>
            <div>
              <h4 className="font-semibold">Ideal Sowing Window:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {crop.overview.sowingWindow.map(month => (
                  <span key={month} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{month}</span>
                ))}
              </div>
            </div>
            <p><strong>Spacing:</strong> {crop.overview.spacing}</p>
            <p><strong>Seed Rate:</strong> {crop.overview.seedRate}</p>
          </div>
        );
      case 'symptoms':
        return (
          <div className="space-y-3">
            {crop.symptoms.map(symptom => (
              <div key={symptom.id} className="border rounded-md">
                <button onClick={() => handleAccordionToggle(symptom.id)} className="w-full p-4 text-left flex justify-between items-center">
                  <span className="font-semibold">{t(symptom.name)}</span>
                  <ChevronDown className={`transform transition-transform ${openAccordion === symptom.id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === symptom.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t bg-gray-50">
                        <p><strong>Cause:</strong> {symptom.cause}</p>
                        <div className="mt-2">
                          <strong className="text-green-600">Do:</strong>
                          <ul className="list-disc list-inside ml-2">{symptom.action.do.map(d => <li key={d}>{d}</li>)}</ul>
                        </div>
                        <div className="mt-2">
                          <strong className="text-red-600">Don't:</strong>
                          <ul className="list-disc list-inside ml-2">{symptom.action.dont.map(d => <li key={d}>{d}</li>)}</ul>
                        </div>
                        <button onClick={() => handleOpenGallery(symptom.images)} className="mt-3 text-sm text-blue-600 hover:underline flex items-center space-x-1">
                          <ImageIcon size={16} />
                          <span>See Example Images</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        );
      case 'management':
        return (
          <div className="space-y-4">
            {crop.management.map(stage => (
              <div key={stage.stage} className="p-4 border rounded-lg bg-white">
                <h4 className="font-bold text-lg mb-2">{stage.stage}</h4>
                <p className="font-semibold">Organic Options:</p>
                <ul className="list-disc list-inside ml-2 mb-2">{stage.organic.map(o => <li key={o}>{o}</li>)}</ul>
                <p className="font-semibold">Chemical Options:</p>
                <ul className="list-disc list-inside ml-2">{stage.chemical.map(c => <li key={c}>{c}</li>)}</ul>
                <p className="mt-3 text-sm text-red-700 bg-red-100 p-2 rounded-md"><strong>Safety Note:</strong> {stage.safetyNote}</p>
              </div>
            ))}
          </div>
        );
      case 'fertilizer':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-semibold">Timing</th>
                  <th className="p-3 text-left font-semibold">N-P-K Ratio</th>
                  <th className="p-3 text-left font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {crop.fertilizerSchedule.map(item => (
                  <tr key={item.timing} className="border-b">
                    <td className="p-3">{item.timing}</td>
                    <td className="p-3 font-mono">{item.npk}</td>
                    <td className="p-3">{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'calendar':
        return <CropCalendar calendarData={crop.calendar} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img src={crop.heroImage} alt={`${t(crop.name)} hero banner`} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h2 className="text-3xl font-bold text-white">{t(crop.name)}</h2>
          <p className="text-gray-200 italic">{crop.scientificName}</p>
        </div>
        <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
          <Star size={14} />
          <span>Difficulty: Easy</span>
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleSaveToFarm} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Save to My Farm"><Save size={20} /></button>
            <button onClick={handleDownloadPdf} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Download as PDF"><Download size={20} /></button>
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
