import React, { useState } from 'react';

const SchemeRecommender = ({ onRecommend, isLoading }) => {
  const [farmerType, setFarmerType] = useState('small');
  const [need, setNeed] = useState('financial_support');
  const [state, setState] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRecommend({ farmerType, need, state });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="farmerTypeRecommender" className="block text-sm font-bold text-gray-300 mb-1">I am a...</label>
        <select
          id="farmerTypeRecommender"
          value={farmerType}
          onChange={(e) => setFarmerType(e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="small">Small Farmer</option>
          <option value="marginal">Marginal Farmer</option>
          <option value="tenant">Tenant Farmer</option>
          <option value="any">Any Farmer</option>
        </select>
      </div>
      <div>
        <label htmlFor="needRecommender" className="block text-sm font-bold text-gray-300 mb-1">Looking for...</label>
        <select
          id="needRecommender"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="financial_support">Financial Support (Money)</option>
          <option value="crop_insurance">Crop Insurance</option>
          <option value="irrigation">Irrigation Help</option>
          <option value="equipment">Equipment/Tools</option>
          <option value="soil_health">Soil Health</option>
        </select>
      </div>
      <div>
        <label htmlFor="stateRecommender" className="block text-sm font-bold text-gray-300 mb-1">In (State, optional)</label>
        <input
          type="text"
          id="stateRecommender"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="e.g., Maharashtra"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-500 transition-colors">
        {isLoading ? 'Finding Schemes...' : 'Find Schemes for Me'}
      </button>
    </form>
  );
};

export default SchemeRecommender;
