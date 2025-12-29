import { useState, useRef, useCallback } from 'react';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

const VOICE_IDS = {
  male: 'pNInz6obpgDQGcFmaJgB',   // Arjun
  female: '21m00Tcm4TlvDq8ikWAM', // Rachel
};

const useElevenLabsTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsError, setTtsError] = useState(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const lastSpokenTextRef = useRef(null);
  const currentAudioRef = useRef(null);

  const unlockAudio = useCallback(() => {
    if (isAudioUnlocked) return;
    const audio = new Audio();
    audio.volume = 0;
    audio.play().catch(() => {});
    setIsAudioUnlocked(true);
    console.log('Audio context unlocked.');
  }, [isAudioUnlocked]);

  const speak = useCallback(async (text, gender = 'female') => {
    if (!isAudioUnlocked || !text || isSpeaking || lastSpokenTextRef.current === text) {
      return;
    }

    if (!ELEVENLABS_API_KEY) {
      setTtsError({
        type: 'INVALID_API_KEY',
        message: 'ElevenLabs API key is missing. Please add it to your environment variables.',
      });
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    setIsSpeaking(true);
    lastSpokenTextRef.current = text;

    try {
      setTtsError(null); // Clear previous errors
      const voiceId = VOICE_IDS[gender] || VOICE_IDS.female;
      const audioStream = await client.textToSpeech.convert(voiceId, {
        text: text,
        model_id: 'eleven_multilingual_v2',
      });

      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }

      const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioPlayer = new Audio(audioUrl);
      currentAudioRef.current = audioPlayer;

      audioPlayer.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };

      audioPlayer.play();
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error);
      if (error.statusCode === 401) {
        setTtsError({
          type: 'INVALID_API_KEY',
          message: 'Invalid ElevenLabs API key. Please check your key.',
        });
      } else {
        setTtsError({ type: 'TTS_ERROR', message: 'An error occurred with text-to-speech.' });
      }
      setIsSpeaking(false);
      lastSpokenTextRef.current = null; // Allow retry on error
    }
  }, [isAudioUnlocked, isSpeaking]);

  const cancel = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.onended = null;
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, isAudioUnlocked, speak, cancel, unlockAudio, ttsError };
};

export default useElevenLabsTTS;
