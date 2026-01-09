// @/src/data/crops.js

export const crops = [
  {
    id: 'paddy',
    name: 'Paddy (Rice)',
    type: 'Cereal',
    season: 'Kharif',
    image_url: 'https://i.imgur.com/f8f8f8f.jpg', // Replace with a real image URL
    details: {
      basic: {
        description: 'Paddy is a staple food for a large part of the human population. It requires significant water and labor.',
        sowingWindow: 'June-July',
        seedRate: '15-20 kg/acre',
        spacing: '20cm x 15cm',
      },
      overview: {
        description: 'Rice cultivation is well-suited to countries and regions with low labor costs and high rainfall, as it is labor-intensive to cultivate and requires ample water.',
        climate: 'Hot and humid climate. Temperature: 21-37°C. Rainfall: 150-300 cm.',
        soil: 'Clayey loam soils are well-suited for rice cultivation due to their water retention capacity.',
      },
      symptoms: [
        { name: 'Blast', description: 'Spindle-shaped spots on leaves, which can enlarge and kill the entire leaf.' },
        { name: 'Bacterial Blight', description: 'Water-soaked streaks on leaves that turn yellow and die.' },
      ],
      management: {
        dos: ['Use disease-resistant varieties.', 'Ensure proper field sanitation.', 'Maintain optimal water levels.'],
        donts: ['Avoid excessive nitrogen application.', 'Do not allow water to stagnate for long periods.'],
      },
      fertilizer: {
        plan: [
          { stage: 'Basal', recommendation: 'Apply DAP, MOP, and a quarter of Urea before transplanting.' },
          { stage: 'Tillering', recommendation: 'Top dress with Urea 25-30 days after transplanting.' },
          { stage: 'Panicle Initiation', recommendation: 'Apply the final dose of Urea.' },
        ],
      },
      calendar: [
        { monthRange: 'May-June', task: 'Nursery preparation and sowing.', months: [4, 5] },
        { monthRange: 'June-July', task: 'Transplanting of seedlings into the main field.', months: [5, 6] },
        { monthRange: 'Aug-Oct', task: 'Weed management, pest control, and fertilizer application.', months: [7, 8, 9] },
        { monthRange: 'Nov-Dec', task: 'Harvesting and threshing.', months: [10, 11] },
      ],
    },
  },
  {
    id: 'wheat',
    name: 'Wheat',
    type: 'Cereal',
    season: 'Rabi',
    image_url: 'https://i.imgur.com/f8f8f8f.jpg', // Replace with a real image URL
    details: {
      basic: {
        description: 'Wheat is a primary cereal crop, grown worldwide. It is a staple food for millions.',
        sowingWindow: 'October-November',
        seedRate: '40-50 kg/acre',
        spacing: '22.5cm between rows',
      },
      overview: {
        description: 'Wheat is a winter crop that requires a cool climate during its growing period and dry, warm weather at the time of ripening.',
        climate: 'Cool and moist weather during vegetative growth and warm, dry weather for maturity. Temperature: 10-25°C.',
        soil: 'Well-drained loamy soils are ideal. Soil pH should be between 6.0 and 7.5.',
      },
      symptoms: [
        { name: 'Rust', description: 'Orange to reddish-brown pustules on leaves and stems.' },
        { name: 'Smut', description: 'The grain is replaced by a black powdery mass of fungal spores.' },
      ],
      management: {
        dos: ['Use certified, disease-free seeds.', 'Timely sowing is crucial for good yield.', 'Apply balanced fertilizers.'],
        donts: ['Avoid waterlogging, especially during the early stages.', 'Do not delay harvesting once the crop is mature.'],
      },
      fertilizer: {
        plan: [
          { stage: 'Basal', recommendation: 'Full dose of Phosphorus and Potash, and half dose of Nitrogen at sowing.' },
          { stage: 'First Irrigation', recommendation: 'Apply the remaining half of Nitrogen.' },
        ],
      },
      calendar: [
        { monthRange: 'Oct-Nov', task: 'Sowing of seeds after land preparation.', months: [9, 10] },
        { monthRange: 'Dec-Jan', task: 'First irrigation and top dressing with nitrogen.', months: [11, 0] },
        { monthRange: 'Feb-Mar', task: 'Monitor for pests and diseases. Subsequent irrigations as needed.', months: [1, 2] },
        { monthRange: 'Apr-May', task: 'Harvesting and storage.', months: [3, 4] },
      ],
    },
  },
  {
    id: 'soybean',
    name: 'Soybean',
    type: 'Oilseed',
    season: 'Kharif',
    image_url: 'https://i.imgur.com/f8f8f8f.jpg', // Replace with a real image URL
    details: {
      basic: {
        description: 'Soybean is a versatile crop used for oil, food, and animal feed.',
        sowingWindow: 'June-July',
        seedRate: '20-25 kg/acre',
        spacing: '45cm x 5cm',
      },
      overview: {
        description: 'Soybean thrives in warm and moist climates. It is a leguminous plant, which enriches the soil with nitrogen.',
        climate: 'Warm and moist climate. Temperature: 20-30°C. Rainfall: 60-75 cm.',
        soil: 'Well-drained sandy loam soil with a pH between 6.0 and 7.5.',
      },
      symptoms: [
        { name: 'Yellow Mosaic Virus', description: 'Yellow mottled spots on leaves, plants become stunted.' },
        { name: 'Rust', description: 'Reddish-brown pustules on leaves, leading to defoliation.' },
      ],
      management: {
        dos: ['Use resistant varieties.', 'Maintain proper plant spacing.', 'Control whitefly to prevent virus spread.'],
        donts: ['Avoid water stress during pod filling stage.', 'Do not use excessive nitrogenous fertilizers.'],
      },
      fertilizer: {
        plan: [
          { stage: 'Basal', recommendation: 'Apply NPK at the time of sowing. Requires less nitrogen due to nitrogen fixation.' },
        ],
      },
      calendar: [
        { monthRange: 'June-July', task: 'Sowing.', months: [5, 6] },
        { monthRange: 'July-Aug', task: 'Weeding and pest management.', months: [6, 7] },
        { monthRange: 'Sep-Oct', task: 'Harvesting.', months: [8, 9] },
      ],
    },
  },
  {
    id: 'gram',
    name: 'Gram (Chickpea)',
    type: 'Pulse',
    season: 'Rabi',
    image_url: 'https://i.imgur.com/f8f8f8f.jpg', // Replace with a real image URL
    details: {
      basic: {
        description: 'Gram, or chickpea, is a major pulse crop, rich in protein.',
        sowingWindow: 'October-November',
        seedRate: '30-40 kg/acre',
        spacing: '30cm x 10cm',
      },
      overview: {
        description: 'It is a cool-season crop that can be grown in a wide range of soil types, but prefers light to heavy black soils.',
        climate: 'Cool and dry climate. Temperature: 18-28°C. Low rainfall is sufficient.',
        soil: 'Light to heavy soils, well-drained. pH 6-8.',
      },
      symptoms: [
        { name: 'Wilt', description: 'Sudden drooping and drying of the entire plant.' },
        { name: 'Pod Borer', description: 'Larvae feed on leaves, flowers, and pods, causing significant yield loss.' },
      ],
      management: {
        dos: ['Use wilt-resistant varieties.', 'Deep summer ploughing to expose pupae of pod borer.', 'Timely sowing.'],
        donts: ['Avoid excessive irrigation.', 'Do not grow in poorly drained soils.'],
      },
      fertilizer: {
        plan: [
          { stage: 'Basal', recommendation: 'A starter dose of nitrogen and a full dose of phosphorus.' },
        ],
      },
      calendar: [
        { monthRange: 'Oct-Nov', task: 'Sowing.', months: [9, 10] },
        { monthRange: 'Dec-Jan', task: 'Weeding and irrigation if necessary.', months: [11, 0] },
        { monthRange: 'Feb-Mar', task: 'Pod formation and pest management.', months: [1, 2] },
        { monthRange: 'Mar-Apr', task: 'Harvesting.', months: [2, 3] },
      ],
    },
  },
  {
    id: 'tomato',
    name: 'Tomato',
    type: 'Vegetable',
    season: 'Rabi',
    image_url: 'https://i.imgur.com/f8f8f8f.jpg', // Replace with a real image URL
    details: {
      basic: {
        description: 'Tomato is one of the most important vegetable crops grown throughout the world.',
        sowingWindow: 'June-July for Kharif, Oct-Nov for Rabi',
        seedRate: '150-200 g/acre',
        spacing: '60cm x 45cm',
      },
      overview: {
        description: 'Tomato plants are warm-season crops and cannot tolerate frost. They require a relatively long growing season.',
        climate: 'Warm and sunny weather. Temperature: 21-27°C.',
        soil: 'Well-drained sandy loam soil rich in organic matter. pH 6.0-7.0.',
      },
      symptoms: [
        { name: 'Early Blight', description: 'Dark, concentric spots on lower leaves and stems.' },
        { name: 'Fruit Borer', description: 'Larvae bore into fruits, making them unfit for consumption.' },
      ],
      management: {
        dos: ['Use healthy, disease-free seedlings.', 'Stake plants to keep fruits off the ground.', 'Practice crop rotation.'],
        donts: ['Avoid overhead irrigation to prevent fungal diseases.', 'Do not plant in fields previously cultivated with other solanaceous crops.'],
      },
      fertilizer: {
        plan: [
          { stage: 'Basal', recommendation: 'Apply FYM, and a full dose of P and K, and one-third of N.' },
          { stage: '30 days after transplanting', recommendation: 'Top dress with one-third of N.' },
          { stage: '50 days after transplanting', recommendation: 'Apply the remaining one-third of N.' },
        ],
      },
      calendar: [
        { monthRange: 'Oct-Nov', task: 'Nursery raising and transplanting for Rabi season.', months: [9, 10] },
        { monthRange: 'Dec-Jan', task: 'Staking, weeding, and first top dressing.', months: [11, 0] },
        { monthRange: 'Feb-Mar', task: 'Fruit development and pest management.', months: [1, 2] },
        { monthRange: 'Mar-Apr', task: 'Harvesting of mature fruits.', months: [2, 3] },
      ],
    },
  },
];