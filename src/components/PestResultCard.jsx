/**
 * @file PestResultCard.jsx
 * @description This file belongs to the Pest Detection module. It displays the model's predictions.
 * It shows the top predictions with confidence bars and provides CTAs for further action.
 * TODO: Replace mock chat dispatch and localStorage saving with real application logic.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PestGuidance from './PestGuidance';
import PestGallery from './PestGallery';
import { Bot, Save, AlertTriangle } from 'lucide-react';

const ConfidenceBar = ({ value }) => {
  const percentage = (value * 100).toFixed(1);
  let color = 'bg-green-500';
  if (value < 0.7) color = 'bg-yellow-500';
  if (value < 0.4) color = 'bg-red-500';

  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className={color + " h-2.5 rounded-full"} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const PestResultCard = ({ results, image }) => {
  const { t, i18n } = useTranslation();
  const [isGalleryOpen, setGalleryOpen] = useState(false);

  const topResult = results[0];
  const lowConfidence = topResult.confidence < 0.6;

  // TODO: Replace with a real chat panel event dispatcher
  const handleStartChat = () => {
    const message = `${t(topResult.label.en)} detected in my crop. Please advise.`;
    alert(`Chat context sent (mock):\n"${message}"`);
    console.log('Chat context:', { result: topResult, message });
  };

  // TODO: Replace with a more robust storage solution
  const handleSaveCase = () => {
    const savedCases = JSON.parse(localStorage.getItem('pestCases')) || [];
    const newCase = { 
      id: `case_${Date.now()}`,
      result: topResult,
      image, // Base64 image data
      timestamp: new Date().toISOString(),
    };
    savedCases.push(newCase);
    localStorage.setItem('pestCases', JSON.stringify(savedCases));
    alert('Case saved locally for future reference.');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Diagnosis Result</h2>
      
      {lowConfidence ? (
        <div className="text-center p-4 bg-yellow-900/50 rounded-lg">
          <AlertTriangle className="mx-auto text-yellow-400 mb-2" size={32} />
          <h3 className="font-bold text-yellow-400">Low Confidence</h3>
          <p className="text-yellow-300">The model is not confident about the diagnosis. Please try a clearer photo or consult a local expert.</p>
        </div>
      ) : (
        <div>
          {results.map((res, index) => (
            <div key={res.id} className={`mb-4 ${index === 0 ? 'p-4 bg-gray-700 rounded-lg' : 'pl-4'}`}>
              <div className="flex justify-between items-center">
                <h3 className={`font-bold ${index === 0 ? 'text-xl text-green-400' : 'text-lg'}`}>
                  {index + 1}. {t(res.label[i18n.language] || res.label.en)}
                </h3>
                <span className={`font-mono ${index === 0 ? 'text-lg' : 'text-md'}`}>{ (res.confidence * 100).toFixed(1) }%</span>
              </div>
              <ConfidenceBar value={res.confidence} />
            </div>
          ))}

          <div className="mt-6">
            <PestGuidance pest={topResult} />
          </div>

          <div className="mt-4">
            <button onClick={() => setGalleryOpen(true)} className="text-blue-400 hover:underline">
              Show example images
            </button>
          </div>

          {isGalleryOpen && (
            <PestGallery 
              images={topResult.exampleImages}
              pestName={t(topResult.label[i18n.language] || topResult.label.en)}
              onClose={() => setGalleryOpen(false)}
            />
          )}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-4">
        <button onClick={handleStartChat} className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <Bot size={20} />
          Start Chat with Context
        </button>
        <button onClick={handleSaveCase} className="flex-1 px-4 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-2">
          <Save size={20} />
          Save Case
        </button>
      </div>
    </div>
  );
};

export default PestResultCard;
