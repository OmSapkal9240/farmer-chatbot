const VITE_OPENROUTER_API_KEY_SEASONAL = import.meta.env.VITE_OPENROUTER_API_KEY_SEASONAL;
const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Keep for translateText

export const getSeasonalAdvice = async (crop, region, month, weatherSummary, language) => {
  const prompt = `Provide seasonal farming advice for a farmer growing ${crop.name} in the ${region} region during the month of ${month}. The weather forecast summary is: ${weatherSummary}. The advice should be in ${language}, presented in clear, actionable steps.`;

  if (!VITE_OPENROUTER_API_KEY_SEASONAL) {
    throw new Error("VITE_OPENROUTER_API_KEY_SEASONAL is not set in the environment.");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VITE_OPENROUTER_API_KEY_SEASONAL}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert agricultural advisor providing seasonal farming tips." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting seasonal advice from OpenRouter:', error);
    throw error;
  }
};

export const translateText = async (text, targetLanguage) => {
  if (!text) {
    return '';
  }

  try {
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Translate the following text to ${targetLanguage} in a simple, farmer-friendly way: "${text}"`
            }
          ]
        }
      ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.candidates[0].content.parts[0].text;
    return translatedText;

  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return original text in case of an error
  }
};
