import { useState, useEffect } from 'react';

const useAimlApi = (userPrompt, language = 'en') => {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const langMap = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
  };
  const fullLanguage = langMap[language] || 'English';

  const systemPrompt = `You are an AI assistant for a farmer advisory platform. Your first response should be a brief, welcoming message in ${fullLanguage}. The user is on the landing page. Welcome them and mention that the platform supports multiple languages. Keep it under 20 words.`;

  useEffect(() => {
    const fetchResponse = async () => {
      setIsLoading(true);
      setError(null);

            const apiKey = import.meta.env.VITE_AI_ML_API_KEY_LANDING_PAGE;
      if (!apiKey) {
        setError('API key is missing.');
        setIsLoading(false);
        // Set a default welcome message if API key is not present
        setResponse('WELCOME TO AI CHATBOT FOR FARMER ADVISORY. MULTIPLE LANGUAGES SUPPORTED.');
        return;
      }

      try {
        const res = await fetch('https://api.aimlapi.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                                content: systemPrompt
              },
              {
                role: 'user',
                content: userPrompt
              }
            ]
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setResponse(data.choices[0].message.content);
      } catch (e) {
        setError(e.message);
        // Fallback message on API error
        setResponse('WELCOME TO AI CHATBOT FOR FARMER ADVISORY. MULTIPLE LANGUAGES SUPPORTED.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userPrompt) {
      fetchResponse();
    }
    }, [userPrompt, language]);

  return { response, isLoading, error };
};

export default useAimlApi;
