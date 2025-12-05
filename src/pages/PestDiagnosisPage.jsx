/**
 * @file PestDiagnosisPage.jsx
 * @description This file belongs to the Pest Detection module. It is the main page component.
 * It orchestrates the image upload, model inference, and result display.
 * TODO: To replace the demo-model, put a TFJS model at /public/models/pest-model/model.json and then remove the fallback logic.
 * TODO: Replace mock event dispatches with actual chat panel integration.
 */

import React, { useState, useEffect, Suspense } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { PEST_DATA } from '../data/pests';
import PestUploader from '../components/PestUploader';
import PestResultCard from '../components/PestResultCard';
import { Loader } from 'lucide-react';

const PestDiagnosisPage = () => {
  const [model, setModel] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // TODO: Replace with a real model loader
  async function loadPestModel() {
    try {
      // Attempt to load the custom model
      const customModel = await tf.loadLayersModel('/models/pest-model/model.json');
      setModel(customModel);
      setIsFallback(false);
      console.log('Custom pest model loaded successfully.');
    } catch (e) {
      // Fallback to MobileNet if the custom model fails to load
      console.warn('Custom model not found or failed to load. Falling back to MobileNet demo.');
      const mobilenetModel = await mobilenet.load();
      setModel(mobilenetModel);
      setIsFallback(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    tf.ready().then(loadPestModel);
  }, []);

  // TODO: Replace with model-specific preprocessing
  const preprocessImage = async (imgElement) => {
    const tensor = tf.browser.fromPixels(imgElement).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    return isFallback ? tensor : tensor.div(255.0); // Normalize for custom model if needed
  };

  // TODO: Replace with real inference logic
  const predictImage = async (imgElement) => {
    if (!model) return;
    setIsLoading(true);
    setError('');
    setPredictions([]);

    try {
      const tensor = await preprocessImage(imgElement);
      let results;

      if (isFallback) {
        // Fallback logic using MobileNet embeddings + keyword matching
        const embeddings = model.infer(tensor, true);
        const keywords = (await embeddings.data()).toString().split(','); // Simplified keyword extraction
        
        // Simple rule-based matching against mock data
        results = PEST_DATA.map(pest => {
          const matchScore = pest.exampleKeywords.reduce((acc, kw) => acc + (keywords.some(k => k.includes(kw)) ? 1 : 0), 0);
          return { ...pest, confidence: matchScore / pest.exampleKeywords.length };
        }).sort((a, b) => b.confidence - a.confidence).slice(0, 3);

      } else {
        // Custom model prediction logic
        const modelPredictions = await model.predict(tensor).data();
        // This assumes your model output aligns with PEST_DATA indices
        results = Array.from(modelPredictions)
          .map((confidence, index) => ({ ...PEST_DATA[index], confidence }))
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 3);
      }
      
      setPredictions(results);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to analyze the image. Please try another one.');
    } finally {
      setIsLoading(false);
      tf.dispose(tensor);
    }
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        const img = document.createElement('img');
        img.src = e.target.result;
        img.onload = () => predictImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPredictions([]);
    setError('');
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-900 text-white rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-green-400">Pest & Disease Diagnosis</h1>
        <p className="text-gray-400 mt-2">Upload an image of the affected crop to get an instant diagnosis.</p>
        {isFallback && (
          <p className="mt-2 text-sm text-yellow-500 bg-yellow-900/50 p-2 rounded-md">Note: Running in demo mode with a fallback classifier.</p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PestUploader onImageUpload={handleImageUpload} imagePreview={image} onClear={handleClear} />
        </div>
        <div className="flex flex-col justify-center">
          {isLoading && !image && (
            <div className="text-center text-gray-500">
              <Loader className="animate-spin mx-auto mb-2" />
              <p>Loading AI model...</p>
            </div>
          )}
          {isLoading && image && (
            <div className="text-center text-gray-500">
              <Loader className="animate-spin mx-auto mb-2" />
              <p>Analyzing image...</p>
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!isLoading && predictions.length > 0 && (
            <PestResultCard results={predictions} image={image} />
          )}
          {!isLoading && !image && !error && (
             <div className="text-center text-gray-500">
                <p>Upload an image to begin diagnosis.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestDiagnosisPage;
