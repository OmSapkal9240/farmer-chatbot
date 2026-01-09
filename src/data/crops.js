/**
 * @file Comprehensive mock data for crops for the Kisan Pulse Crop Care Module.
 * This file contains detailed, farmer-friendly data for various crops, structured
 * for a professional dashboard UI.
 * TODO: This will eventually be replaced by a real API call.
 */

// TODO: Replace with actual image assets or a robust image handling solution.
const placeholderImage = (text) => `https://placehold.co/800x400.png/22c55e/ffffff?text=${text}`;
const placeholderIcon = (text) => `https://placehold.co/40x40.png/166534/ffffff?text=${text.substring(0, 1)}`;

export const crops = [
  {
    id: 'sugarcane',
    name: 'crop.sugarcane.name', // i18n key
    scientificName: 'Saccharum officinarum',
    difficulty: 'Medium',
    icon: placeholderIcon('Sugarcane'),
    heroImage: placeholderImage('Sugarcane+Plantation'),

    // 1. Overview
    overview: {
      description: 'crop.sugarcane.overview.description',
    },

    // 2. Ideal Climate & Soil
    climateAndSoil: {
      temperature: '20°C to 32°C (Thrives in hot, sunny weather)',
      rainfall: '750-1200 mm annually',
      soil: 'Well-drained loamy soil with a neutral pH (6.5-7.5) is ideal. Can tolerate a range of soil types.',
    },

    // 3. Sowing & Planting
    sowingAndPlanting: {
      sowingMonths: ['October-November (Adsali)', 'January-February (Suru)'],
      spacing: '90-120 cm between rows',
      seedRate: '6-8 tonnes of setts/ha',
      sowingMethod: 'Primarily planted using setts (cuttings from the stalk). Ensure setts have at least 2-3 buds.',
    },

    // 4. Irrigation Management
    irrigation: {
      frequency: 'Critical during germination, tillering, and grand growth stages. Generally, every 8-10 days in summer and 15-20 days in winter.',
      method: 'Drip irrigation is highly recommended for water efficiency and yield improvement. Furrow irrigation is also common.',
      mistakesToAvoid: [
        'Over-watering can lead to root rot and nutrient leaching.',
        'Water stress during formative stages can severely reduce cane length and girth.',
      ],
    },

    // 5. Nutrient & Fertilizer Care
    nutrientCare: {
      basal: 'Apply a full dose of Phosphorus and Potash, along with one-third of Nitrogen, at the time of planting.',
      topDressing: [
        '1/3 Nitrogen: 45 days after planting.',
        '1/3 Nitrogen: 90 days after planting (at the start of the grand growth phase).',
      ],
      organic: 'Well-decomposed Farm Yard Manure (FYM) at 20-25 tonnes/ha during land preparation is excellent. Pressmud and vermicompost are also beneficial.',
    },

    // 6. Pest & Disease Care
    pestAndDisease: {
      commonPests: [
        { 
          name: 'Early Shoot Borer',
          symptoms: 'Dead hearts in the central shoot of young plants.',
          management: 'Remove and destroy dead hearts. Apply Trichogramma cards.'
        },
        { 
          name: 'Woolly Aphid',
          symptoms: 'White, cotton-like masses on the underside of leaves.',
          management: 'Encourage natural predators like ladybugs. Spray with a forceful jet of water.'
        },
      ],
      commonDiseases: [
        { 
          name: 'Red Rot',
          symptoms: 'Reddening of internal tissues with a sour, alcoholic smell.',
          management: 'Use disease-free setts. Practice crop rotation. Uproot and destroy infected clumps.'
        },
      ],
    },

    // 7. Weed Management
    weedManagement: {
      manual: 'Two to three manual weedings are needed during the early growth stages (first 3-4 months).',
      preventive: 'Trash mulching (spreading dried sugarcane leaves) between rows after 3 months is highly effective for conserving moisture and suppressing weeds.',
    },

    // 8. Growth Stage Calendar
    growthCalendar: {
      'Month 1-2': 'Germination & Tillering: Ensure proper moisture for sprouting. First light irrigation.',
      'Month 3-5': 'Grand Growth Phase: Critical water and nutrient demand. Complete fertilizer application. Earthing up.',
      'Month 6-9': 'Cane Development: Stalks thicken and elongate. Regular irrigation is key.',
      'Month 10-12': 'Maturity & Ripening: Reduce irrigation to increase sugar content. Monitor for readiness.',
    },

    // 9. Harvesting & Yield
    harvesting: {
      signs: 'Leaves turn yellow and dry. Canes produce a metallic sound when tapped. Brix meter reading of 20-22%.',
      yield: 'Average yield is 80-100 tonnes/ha, but can vary significantly based on variety and management.',
      postHarvest: 'Harvest close to the ground. Quickly transport to the mill to prevent sugar loss. Ratoon the crop for the next season.',
    },

    // 10. Practical Farmer Tips
    farmerTips: {
      mistakes: 'Delayed planting can reduce yield. Improper sett treatment can lead to disease.',
      advice: 'Soaking setts in a fungicide solution before planting improves germination and prevents disease.',
      warnings: 'Avoid waterlogging at all costs, as it damages the root system.',
    },
  },
  {
    id: 'onion',
    name: 'crop.onion.name',
    scientificName: 'Allium cepa',
    difficulty: 'Medium',
    icon: placeholderIcon('Onion'),
    heroImage: placeholderImage('Onion+Farm'),
    // All other sections are placeholders
    overview: { description: 'Placeholder' },
    climateAndSoil: { temperature: '', rainfall: '', soil: '' },
    sowingAndPlanting: { sowingMonths: [], spacing: '', seedRate: '', sowingMethod: '' },
    irrigation: { frequency: '', method: '', mistakesToAvoid: [] },
    nutrientCare: { basal: '', topDressing: [], organic: '' },
    pestAndDisease: { commonPests: [], commonDiseases: [] },
    weedManagement: { manual: '', preventive: '' },
    growthCalendar: {},
    harvesting: { signs: '', yield: '', postHarvest: '' },
    farmerTips: { mistakes: '', advice: '', warnings: '' },
  },
  {
    id: 'tomato',
    name: 'crop.tomato.name',
    scientificName: 'Solanum lycopersicum',
    difficulty: 'Easy',
    icon: placeholderIcon('Tomato'),
    heroImage: placeholderImage('Tomato+Cultivation'),
    // All other sections are placeholders
    overview: { description: 'Placeholder' },
    climateAndSoil: { temperature: '', rainfall: '', soil: '' },
    sowingAndPlanting: { sowingMonths: [], spacing: '', seedRate: '', sowingMethod: '' },
    irrigation: { frequency: '', method: '', mistakesToAvoid: [] },
    nutrientCare: { basal: '', topDressing: [], organic: '' },
    pestAndDisease: { commonPests: [], commonDiseases: [] },
    weedManagement: { manual: '', preventive: '' },
    growthCalendar: {},
    harvesting: { signs: '', yield: '', postHarvest: '' },
    farmerTips: { mistakes: '', advice: '', warnings: '' },
  },
];
