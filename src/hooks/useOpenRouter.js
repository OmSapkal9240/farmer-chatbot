import { useState } from 'react';
import { OpenRouter } from "@openrouter/sdk";

const useOpenRouter = () => {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResponse = async (messages, language = 'en') => {
    console.log('[useOpenRouter] Fetching response for messages:', messages);
    setIsLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OpenRouter API key is missing.');
      setError('OpenRouter API key is missing.');
      setIsLoading(false);
      setResponse('OpenRouter API key not configured.');
      return;
    }

    const openrouter = new OpenRouter({
      apiKey: apiKey,
    });

    const langMap = {
      en: 'English',
      hi: 'Hindi',
      mr: 'Marathi',
    };
    const fullLanguage = langMap[language] || 'English';

    const systemPrompt = `You are AI MITRA, a friendly agricultural assistant for Indian farmers. You have deep knowledge of all crops, soil health, weather, farming practices, pest management, government schemes, and sustainable farming. Your response MUST be in ${fullLanguage} only. Explain everything in very simple, farmer-friendly language. Avoid all technical jargon. Be calm, helpful, and practical. Your responses must be plain text, optimized for voice output, without any markdown formatting.`;

    const fullMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
    ];

    try {
      const stream = await openrouter.chat.send({
        model: "openai/gpt-4o-mini",
        messages: fullMessages,
        max_tokens: 800,
        stream: true,
      });

      let apiResponse = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          apiResponse += content;
        }
      }
      console.log('[useOpenRouter] Received response text:', apiResponse);
      setResponse(apiResponse);
    } catch (e) {
      console.error('OpenRouter API Error:', e);
      setError(e.message);
      setResponse('थोड़ा सा network issue है, फिर से try करें');
    } finally {
      setIsLoading(false);
    }
  };

  return { response, isLoading, error, fetchResponse };
};

export default useOpenRouter;
