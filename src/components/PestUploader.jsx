/**
 * @file PestUploader.jsx
 * @description This file belongs to the Pest Detection module. It provides the UI for uploading or capturing an image.
 * It includes a file size validator and a preview with simple rotation controls.
 * TODO: Add more advanced client-side image editing features like cropping.
 */

import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, RotateCcw, X } from 'lucide-react';

const MAX_FILE_SIZE_MB = 6;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const PestUploader = ({ onImageUpload, imagePreview, onClear }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      setError('');
      setRotation(0);
      onImageUpload(file);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="w-full p-6 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg text-center">
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-64 object-contain rounded-lg transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button onClick={handleRotate} className="p-2 bg-gray-700/80 rounded-full text-white hover:bg-gray-600" aria-label="Rotate Image">
              <RotateCcw size={20} />
            </button>
            <button onClick={onClear} className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-500" aria-label="Clear Image">
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <UploadCloud className="w-16 h-16 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300">Upload or Capture an Image</h3>
          <p className="text-gray-500 mt-1">Supports JPG, PNG. Max size: {MAX_FILE_SIZE_MB}MB.</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <input type="file" accept="image/jpeg, image/png" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
              Upload File
            </button>
            
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={() => cameraInputRef.current.click()} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Camera size={20} />
              Use Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PestUploader;
