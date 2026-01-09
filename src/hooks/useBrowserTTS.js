import { useState, useEffect, useCallback } from 'react';

const useBrowserTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged(); // Initial load
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  const speak = useCallback((text, lang, gender = 'female') => {
    if (!text || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Enhanced voice selection logic
    const genderKeyword = gender === 'male' ? 'Male' : 'Female';
    
    const languageVoices = voices.filter(voice => voice.lang === lang);
    let selectedVoice = languageVoices.find(voice => voice.name.includes(genderKeyword));

    if (!selectedVoice) {
        selectedVoice = languageVoices[0]; // Fallback to first available for the lang
    }
    if (!selectedVoice) {
        // Fallback to base language (e.g., 'en' for 'en-IN')
        selectedVoice = voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
    }

    utterance.voice = selectedVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, voices]);

  const cancel = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  return { isSpeaking, speak, cancel, isAudioUnlocked: true, unlockAudio: () => {} };
};

export default useBrowserTTS;
