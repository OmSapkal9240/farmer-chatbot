import { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const synth = window.speechSynthesis;

  const populateVoiceList = () => {
    if (synth.getVoices().length > 0) {
      setVoices(synth.getVoices());
    } else {
      synth.onvoiceschanged = () => setVoices(synth.getVoices());
    }
  };

  useEffect(() => {
    populateVoiceList();
    return () => {
      synth.cancel();
    };
  }, []);

  const speak = (text, lang, onEnd, gender = 'female') => {
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) {
        onEnd();
      }
    };

    const selectedVoice = voices.find(voice => 
      voice.lang === lang && 
      (voice.name.toLowerCase().includes(gender))
    );

    const fallbackVoice = voices.find(voice => voice.lang === lang);
    const defaultVoice = voices.find(voice => voice.default);

    utterance.voice = selectedVoice || fallbackVoice || defaultVoice;
    utterance.lang = lang;
    utterance.rate = 1.15;
    utterance.pitch = 1;

    synth.speak(utterance);
  };

  const cancel = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return { isSpeaking, speak, cancel, voices };
};

export default useSpeechSynthesis;
