/**
 * @file Mock data for crops for the Crop Care feature module.
 * This file contains sample data for various crops, including their properties,
 * symptoms, management techniques, and fertilizer schedules.
 * TODO: Replace this with a real API call to a backend service.
 */

// TODO: Replace with actual image assets or a robust image handling solution.
const placeholderImage = (text) => `https://via.placeholder.com/800x400.png/22c55e/ffffff?text=${text}`;
const placeholderIcon = (text) => `https://via.placeholder.com/40x40.png/166534/ffffff?text=${text.substring(0, 1)}`;

export const crops = [
  {
    id: 'tomato',
    name: 'crop.tomato.name', // i18n key
    scientificName: 'Solanum lycopersicum',
    seasons: ['Kharif', 'Rabi', 'Zaid'],
    family: 'Solanaceae',
    icon: placeholderIcon('Tomato'),
    heroImage: placeholderImage('Tomato+Cultivation'),
    overview: {
      description: 'crop.tomato.overview.description',
      sowingWindow: ['June-July', 'October-November', 'January-February'],
      spacing: '60cm x 45cm',
      seedRate: '400-500 g/ha',
    },
    symptoms: [
      {
        id: 'early-blight',
        name: 'crop.tomato.symptoms.early_blight.name',
        cause: 'Fungus (Alternaria solani)',
        action: {
          do: ['Remove and destroy infected leaves.', 'Ensure good air circulation.'],
          dont: ['Avoid overhead watering.'],
        },
        images: [placeholderImage('Early+Blight+1'), placeholderImage('Early+Blight+2')],
      },
      {
        id: 'leaf-curl',
        name: 'crop.tomato.symptoms.leaf_curl.name',
        cause: 'Virus (transmitted by whiteflies)',
        action: {
          do: ['Control whitefly population.', 'Use reflective mulches.'],
          dont: ['Do not plant near infected fields.'],
        },
        images: [placeholderImage('Leaf+Curl+1')],
      },
    ],
    management: [
      {
        stage: 'Pest Control',
        organic: ['Neem oil spray (5ml/liter).', 'Install yellow sticky traps.'],
        chemical: ['Imidacloprid 17.8% SL @ 1 ml/3 liters of water.'],
        safetyNote: 'Consult local KVK before chemical use.',
      },
    ],
    fertilizerSchedule: [
      { timing: 'Pre-sowing', npk: 'FYM @ 25 t/ha', details: 'Apply Farm Yard Manure during land preparation.' },
      { timing: 'Basal Dose', npk: '50:60:60 kg/ha', details: 'Apply N, P, K at the time of transplanting.' },
      { timing: 'Top Dressing', npk: '50 kg/ha N', details: 'Apply 30 days after transplanting.' },
    ],
    calendar: {
      'January': ['Sow seeds for summer crop.'],
      'February': ['Transplant seedlings.'],
      'March': ['First top dressing with Nitrogen.'],
      'April': ['Monitor for pests and diseases.'],
      'May': ['Start harvesting.'],
      'June': ['Sow seeds for Kharif crop.'],
      'July': ['Transplanting for Kharif season.'],
      'August': ['Staking and pruning.'],
      'September': ['Monitor for late blight.'],
      'October': ['Final harvesting of Kharif crop.'],
      'November': ['Sow seeds for Rabi crop.'],
      'December': ['Protect from frost.'],
    },
  },
  {
    id: 'cotton',
    name: 'crop.cotton.name',
    scientificName: 'Gossypium spp.',
    seasons: ['Kharif'],
    family: 'Malvaceae',
    icon: placeholderIcon('Cotton'),
    heroImage: placeholderImage('Cotton+Field'),
    overview: {
      description: 'crop.cotton.overview.description',
      sowingWindow: ['May-June'],
      spacing: '90cm x 60cm',
      seedRate: '2.5 kg/ha (BT Cotton)',
    },
    symptoms: [],
    management: [],
    fertilizerSchedule: [],
    calendar: {},
  },
  {
    id: 'paddy',
    name: 'crop.paddy.name',
    scientificName: 'Oryza sativa',
    seasons: ['Kharif', 'Rabi'],
    family: 'Poaceae',
    icon: placeholderIcon('Paddy'),
    heroImage: placeholderImage('Paddy+Field'),
    overview: {
      description: 'crop.paddy.overview.description',
      sowingWindow: ['June-July', 'November-December'],
      spacing: '20cm x 15cm',
      seedRate: '50 kg/ha',
    },
    symptoms: [],
    management: [],
    fertilizerSchedule: [],
    calendar: {},
  },
  {
    id: 'sugarcane',
    name: 'crop.sugarcane.name',
    scientificName: 'Saccharum officinarum',
    seasons: ['Kharif', 'Rabi'],
    family: 'Poaceae',
    icon: placeholderIcon('Sugarcane'),
    heroImage: placeholderImage('Sugarcane+Plantation'),
    overview: {
      description: 'crop.sugarcane.overview.description',
      sowingWindow: ['October-November', 'January-February'],
      spacing: '90-120cm between rows',
      seedRate: '6-8 tonnes of setts/ha',
    },
    symptoms: [],
    management: [],
    fertilizerSchedule: [],
    calendar: {},
  },
  {
    id: 'onion',
    name: 'crop.onion.name',
    scientificName: 'Allium cepa',
    seasons: ['Kharif', 'Rabi'],
    family: 'Amaryllidaceae',
    icon: placeholderIcon('Onion'),
    heroImage: placeholderImage('Onion+Farm'),
    overview: {
      description: 'crop.onion.overview.description',
      sowingWindow: ['June-July', 'October-November'],
      spacing: '15cm x 10cm',
      seedRate: '8-10 kg/ha',
    },
    symptoms: [],
    management: [],
    fertilizerSchedule: [],
    calendar: {},
  },
];
