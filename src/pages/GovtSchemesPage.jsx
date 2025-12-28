/**
 * @file GovtSchemesPage.jsx
 * @description This file belongs to the Government Schemes module. It's the main page component.
 * It manages state for filters and selection, and orchestrates the layout.
 * TODO: Replace static data with live data from an API.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFilteredSchemes } from '../utils/schemesUtils';
import { getSchemeRecommendation } from '../lib/openrouter';
import SchemeList from '../components/SchemeList';
import SchemeDetail from '../components/SchemeDetail';
import SchemeFilters from '../components/SchemeFilters';
import GovernmentSchemes from '../components/GovernmentSchemes';
import SchemeRecommender from '../components/SchemeRecommender';

const GovtSchemesPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ searchTerm: '', category: 'all', pin: '', crop: 'all' });
  const [sortBy, setSortBy] = useState('relevance');
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isAiSearchLoading, setIsAiSearchLoading] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState(null);
  const [activeExplorer, setActiveExplorer] = useState('recommender'); // 'recommender' or 'search'

  useEffect(() => {
    // Simulate fetching and filtering data
    let results = getFilteredSchemes(filters, sortBy);
    // If no filters are active, show a limited number of schemes by default
    if (!filters.searchTerm && filters.category === 'all' && !filters.pin && filters.crop === 'all') {
      results = results.slice(0, 10);
    }
    setSchemes(results);
    // If a selected scheme is no longer in the filtered list, deselect it
    if (selectedScheme && !results.find(s => s.id === selectedScheme.id)) {
      setSelectedScheme(null);
    }
  }, [filters, sortBy]);

  const handleSearchStart = () => {
    setIsAiSearchLoading(true);
    setAiSearchResult('');
    setSelectedScheme(null);
  };

  const handleSearchResult = (chunk) => {
    setAiSearchResult(prev => prev + chunk);
  };

  const handleSearchEnd = (error = null) => {
    setIsAiSearchLoading(false);
    if (error) {
      setAiSearchResult(error);
    }
  };

  const handleRecommendation = async (criteria) => {
    handleSearchStart(); // Reuse start logic
    try {
      await getSchemeRecommendation(criteria, handleSearchResult);
      handleSearchEnd(); // Reuse end logic
    } catch (error) {
      handleSearchEnd(error.message); // Reuse end logic with error
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-900 text-white rounded-lg">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Left Column */}
        <div className="w-full lg:w-2/5 mb-8 lg:mb-0 flex flex-col gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex border-b border-gray-700 mb-4">
              <button 
                onClick={() => setActiveExplorer('recommender')}
                className={`py-2 px-4 text-sm font-medium ${activeExplorer === 'recommender' ? 'border-b-2 border-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                Find Schemes For Me
              </button>
              <button 
                onClick={() => setActiveExplorer('search')}
                className={`py-2 px-4 text-sm font-medium ${activeExplorer === 'search' ? 'border-b-2 border-green-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                Search by Name
              </button>
            </div>
            {activeExplorer === 'recommender' ? (
              <SchemeRecommender onRecommend={handleRecommendation} isLoading={isAiSearchLoading} />
            ) : (
              <GovernmentSchemes 
                onSearchStart={handleSearchStart}
                onSearchResult={handleSearchResult}
                onSearchEnd={handleSearchEnd}
                isLoading={isAiSearchLoading}
              />
            )}
          </div>
          <div>
            <header className="text-center mb-4">
              <h1 className="text-3xl font-bold text-green-400">Browse Schemes</h1>
              <p className="text-gray-400 mt-1 text-sm">Or use the AI Explorer above for specific questions</p>
            </header>
            <SchemeFilters 
              filters={filters} 
              setFilters={setFilters} 
              sortBy={sortBy} 
              setSortBy={setSortBy} 
            />
            <SchemeList 
              schemes={schemes} 
              onSelectScheme={(scheme) => { setSelectedScheme(scheme); setAiSearchResult(null); }} 
              selectedSchemeId={selectedScheme?.id}
            />
          </div>
        </div>

        {/* Right Column */}
        <main className="w-full lg:w-3/5">
          {aiSearchResult !== null ? (
            <div className="bg-gray-800 p-6 rounded-lg h-full">
              <h2 className="text-2xl font-bold text-green-400 mb-4">AI-Powered Explanation</h2>
              {(isAiSearchLoading && !aiSearchResult) && <p className="text-gray-400">Loading...</p>}
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">{aiSearchResult}</div>
            </div>
          ) : selectedScheme ? (
            <SchemeDetail scheme={selectedScheme} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-gray-400">Select a scheme from the list or use the AI explorer to get details.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GovtSchemesPage;
