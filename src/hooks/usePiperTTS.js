import { useState, useRef, useEffect, useCallback } from 'react';

const usePiperTTS = () => {
    const [isReady, setIsReady] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const workerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!workerRef.current) {
            workerRef.current = new Worker('/piper/piper-worker.js');
        }

        const onMessage = (event) => {
            const { status, output } = event.data;
            if (status === 'ready') {
                setIsReady(true);
            } else if (status === 'complete') {
                const wav = new Blob([output.audio], { type: 'audio/wav' });
                const url = URL.createObjectURL(wav);
                
                if (audioRef.current) {
                    audioRef.current.pause();
                }

                const audio = new Audio(url);
                audioRef.current = audio;
                audio.play();

                audio.onended = () => {
                    setIsSpeaking(false);
                    URL.revokeObjectURL(url);
                    audioRef.current = null;
                };
            } else if (status === 'error') {
                console.error('Piper TTS Worker Error:', output);
                setIsSpeaking(false);
            }
        };

        workerRef.current.addEventListener('message', onMessage);

        return () => {
            workerRef.current.removeEventListener('message', onMessage);
            workerRef.current.terminate();
        };
    }, []);

    const speak = useCallback((text, language = 'en') => {
        if (!isReady || isSpeaking || !text) return;

        setIsSpeaking(true);
        workerRef.current.postMessage({ text, language });

    }, [isReady, isSpeaking]);

    const cancel = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsSpeaking(false);
    }, []);

    return { isReady, isSpeaking, speak, cancel };
};

export default usePiperTTS;
