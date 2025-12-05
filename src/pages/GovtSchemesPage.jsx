/**
 * @file GovtSchemesPage.jsx
 * @description This file belongs to the Government Schemes module. It's the main page component.
 * It manages state for filters and selection, and orchestrates the layout.
 * TODO: Replace static data with live data from an API.
 */

import React, { useState, useEffect } from 'react';
import { getFilteredSchemes } from '../utils/schemesUtils';
import SchemeList from '../components/SchemeList';
import SchemeDetail from '../components/SchemeDetail';
import SchemeFilters from '../components/SchemeFilters';

const GovtSchemesPage = () => {
  const [filters, setFilters] = useState({ searchTerm: '', category: 'all', pin: '', crop: 'all' });
  const [sortBy, setSortBy] = useState('relevance');
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    // Simulate fetching and filtering data
    const results = getFilteredSchemes(filters, sortBy);
    setSchemes(results);
    // If a selected scheme is no longer in the filtered list, deselect it
    if (selectedScheme && !results.find(s => s.id === selectedScheme.id)) {
      setSelectedScheme(null);
    }
  }, [filters, sortBy, selectedScheme]);

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-900 text-white rounded-lg">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-400">Government Schemes for Farmers</h1>
        <p className="text-gray-400 mt-2">Find and understand schemes that can benefit you.</p>
        <div className="mt-2 text-xs text-yellow-400 bg-yellow-900/50 p-2 rounded-md max-w-2xl mx-auto">
          Data shown is a summary for demo purposes. Always visit official government links for full details.
        </div>
      </header>

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Left Column */}
        <div className="w-full lg:w-2/5 mb-8 lg:mb-0">
          <SchemeFilters 
            filters={filters} 
            setFilters={setFilters} 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
          />
          <SchemeList 
            schemes={schemes} 
            onSelectScheme={setSelectedScheme} 
            selectedSchemeId={selectedScheme?.id}
          />
        </div>

        {/* Right Column */}
        <main className="w-full lg:w-3/5">
          {selectedScheme ? (
            <SchemeDetail scheme={selectedScheme} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-gray-400">Select a scheme from the list to see the details.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GovtSchemesPage;
