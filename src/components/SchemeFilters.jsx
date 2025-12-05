/**
 * @file SchemeFilters.jsx
 * @description This file belongs to the Government Schemes module. It provides the UI for filtering schemes.
 * TODO: Add more complex filtering options, such as by state or specific crop.
 */

import React from 'react';
import { Search } from 'lucide-react';
import { getSchemeCategories } from '../utils/schemesUtils';

const SchemeFilters = ({ filters, setFilters, sortBy, setSortBy }) => {
  const categories = getSchemeCategories();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleFilterChange}
          placeholder="Search schemes..."
          className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-bold text-gray-300 mb-1">Category</label>
          <select
            id="category-filter"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort-by" className="block text-sm font-bold text-gray-300 mb-1">Sort By</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SchemeFilters;
