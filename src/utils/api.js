// New function to get coordinates from a location name
const getCoordsFromName = async (locationName) => {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=1&language=en&format=json`);
  if (!response.ok) {
    throw new Error('Failed to fetch coordinates from location name.');
  }
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const { latitude, longitude } = data.results[0];
    return { latitude, longitude };
  } else {
    throw new Error('Could not find coordinates for the location.');
  }
};

export const getCoordinatesForPin = async (pin) => {
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location for the given PIN code.');
    }
    const data = await response.json();
    if (data && data[0].Status === 'Success') {
      const postOffice = data[0].PostOffice[0];
      const locationName = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;
      const { latitude, longitude } = await getCoordsFromName(postOffice.District);
      return { latitude, longitude, name: locationName };
    } else {
      throw new Error(data[0].Message || 'No location found for the given PIN code.');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

import { OpenRouter } from "@openrouter/sdk";

export const getSeasonalAdvice = async (crop, region, month, weatherSummary) => {
  const openrouter = new OpenRouter({
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY_SEASONAL,
  });

  const prompt = `
    You are an expert agricultural advisor. Provide seasonal farming advice for a farmer in ${region} growing ${crop.name} during the month of ${month}.

    Current weather context: ${weatherSummary}

    Generate a structured JSON response with the following keys:
    - "weatherInsights": {{ "temperatureRange": "<min>°C - <max>°C", "rainfallLikelihood": "<Low/Medium/High>", "humidityNote": "<Brief note on humidity>" }}
    - "tasksAndTips": [ {{ "task": "<Actionable task 1>", "tip": "<Detailed tip for task 1>" }}, {{ "task": "<Actionable task 2>", "tip": "<Detailed tip for task 2>" }}, {{ "task": "<Actionable task 3>", "tip": "<Detailed tip for task 3>" }} ]
    - "contextualTips": {{ "irrigation": "<Specific irrigation advice>", "fertilizer": "<Specific fertilizer advice>", "pestRisk": "<Specific pest risk assessment and mitigation>" }}
    - "quickRecommendations": [ "<Short recommendation 1>", "<Short recommendation 2>", "<Short recommendation 3>" ]
  `;

  try {
    const stream = await openrouter.chat.send({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      stream: true,
    });

    let content = '';
    for await (const chunk of stream) {
      content += chunk.choices[0]?.delta?.content || '';
    }

    // Clean the response to extract pure JSON from a markdown block
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('AI advice error:', error);
    throw new Error('Failed to get AI-powered advice.');
  }
};

const toISODateString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeatherForecast = async (latitude, longitude, month) => {
  // Use last year for historical data as a seasonal baseline
  const year = new Date().getFullYear() - 1;
  const monthIndex = new Date(Date.parse(month +" 1, "+ year)).getMonth();
  const startDate = toISODateString(new Date(year, monthIndex, 1));
  const endDate = toISODateString(new Date(year, monthIndex + 1, 0));

  const params = new URLSearchParams({
    latitude,
    longitude,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean',
    timezone: 'auto',
    start_date: startDate,
    end_date: endDate,
  });

  try {
    // Use the archive API for historical data
    const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch historical weather data.');
    }
    const data = await response.json();
    return data.daily;
  } catch (error) {
    console.error('Historical weather error:', error);
    throw error;
  }
};
