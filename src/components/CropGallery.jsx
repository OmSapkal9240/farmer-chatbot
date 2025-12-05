/**
 * @file CropGallery.jsx
 * @description A modal component for displaying a gallery of symptom images.
 * Allows users to view larger images and includes a 'Report Issue' CTA.
 * TODO: Connect 'Report Issue' to a pest-diagnosis model or a human expert chat.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

const CropGallery = ({ images, onClose, cropName }) => {

  const handleReportIssue = (image) => {
    const message = `Image attached for ${cropName} — please diagnose.`;
    alert(`Issue reported (mock):\n"${message}"\nImage: ${image}`);
    // TODO: Implement actual image upload and diagnosis request
    console.log('Diagnosis request:', { cropName, image, message });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full relative"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-500 hover:bg-gray-200 rounded-full z-10">
            <X size={24} />
          </button>
          
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Symptom Images for {cropName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden group">
                  <img src={image} alt={`Symptom ${index + 1}`} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <p className="text-sm text-gray-600 mb-2">Example Image {index + 1}</p>
                    <button 
                      onClick={() => handleReportIssue(image)}
                      className="w-full text-sm bg-red-500 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-red-600 flex items-center justify-center space-x-1.5"
                    >
                      <AlertTriangle size={16} />
                      <span>Report Issue</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CropGallery;
