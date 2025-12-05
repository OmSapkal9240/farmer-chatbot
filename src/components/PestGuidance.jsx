/**
 * @file PestGuidance.jsx
 * @description This file belongs to the Pest Detection module. It displays detailed guidance for a given pest.
 * It includes symptoms, preventive measures, and treatment options, with a strong safety warning.
 * TODO: Fetch this guidance from a reliable agricultural API for production use.
 */

import React from 'react';
import { ShieldAlert } from 'lucide-react';

const PestGuidance = ({ pest }) => {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-bold text-gray-300">Symptoms to look for:</h4>
        <ul className="list-disc list-inside text-gray-400 mt-1">
          {pest.symptoms.map((symptom, i) => <li key={i}>{symptom}</li>)}
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-gray-300">Preventive Measures:</h4>
        <ul className="list-disc list-inside text-gray-400 mt-1">
          {pest.preventiveMeasures.map((measure, i) => <li key={i}>{measure}</li>)}
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-green-400">Organic Remedies:</h4>
        <ul className="list-disc list-inside text-gray-400 mt-1">
          {pest.treatments.organic.map((remedy, i) => <li key={i}>{remedy}</li>)}
        </ul>
      </div>

      <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
        <div className="flex items-start">
          <ShieldAlert className="w-8 h-8 text-red-400 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-red-400">Important Safety Notice</h4>
            <p className="text-red-300 mt-1">
              If chemical treatment is necessary, always consult a local KVK (Krishi Vigyan Kendra) or a certified agricultural extension officer before application.
            </p>
            <p className="text-red-300 mt-2">
              Suggested chemical categories (if any): <span className="font-mono">{pest.treatments.chemical.join(', ')}</span>. <strong className="underline">Do not apply without expert advice.</strong> Always follow the product label instructions carefully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestGuidance;
