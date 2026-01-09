const VITE_OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const getSchemeInformation = async (schemeName, farmerType, onChunk) => {
  const prompt = `You are a helpful and friendly government scheme expert for farmers. Your goal is to explain schemes in a way that is very easy to understand.

**Your Task:**
Explain the government scheme named "${schemeName}" for a ${farmerType} farmer.

**Output Rules (Strict):**
1.  **Tone:** Speak like a helpful friend, not a robot or a government document. Use a warm and encouraging tone.
2.  **Language:** Use simple, everyday words. Avoid jargon and complex sentences.
3.  **Formatting:**
    - Do NOT use any markdown symbols like *, #, -, or **.
    - Use clear headings for different sections (e.g., "Key Benefits", "Who can apply?", "How to apply?").
    - Use short paragraphs.

**Content Focus:**
-   **Key Benefits:** What are the main advantages for the farmer?
-   **Eligibility:** Who can apply for this scheme? Make it very clear.
-   **Application Process:** Explain the steps to apply in a simple, step-by-step manner.

Now, please explain the "${schemeName}" scheme.`;

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
        .filter(line => line !== '' && line !== '[DONE]' && !line.startsWith(':')) // Ignore comment lines
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

export const getCropCareInfo = async (cropName, section, onChunk) => {
  const prompt = `You are an experienced and friendly agriculture expert. Your goal is to provide practical, easy-to-understand advice to farmers.

**Your Task:**
Explain the "${section}" for growing ${cropName} in a simple, farmer-friendly manner.

**Output Rules (Strict):**
1.  **Tone:** Speak like a seasoned field expert giving advice. Be encouraging and clear.
2.  **Language:** Use simple, everyday words. Avoid academic or technical jargon.
3.  **Formatting:**
    - Do NOT use any markdown symbols like *, #, -, or **.
    - Use short, readable paragraphs.

**Content Focus:**
- Provide actionable tips and common mistakes to avoid.
- Keep the information concise and to the point.

Now, please explain the "${section}" for ${cropName}.`;

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
        .filter(line => line !== '' && line !== '[DONE]' && !line.startsWith(':'))
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
    console.error('Error getting crop care information:', error);
    throw error;
  }
};

export const getSchemeRecommendation = async (criteria, onChunk) => {
  const prompt = `You are a helpful and friendly government scheme expert for farmers. Your goal is to recommend the best schemes based on a farmer's needs.

**Your Task:**
Based on the farmer's profile below, recommend the top 3-5 most relevant government schemes. For each scheme, provide a brief, easy-to-understand explanation of its benefits and how to apply.

**Farmer Profile:**
- **State:** ${criteria.state}
- **Farmer Type:** ${criteria.farmerType}
- **Primary Need:** ${criteria.need}

**Output Rules (Strict):**
1.  **Tone:** Speak like a helpful friend, not a robot. Use a warm and encouraging tone.
2.  **Language:** Use simple, everyday words. Avoid jargon.
3.  **Formatting:**
    - Do NOT use any markdown symbols like *, #, -, or **.
    - Clearly label each recommended scheme.
    - Use short paragraphs.
4.  **Behavior:**
    - If the profile is incomplete, politely ask for the missing information instead of providing recommendations.

Now, please provide the recommendations.`;

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
        .filter(line => line !== '' && line !== '[DONE]' && !line.startsWith(':')) // Ignore comment lines
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
