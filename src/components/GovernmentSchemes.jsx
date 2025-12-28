import React, { useState } from 'react';
import { getSchemeInformation } from '../lib/openrouter';

const GovernmentSchemes = ({ onSearchStart, onSearchResult, onSearchEnd, isLoading }) => {
  const [schemeName, setSchemeName] = useState('');
  const [farmerType, setFarmerType] = useState('small');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schemeName.trim()) return;

    onSearchStart();
    try {
      await getSchemeInformation(schemeName, farmerType, onSearchResult);
      onSearchEnd();
    } catch (error) {
      onSearchEnd(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-400">AI-Powered Scheme Explorer</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="schemeName" className="block text-sm font-bold text-gray-300 mb-1">Scheme Name</label>
          <input
            type="text"
            id="schemeName"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            className="w-full p-3 pl-4 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500"
            placeholder="e.g., PM Kisan"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="farmerType" className="block text-sm font-bold text-gray-300 mb-1">Farmer Type</label>
          <select
            id="farmerType"
            value={farmerType}
            onChange={(e) => setFarmerType(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            <option value="small">Small</option>
            <option value="marginal">Marginal</option>
            <option value="tenant">Tenant</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-500 transition-colors">
          {isLoading ? 'Loading...' : 'Get Scheme Information'}
        </button>
      </form>
          </div>
  );
};

export default GovernmentSchemes;
