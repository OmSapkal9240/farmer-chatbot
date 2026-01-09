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
