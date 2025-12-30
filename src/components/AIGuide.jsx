import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Volume2, Loader, Bot } from 'lucide-react';
import useAimlApi from '../hooks/useAimlApi';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

const AIGuide = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const [initialPromptSent, setInitialPromptSent] = useState(false);
  // Using a static prompt for the initial message
    const { response, isLoading, error } = useAimlApi(
    initialPromptSent ? `Welcome the user in ${currentLang}` : null,
    currentLang
  );
  const { isSpeaking, speak, cancel } = useSpeechSynthesis();

  useEffect(() => {
    // Trigger the API call once the component mounts
    setInitialPromptSent(true);
  }, []);

    useEffect(() => {
    if (response && !isLoading && !isSpeaking) {
      handleSpeak();
    }
  }, [response, isLoading]);

  const handleSpeak = () => {
    if (isSpeaking) {
      cancel();
    } else if (response) {
            const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        mr: 'mr-IN',
      };
      const speechLang = langMap[currentLang] || 'en-US';
      speak(response, speechLang);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex items-center space-x-4 max-w-2xl mx-auto mt-8 shadow-lg"
    >
            <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-cyan-500 flex items-center justify-center bg-slate-700">
        <Bot size={36} className="text-cyan-400" />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-cyan-400">AI Mitra</h3>
        {isLoading ? (
          <div className="flex items-center space-x-2 text-slate-400">
            <Loader className="animate-spin" size={18} />
            <span>Thinking...</span>
          </div>
        ) : (
          <p className="text-slate-300">
            {error ? 'Sorry, I am unable to greet you right now.' : response}
          </p>
        )}
      </div>
      <button
        onClick={handleSpeak}
        disabled={isLoading || !response}
        className="p-3 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <Volume2 size={24} />
      </button>
    </motion.div>
  );
};

export default AIGuide;
