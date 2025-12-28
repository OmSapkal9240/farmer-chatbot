import { OpenRouter } from '@openrouter/sdk';

const callOpenRouter = async (messages, onChunk) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY_GOV;
  if (!apiKey) {
    console.error("OpenRouter API key is missing. Please add it to your .env file.");
    onChunk('AI features are disabled. API key is not configured.');
    return;
  }

  const openrouter = new OpenRouter({ apiKey });

  try {
    const stream = await openrouter.chat.send({
      model: 'openai/gpt-4o-mini',
      max_tokens: 800,
      temperature: 0.4,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    if (error.statusCode === 402) {
      console.error("OpenRouter Payment Required:", error.message);
      throw new Error('Low credits, try again later.');
    }
    console.error("Error fetching scheme information:", error);
    throw new Error('Scheme information is temporarily unavailable.');
  }
};

export const getSchemeInformation = async (schemeName, farmerType, onChunk) => {
  const messages = [
    {
      role: 'system',
      content: `You are an expert on Indian government schemes for farmers. Your goal is to help farmers. Use simple, farmer-friendly language. Emojis are encouraged.

- If the user asks for a specific scheme by name, provide a detailed explanation in the following format:
🌾 Scheme Name: ...
📘 Overview: ...
👨‍🌾 Who Can Apply: ...
💰 Benefits: ...
📝 Required Documents: ...
🛠 How to Apply: ...

- If the user asks for recommendations based on their needs, suggest 1-3 relevant schemes. For each scheme, provide a brief, easy-to-understand summary including its name, purpose, and key benefits.

- If you cannot find a relevant scheme, say so clearly.
- Do not use markdown like ###, **, or *.`,
    },
    {
      role: 'user',
      content: `Explain the "${schemeName}" scheme for a ${farmerType} farmer.`,
    },
  ];
  await callOpenRouter(messages, onChunk);
};

export const getSchemeRecommendation = async ({ farmerType, need, state }, onChunk) => {
  const needMap = {
    financial_support: 'financial support or money',
    crop_insurance: 'crop insurance',
    irrigation: 'irrigation or water',
    equipment: 'farm equipment or tools',
    soil_health: 'improving soil health',
  };

  let userContent = `I am a ${farmerType} farmer`;
  if (state) {
    userContent += ` in ${state}`;
  }
  userContent += `. I am looking for government schemes related to ${needMap[need] || 'general support'}. Please suggest 1-3 suitable schemes for me.`;

  const messages = [
    {
      role: 'system',
      content: `You are an expert on Indian government schemes for farmers. Your goal is to help farmers. Use simple, farmer-friendly language. Emojis are encouraged.

- If the user asks for a specific scheme by name, provide a detailed explanation in the following format:
🌾 Scheme Name: ...
📘 Overview: ...
👨‍🌾 Who Can Apply: ...
💰 Benefits: ...
📝 Required Documents: ...
🛠 How to Apply: ...

- If the user asks for recommendations based on their needs, suggest 1-3 relevant schemes. For each scheme, provide a brief, easy-to-understand summary including its name, purpose, and key benefits.

- If you cannot find a relevant scheme, say so clearly.
- Do not use markdown like ###, **, or *.`
    },
    {
      role: 'user',
      content: userContent,
    },
  ];

  await callOpenRouter(messages, onChunk);
};
