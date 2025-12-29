/**
 * @file seasonal.js
 * @description This file belongs to the Seasonal Advice module. It contains mock data for seasonal tasks and advice.
 * TODO: Replace this with a real API call to a backend service that provides localized, dynamic seasonal data.
 */

// Placeholder for crop icons. In a real app, these would be in /public/assets/icons/
const placeholderIcon = (name) => `https://placehold.co/40x40.png/16a34a/ffffff?text=${name.charAt(0)}`;

export const SEASONAL_DATA = {
  crops: [
    { id: 'tomato', name: 'Tomato', icon: placeholderIcon('Tomato'), seasons: ['Kharif', 'Rabi', 'Zaid'] },
    { id: 'paddy', name: 'Paddy (Rice)', icon: placeholderIcon('Paddy'), seasons: ['Kharif', 'Rabi'] },
    { id: 'groundnut', name: 'Groundnut', icon: placeholderIcon('Groundnut'), seasons: ['Kharif', 'Rabi'] },
    { id: 'bajra', name: 'Bajra (Pearl Millet)', icon: placeholderIcon('Bajra'), seasons: ['Kharif'] },
    { id: 'sugarcane', name: 'Sugarcane', icon: placeholderIcon('Sugarcane'), seasons: ['Kharif', 'Rabi'] },
    { id: 'onion', name: 'Onion', icon: placeholderIcon('Onion'), seasons: ['Kharif', 'Rabi'] },
  ],
  tasks: {
    tomato: {
      January: [{ type: 'sowing', task: 'Sow seeds for summer crop.' }, { type: 'fertilizer', task: 'Prepare nursery beds with FYM.' }],
      February: [{ type: 'irrigate', task: 'Transplant seedlings and provide light irrigation.' }],
      March: [{ type: 'fertilizer', task: 'First top dressing with Nitrogen.' }],
      April: [{ type: 'pest-alert', task: 'Monitor for pests like whiteflies and fruit borers.' }],
      May: [{ type: 'harvest', task: 'Begin harvesting early varieties.' }],
      June: [{ type: 'sowing', task: 'Sow seeds for Kharif crop.' }],
      July: [{ type: 'irrigate', task: 'Transplant seedlings for Kharif season.' }],
      August: [{ type: 'task', task: 'Staking and pruning of plants.' }],
      September: [{ type: 'pest-alert', task: 'Watch for late blight disease during monsoon.' }],
      October: [{ type: 'harvest', task: 'Final harvesting of Kharif crop.' }],
      November: [{ type: 'sowing', task: 'Sow seeds for Rabi crop.' }],
      December: [{ type: 'task', task: 'Protect young plants from frost.' }],
    },
    paddy: {
      June: [{ type: 'sowing', task: 'Prepare nursery and sow seeds for Kharif season.' }],
      July: [{ type: 'irrigate', task: 'Transplant seedlings into the main field. Maintain water level.' }],
      August: [{ type: 'fertilizer', task: 'Apply first top dressing of Nitrogen.' }],
      September: [{ type: 'pest-alert', task: 'Monitor for stem borer and leaf folder.' }],
      October: [{ type: 'harvest', task: 'Harvesting of early maturing varieties.' }],
      November: [{ type: 'sowing', task: 'Sow seeds for Rabi (Boro) paddy.' }],
    },
    groundnut: {},
    bajra: {},
    sugarcane: {},
    onion: {},
  },
  tips: {
    tomato: {
      irrigation: {
        en: 'Irrigate every 5-7 days. Use drip irrigation to save water and reduce fungal diseases.',
        hi: 'हर 5-7 दिनों में सिंचाई करें। पानी बचाने और फंगल रोगों को कम करने के लिए ड्रिप सिंचाई का उपयोग करें।',
        mr: 'दर ५-७ दिवसांनी पाणी द्या. पाण्याची बचत करण्यासाठी आणि बुरशीजन्य रोग कमी करण्यासाठी ठिबक सिंचन वापरा।',
        why: 'Consistent moisture is key for fruit development and preventing blossom-end rot.'
      },
      fertilizer: {
        en: 'Side-dress with a balanced NPK fertilizer 30 days after transplanting.',
        hi: 'रोपाई के 30 दिन बाद संतुलित एनपीके उर्वरक के साथ साइड-ड्रेसिंग करें।',
        mr: 'लावणीनंतर ३० दिवसांनी संतुलित एनपीके खताची मात्रा द्या।',
        why: 'Provides essential nutrients during the critical growth phase.'
      },
    },
    paddy: {
       irrigation: {
        en: 'Maintain 2-5 cm of standing water in the field until tillering stage.',
        hi: 'कल्ले फूटने की अवस्था तक खेत में 2-5 सेमी पानी खड़ा रखें।',
        mr: 'फुटवे येईपर्यंत शेतात २-५ सेंमी पाणी ठेवा।',
        why: 'Ensures proper root development and suppresses weed growth.'
      },
    },
    groundnut: {},
    bajra: {},
    sugarcane: {},
    onion: {},
  },
};
