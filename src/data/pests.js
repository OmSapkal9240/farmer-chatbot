/**
 * @file pests.js
 * @description This file belongs to the Pest Detection module. It contains mock data for common pests and diseases.
 * This data is used for the fallback classifier and to display guidance in the UI.
 * TODO: Replace with a comprehensive database or API for production use.
 */

// Placeholder for example images. In a real app, these would be in /public/assets/pests/
const placeholderPestImage = (text) => `https://via.placeholder.com/224x224.png/ff0000/ffffff?text=${text.replace(/ /g, '+')}`;

export const PEST_DATA = [
  {
    id: 'tomato_late_blight',
    label: {
      en: 'Tomato Late Blight',
      hi: 'टमाटर का पछेती झुलसा',
      mr: 'टोमॅटोचा करपा रोग',
    },
    exampleImages: [
      placeholderPestImage('Late Blight 1'),
      placeholderPestImage('Late Blight 2'),
    ],
    description: 'A destructive fungal disease that can quickly ruin tomato and potato crops.',
    symptoms: ['Dark, water-soaked spots on leaves and stems.', 'White mold on the underside of leaves in humid conditions.'],
    likelyCrops: ['Tomato', 'Potato'],
    preventiveMeasures: ['Ensure good air circulation.', 'Avoid overhead watering.', 'Use disease-resistant varieties.'],
    treatments: {
      organic: ['Apply copper-based fungicides.', 'Remove and destroy infected plants immediately.'],
      chemical: ['Fungicides containing mancozeb or chlorothalonil.'],
    },
    exampleKeywords: ['leaf', 'spot', 'brown', 'tomato', 'potato'], // For fallback classifier
  },
  {
    id: 'cotton_bollworm',
    label: {
      en: 'Cotton Bollworm',
      hi: 'कपास का बॉलवर्म',
      mr: 'कापसावरील बोंडअळी',
    },
    exampleImages: [
      placeholderPestImage('Bollworm 1'),
      placeholderPestImage('Bollworm 2'),
    ],
    description: 'A major pest of cotton, causing significant damage to bolls and reducing yield.',
    symptoms: ['Holes in cotton bolls.', 'Presence of larvae inside bolls.', 'Damaged squares and flowers.'],
    likelyCrops: ['Cotton', 'Corn', 'Tomato'],
    preventiveMeasures: ['Use pheromone traps to monitor moth activity.', 'Encourage natural predators.'],
    treatments: {
      organic: ['Neem oil spray.', 'Use of Bt (Bacillus thuringiensis) formulations.'],
      chemical: ['Pyrethroids', 'Spinosad-based insecticides.'],
    },
    exampleKeywords: ['worm', 'hole', 'boll', 'cotton'],
  },
  {
    id: 'rice_leaf_folder',
    label: {
      en: 'Rice Leaf Folder',
      hi: 'धान का पत्ती मोड़क',
      mr: 'भात पिकावरील पाने गुंडाळणारी अळी',
    },
    exampleImages: [
      placeholderPestImage('Leaf Folder 1'),
    ],
    description: 'Larvae fold rice leaves and feed from within, causing white, transparent streaks.',
    symptoms: ['Leaves folded longitudinally.', 'Scraping of green tissue, creating white streaks.'],
    likelyCrops: ['Rice (Paddy)'],
    preventiveMeasures: ['Avoid excessive nitrogen fertilizer.', 'Maintain proper spacing.'],
    treatments: {
      organic: ['Release of Trichogramma wasps.', 'Spray with neem-based pesticides.'],
      chemical: ['Insecticides like cartap hydrochloride or fipronil.'],
    },
    exampleKeywords: ['leaf', 'fold', 'white', 'streak', 'rice'],
  },
  {
    id: 'onion_thrips',
    label: {
      en: 'Onion Thrips',
      hi: 'प्याज का थ्रिप्स',
      mr: 'कांद्यावरील फुलकिडे',
    },
    exampleImages: [
      placeholderPestImage('Thrips 1'),
    ],
    description: 'Tiny insects that feed on onion leaves, causing silvery-white patches and reducing bulb size.',
    symptoms: ['Silvery-white patches or streaks on leaves.', 'Stunted plant growth.', 'Distorted leaves.'],
    likelyCrops: ['Onion', 'Garlic'],
    preventiveMeasures: ['Use of blue sticky traps.', 'Overhead irrigation can wash off thrips.'],
    treatments: {
      organic: ['Spraying with insecticidal soap or neem oil.'],
      chemical: ['Spinosad or imidacloprid-based insecticides.'],
    },
    exampleKeywords: ['silver', 'white', 'spot', 'onion', 'leaf'],
  },
  {
    id: 'groundnut_leaf_spot',
    label: {
      en: 'Groundnut Leaf Spot (Tikka)',
      hi: 'मूंगफली का पर्ण चित्ती रोग (टिक्का)',
      mr: 'भुईमुगावरील टिक्का रोग',
    },
    exampleImages: [
      placeholderPestImage('Tikka 1'),
    ],
    description: 'A common fungal disease causing circular spots on leaves, leading to defoliation.',
    symptoms: ['Dark brown to black circular spots on leaves, often with a yellow halo.'],
    likelyCrops: ['Groundnut'],
    preventiveMeasures: ['Crop rotation.', 'Use of certified disease-free seeds.'],
    treatments: {
      organic: ['Spray with a mixture of baking soda and horticultural oil.'],
      chemical: ['Fungicides containing chlorothalonil or mancozeb.'],
    },
    exampleKeywords: ['spot', 'brown', 'yellow', 'halo', 'groundnut', 'leaf'],
  },
  {
    id: 'aphids_general',
    label: {
      en: 'Aphids (General)',
      hi: 'एफिड्स (माहू)',
      mr: 'मावा किड',
    },
    exampleImages: [
      placeholderPestImage('Aphids 1'),
    ],
    description: 'Small, sap-sucking insects that can cause curling, yellowing of leaves, and transmit viruses.',
    symptoms: ['Clusters of small insects on new growth or underside of leaves.', 'Sticky “honeydew” on leaves.', 'Sooty mold growth.'],
    likelyCrops: ['Many, including vegetables and field crops'],
    preventiveMeasures: ['Encourage ladybugs and other natural predators.', 'Regularly inspect plants.'],
    treatments: {
      organic: ['Strong jet of water to dislodge them.', 'Insecticidal soap or neem oil.'],
      chemical: ['Neonicotinoids (use with caution), pyrethrins.'],
    },
    exampleKeywords: ['small', 'green', 'black', 'insect', 'sticky', 'leaf'],
  },
];
