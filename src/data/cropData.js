// @/src/data/cropData.js

/**
 * @file cropData.js
 * @description Static data for the Crop Care Advisory module.
 * This file contains all location-based rules, crop details, and recommended products.
 * No backend or database is used, per the requirements.
 */

const getProductImage = (productName) => `https://placehold.co/100x100/0f1b2e/34e89e?text=${encodeURIComponent(productName)}`;

export const RECOMMENDED_INPUTS = {
  'urea': { name: 'Urea', type: 'Fertilizer', price: '₹268 per 45kg bag', link: '#', image: getProductImage('Urea') },
  'dap': { name: 'DAP', type: 'Fertilizer', price: '₹1350 per 50kg bag', link: '#', image: getProductImage('DAP') },
  'mop': { name: 'Muriate of Potash (MOP)', type: 'Fertilizer', price: '₹1700 per 50kg bag', link: '#', image: getProductImage('MOP') },
  'imidacloprid': { name: 'Imidacloprid 17.8% SL', type: 'Pesticide', price: '₹450 per 250ml', link: '#', image: getProductImage('Imida') },
  'mancozeb': { name: 'Mancozeb 75% WP', type: 'Fungicide', price: '₹600 per 1kg', link: '#', image: getProductImage('Manco') },
};

export const CROP_CARE_DETAILS = {
  'paddy': {
    id: 'paddy',
    name: 'Paddy (Rice)',
    type: 'Cereal',
    season: 'Kharif',
    image_url: 'https://images.unsplash.com/photo-1597922159842-9a4d5c4341e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
    recommendedInputs: ['urea', 'dap', 'mancozeb'],
    details: {
      basic: {
        description: 'Paddy is a staple food crop, grown extensively in submerged fields during the monsoon season.',
        sowingWindow: 'June - July',
        seedRate: '20-25 kg/acre',
        spacing: '20cm x 15cm',
      },
      overview: {
        description: 'Rice cultivation is well-suited to countries and regions with low labor costs and high rainfall, as it is labor-intensive to cultivate and requires ample water.',
        climate: 'Requires a hot and humid climate. It is best suited to regions which have high humidity, prolonged sunshine, and an assured supply of water.',
        soil: 'Clayey loam soil is best suited for rice cultivation as it can hold water for a long time.',
      },
      symptoms: [
        { name: 'Blast Disease', description: 'Spindle-shaped spots on leaves, which can enlarge and kill the entire leaf.' },
        { name: 'Stem Borer', description: 'Causes “dead hearts” (dried central shoot) during the vegetative stage and “white ears” (empty panicles) at the reproductive stage.' },
      ],
      management: {
        dos: ['Use disease-resistant varieties.', 'Maintain a shallow water level (2-5 cm) in the field.', 'Apply nitrogen fertilizer in split doses.'],
        donts: ['Do not allow water to stagnate for more than a day.', 'Avoid excessive use of nitrogen fertilizers.', 'Do not spray insecticides during flowering.'],
      },
      fertilizer: {
        plan: [
          { stage: 'Basal Dose (before transplanting)', recommendation: 'Apply DAP and MOP as per soil test recommendations.' },
          { stage: 'Active Tillering (20-30 DAT)', recommendation: 'First top dressing with Urea.' },
          { stage: 'Panicle Initiation (50-55 DAT)', recommendation: 'Second top dressing with Urea.' },
        ],
      },
      calendar: [
        { monthRange: 'May-Jun', task: 'Nursery preparation and sowing.', months: [4, 5] },
        { monthRange: 'Jun-Jul', task: 'Transplanting seedlings into the main field.', months: [5, 6] },
        { monthRange: 'Aug-Sep', task: 'Weed management and first fertilizer application.', months: [7, 8] },
        { monthRange: 'Oct-Nov', task: 'Harvesting and threshing.', months: [9, 10] },
      ],
    },
  },
  'wheat': {
    id: 'wheat',
    name: 'Wheat',
    type: 'Cereal',
    season: 'Rabi',
    image_url: 'https://images.unsplash.com/photo-1542274368-443d694d79c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
    recommendedInputs: ['urea', 'dap', 'imidacloprid'],
    details: {
      basic: {
        description: 'A major winter cereal crop, providing a staple food for a large part of the population.',
        sowingWindow: 'October - December',
        seedRate: '100-120 kg/hectare',
        spacing: '20-22 cm between rows',
      },
      overview: {
        description: 'Wheat is a temperate crop that requires a cool and moist climate during the vegetative growth period and a warm and dry climate during the ripening period.',
        climate: 'Ideal temperature for cultivation is between 10-15°C at sowing and 21-26°C at ripening.',
        soil: 'Well-drained loams and clay loams are best for wheat cultivation.',
      },
      symptoms: [
        { name: 'Yellow Rust', description: 'Small, yellow-orange pustules arranged in stripes on the leaves.' },
        { name: 'Aphids', description: 'Small, soft-bodied insects that suck sap from the plant, causing yellowing and distortion of leaves.' },
      ],
      management: {
        dos: ['Use certified seeds of rust-resistant varieties.', 'Apply first irrigation at Crown Root Initiation (CRI) stage (20-25 DAS).', 'Control weeds with recommended herbicides.'],
        donts: ['Avoid late sowing as it reduces yield.', 'Do not apply irrigation during frosty weather.', 'Avoid excessive nitrogen application.'],
      },
      fertilizer: {
        plan: [
          { stage: 'Basal Dose (at sowing)', recommendation: 'Full dose of Phosphorus and Potash, and half dose of Nitrogen.' },
          { stage: 'First Irrigation (20-25 DAS)', recommendation: 'Remaining half dose of Nitrogen.' },
        ],
      },
      calendar: [
        { monthRange: 'Oct-Nov', task: 'Land preparation and sowing.', months: [9, 10] },
        { monthRange: 'Dec-Jan', task: 'First irrigation and fertilizer top dressing.', months: [11, 0] },
        { monthRange: 'Feb-Mar', task: 'Monitor for pests and diseases. Subsequent irrigation.', months: [1, 2] },
        { monthRange: 'Apr', task: 'Harvesting.', months: [3] },
      ],
    },
  },
};

export const CROP_RECOMMENDATION_RULES = {
  'Maharashtra': {
    'Kharif': ['paddy'],
    'Rabi': ['wheat'],
  },
  'Punjab': {
    'Kharif': ['paddy'],
    'Rabi': ['wheat'],
  },
  'default': {
    'Kharif': ['paddy'],
    'Rabi': ['wheat'],
    'Zaid': [],
  }
};

export const detectSeason = (month) => {
  if (month >= 5 && month <= 9) return 'Kharif'; // June to October
  if (month >= 10 || month <= 2) return 'Rabi'; // November to March
  return 'Zaid'; // April, May
};
