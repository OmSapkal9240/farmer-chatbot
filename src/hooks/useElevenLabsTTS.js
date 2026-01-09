import { useState, useRef, useCallback } from 'react';

const useElevenLabsTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
    const [ttsError, setTtsError] = useState(null);
    const audioRef = useRef(null);

    const unlockAudio = useCallback(() => {
        if (isAudioUnlocked) return;
        const audio = new Audio();
        audio.volume = 0;
        audio.play().catch(() => {});
        setIsAudioUnlocked(true);
    }, [isAudioUnlocked]);

    const speak = useCallback(async (text, voice, onPlaybackEnd) => {
        if (!isAudioUnlocked || !text || isSpeaking) return;

        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        if (!apiKey || apiKey === '<PUT_ELEVENLABS_API_KEY_HERE>') {
            setTtsError({ type: 'INVALID_API_KEY', message: 'ElevenLabs API key not found.' });
            setIsSpeaking(false);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        setIsSpeaking(true);

        const voiceId = voice === 'male' ? 'dxhwlBCxCrnzRlP4wDeE' : '90ipbRoKi4CpHXvKVtl0';
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: text.replace(/(\*\*|###|\*)/g, ''), // Strip markdown
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        };

        try {
            setTtsError(null);
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail?.message || 'Failed to fetch audio from ElevenLabs');
            }
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            audio.play();

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
                if (onPlaybackEnd) {
                    onPlaybackEnd();
                }
            };
        } catch (error) {
            console.error('ElevenLabs TTS Error:', error);
            setTtsError({ type: 'API_ERROR', message: error.message });
            setIsSpeaking(false);
        }
    }, [isSpeaking, isAudioUnlocked]);

    const cancel = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsSpeaking(false);
    }, []);

    return { isSpeaking, speak, cancel, isAudioUnlocked, unlockAudio, ttsError };
};

export default useElevenLabsTTS;
