import { useState, useRef, useCallback } from 'react';

const useGroqSTT = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        transcribe(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript('');
      setError(null);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('थोड़ा सा network issue है, फिर से try करें');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const transcribe = async (audioBlob) => {
    const apiKey = import.meta.env.VITE_GROQ_AI_MITRA_API_KEY;
    if (!apiKey) {
      console.error('Groq API key is not set.');
      setError('API key not configured.');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('temperature', '0');
    formData.append('response_format', 'verbose_json');

    try {
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTranscript(data.text);
    } catch (err) {
      console.error('Error during transcription:', err);
      setError('थोड़ा सा network issue है, फिर से try करें');
    }
  };

  return { isRecording, transcript, error, startRecording, stopRecording };
};

export default useGroqSTT;
