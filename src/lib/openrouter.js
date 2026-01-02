const VITE_OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const getSchemeInformation = async (schemeName, farmerType, onChunk) => {
  const prompt = `Explain the government scheme "${schemeName}" for a ${farmerType} farmer. Focus on key benefits, eligibility, and the application process. Keep the language simple and clear.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VITE_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      const parsedLines = lines
        .map(line => line.replace(/^data: /, '').trim())
        .filter(line => line !== '' && line !== '[DONE]')
        .map(line => JSON.parse(line));

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          onChunk(content);
        }
      }
    }
  } catch (error) {
    console.error('Error getting scheme information:', error);
    throw error;
  }
};

export const getSchemeRecommendation = async (criteria, onChunk) => {
  const prompt = `Based on the following farmer profile, recommend the top 3-5 most relevant government schemes. For each scheme, provide a brief, easy-to-understand explanation of its benefits and how to apply.

**Farmer Profile:**
- **State:** ${criteria.state}
- **Farmer Type:** ${criteria.farmerType}
- **Primary Need:** ${criteria.need}

**Instructions:**
- Respond in simple, clear language suitable for a farmer.
- The response should be formatted for direct display in a chat interface.
- If the profile is incomplete, ask for the missing information.
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VITE_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      const parsedLines = lines
        .map(line => line.replace(/^data: /, '').trim())
        .filter(line => line !== '' && line !== '[DONE]')
        .map(line => JSON.parse(line));

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          onChunk(content);
        }
      }
    }
  } catch (error) {
    console.error('Error getting scheme recommendation:', error);
    throw error;
  }
};
