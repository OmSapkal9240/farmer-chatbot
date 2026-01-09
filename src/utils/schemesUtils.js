/**
 * @file schemesUtils.js
 * @description This file belongs to the Government Schemes module. It contains helper functions for the module.
 * TODO: Enhance these functions to perform live API calls for filtering and fetching data.
 */

import { SCHEMES_DATA } from '../data/schemes';

/**
 * Filters schemes based on various criteria.
 * @param {object} filters - The filters to apply (searchTerm, category, pin, crop).
 * @param {string} sortBy - The sorting criteria ('relevance', 'newest', 'alphabetical').
 * @returns {Array} - A filtered and sorted array of schemes.
 */
export const getFilteredSchemes = (filters, sortBy = 'relevance') => {
  // TODO: Replace with a real API call that handles filtering server-side.
  let filtered = [...SCHEMES_DATA];

  // Search term filter
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(scheme => 
      scheme.name.en.toLowerCase().includes(term) || 
      scheme.shortDesc.toLowerCase().includes(term) ||
      scheme.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(scheme => scheme.categories.includes(filters.category));
  }

  // Mock PIN filter (simple logic for demo)
  if (filters.pin && filters.pin.length === 6) {
    // This is a placeholder for real regional filtering
  }

  // Crop filter
  if (filters.crop && filters.crop !== 'all') {
    filtered = filtered.filter(scheme => scheme.applicableCrops.includes('All') || scheme.applicableCrops.includes(filters.crop));
  }

  // Sorting logic
  switch (sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      break;
    case 'alphabetical':
      filtered.sort((a, b) => a.name.en.localeCompare(b.name.en));
      break;
    case 'relevance':
    default:
      // Default relevance (can be improved with better scoring)
      break;
  }

  return filtered;
};

/**
 * Saves a scheme to localStorage.
 * @param {object} scheme - The scheme object to save.
 */
export const saveSchemeToLocal = (scheme) => {
  // TODO: Replace with an API call to save to a user's account.
  const savedSchemes = JSON.parse(localStorage.getItem('saved_schemes')) || [];
  if (!savedSchemes.some(s => s.id === scheme.id)) {
    savedSchemes.push(scheme);
    localStorage.setItem('saved_schemes', JSON.stringify(savedSchemes));
  }
};

/**
 * Removes a scheme from localStorage.
 * @param {string} schemeId - The ID of the scheme to remove.
 */
export const removeSchemeFromLocal = (schemeId) => {
  let savedSchemes = JSON.parse(localStorage.getItem('saved_schemes')) || [];
  savedSchemes = savedSchemes.filter(s => s.id !== schemeId);
  localStorage.setItem('saved_schemes', JSON.stringify(savedSchemes));
};

export const getSchemeCategories = () => {
  const allCategories = SCHEMES_DATA.flatMap(scheme => scheme.categories);
  return ['all', ...new Set(allCategories)];
};
