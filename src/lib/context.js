import { crops } from '../data/crops';
import { PEST_DATA } from '../data/pests';
import { SCHEMES_DATA } from '../data/schemes';
import { SEASONAL_DATA } from '../data/seasonal';

const generateContext = () => {
  const context = {
    crops,
    pests: PEST_DATA,
    schemes: SCHEMES_DATA,
    seasonal_advice: SEASONAL_DATA,
  };
  return JSON.stringify(context);
};

export const createSystemPrompt = () => {
  const context = generateContext();
  return {
    role: 'system',
    content: `You are an expert assistant for a farmer advisory application. Your knowledge is strictly limited to the data provided below. Do not answer any questions that are not related to this data. If a user asks about something not in the context, politely decline and state that you can only answer questions about the provided crop, pest, scheme, and seasonal information.

Here is the application's data:

${context}`,
  };
};
