import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../utils/gemini';

const useTranslation = (text) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async () => {
    if (language === 'en') {
      setTranslatedText(text);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await translateText(text, language);
      setTranslatedText(result);
    } catch (err) {
      setError(err);
      setTranslatedText(text);
    } finally {
      setLoading(false);
    }
  }, [text, language]);

  useEffect(() => {
    translate();
  }, [translate]);

  return { translatedText, loading, error };
};

export default useTranslation;
