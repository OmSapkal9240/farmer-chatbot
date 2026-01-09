import { crops as allCrops } from '../data/crops';

/**
 * Detects the current farming season based on the month and rainfall.
 * @param {number} month - The current month (0-11).
 * @param {number} rainfall - Rainfall in the last hour in mm.
 * @returns {string} The detected season ('Kharif', 'Rabi', 'Zaid').
 */
export const detectSeason = (month, rainfall) => {
  if (month >= 5 && month <= 9) { // June to October
    return 'Kharif';
  } else if (month >= 10 || month <= 2) { // October to March
    return 'Rabi';
  } else { // March to June
    return 'Zaid';
  }
};

// A simplified mapping of states and seasons to recommended crop IDs.
const cropMapping = {
  'Maharashtra': {
    'Kharif': ['cotton', 'soybean', 'paddy', 'bajra'],
    'Rabi': ['wheat', 'gram', 'onion', 'sugarcane'],
    'Zaid': ['groundnut', 'maize', 'vegetables'],
  },
  'Punjab': {
    'Kharif': ['paddy', 'maize', 'cotton'],
    'Rabi': ['wheat', 'mustard', 'gram'],
    'Zaid': ['vegetables', 'maize'],
  },
  // Add more states and mappings as needed
  'default': {
    'Kharif': ['paddy', 'maize', 'soybean'],
    'Rabi': ['wheat', 'gram', 'mustard'],
    'Zaid': ['vegetables', 'groundnut'],
  }
};

/**
 * Gets a list of recommended crops based on the user's state and the current season.
 * @param {string} state - The user's state.
 * @param {string} season - The current farming season.
 * @returns {Array<object>} A filtered list of crop objects.
 */
/**
 * Generates a dynamic tip based on the current weather and selected crop.
 * @param {object} weather - The weather data object.
 * @param {object} crop - The selected crop object.
 * @returns {string} A dynamic weather-based tip.
 */
export const getDynamicWeatherTip = (weather, crop) => {
  if (!weather || !crop) {
    return 'Ensure proper drainage during monsoon to avoid root rot.'; // Default tip
  }

  if (weather.temp > 35) {
    return `High temperatures detected (${weather.temp}°C). Ensure frequent irrigation for ${crop.name} to prevent heat stress.`;
  }
  if (weather.humidity > 85) {
    return `High humidity (${weather.humidity}%) increases the risk of fungal diseases. Ensure good air circulation around plants.`;
  }
  if (weather.rainfall > 5) {
    return `Heavy rainfall detected. Check fields for waterlogging and ensure proper drainage for ${crop.name}.`;
  }
  if (weather.wind > 5.5) { // approx 20 km/h
    return `Strong winds detected. Young plants may need support. Check for damage after wind subsides.`;
  }

  return 'Weather conditions seem favorable. Continue standard crop management practices.';
};

export const getRecommendedCrops = (state, season) => {
  // For now, return all crops. The recommendation logic can be re-implemented later.
  return allCrops;
};

/**
 * Returns a dynamic, context-aware tip based on the current month and crop stage.
 * This simulates intelligence for the hackathon demo.
 * @param {string} cropId - The ID of the selected crop.
 * @returns {string} A helpful tip for the farmer.
 */
export const getContextualTip = (cropId) => {
  const month = new Date().getMonth(); // 0 = January, 11 = December

  // Example logic for Rice (id: 'paddy')
  if (cropId === 'paddy') {
    if (month >= 5 && month <= 7) return 'Kharif paddy sowing is underway. Ensure fields are well-puddled before transplanting seedlings.';
    if (month >= 8 && month <= 10) return 'Monitor for pests like stem borer and leaf folder. High humidity increases the risk of blast disease.';
    if (month >= 11 && month <= 1) return 'This is the harvesting period for Kharif paddy. Ensure grains are properly dried to prevent post-harvest losses.';
  }

  // Example logic for Wheat (id: 'wheat')
  if (cropId === 'wheat') {
    if (month >= 10 && month <= 11) return 'Rabi wheat sowing season. Ensure proper seed treatment to protect against seed-borne diseases.';
    if (month >= 0 && month <= 2) return 'Critical irrigation stage (crown root initiation). A light irrigation is highly recommended for better yields.';
    if (month === 3) return 'Monitor for aphids and rust disease as temperatures rise. Prepare for harvesting in the coming weeks.';
  }

  // Default tip
  return 'Ensure regular monitoring of your field for any signs of pests or diseases. Early detection is key to effective management.';
};
