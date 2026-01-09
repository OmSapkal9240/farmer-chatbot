import { useState, useEffect, useRef, useCallback } from 'react';
import vad from 'voice-activity-detection';

const useVAD = ({ onVoiceStart, onVoiceStop }) => {
  const [isListening, setIsListening] = useState(false);
  const vadRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);

  const stop = useCallback(() => {
    if (vadRef.current) {
      vadRef.current.destroy();
      vadRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    stop(); // Ensure everything is clean before starting
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const vadOptions = {
        onVoiceStart,
        onVoiceStop,
      };

      vadRef.current = vad(audioContext, stream, vadOptions);
      setIsListening(true);
    } catch (error) {
      console.error('Error starting VAD:', error);
    }
  }, [stop, onVoiceStart, onVoiceStop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { isListening, start, stop };
};

export default useVAD;
