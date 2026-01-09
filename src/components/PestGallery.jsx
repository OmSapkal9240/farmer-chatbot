/**
 * @file PestGallery.jsx
 * @description This file belongs to the Pest Detection module. It's a modal for displaying example images.
 * TODO: Enhance with features like side-by-side comparison with the user's uploaded image.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PestGallery = ({ images, pestName, onClose }) => {
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full relative text-white"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-400 hover:bg-gray-700 rounded-full z-10">
            <X size={24} />
          </button>
          
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Example Images: {pestName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {images.map((image, index) => (
                <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
                  <img src={image} alt={`Example ${index + 1}`} className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PestGallery;
