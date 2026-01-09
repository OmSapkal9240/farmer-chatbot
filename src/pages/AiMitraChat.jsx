import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, AlertTriangle, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAiMitraResponse } from '../utils/aiMitra';
import { createSystemPrompt } from '../lib/context';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import usePiperTTS from '../hooks/usePiperTTS';
import GeneratingLoader from '../components/GeneratingLoader';
import SpeakerIcon from '../components/SpeakerIcon';
import { useTranslation } from 'react-i18next';
import { stripMarkdown, stripEmojis } from '../utils/formatters';
import StreamingText from '../components/StreamingText';

export default function AiMitraChat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState(null);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const { i18n } = useTranslation();
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const languageMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
  };
  const currentLang = languageMap[i18n.language] || 'en-IN';

  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition(currentLang);
  const { isReady, isSpeaking, speak, cancel } = usePiperTTS();


  // Load chat history
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ai_mitra_sessions') || '[]');
      const session = saved.find(s => s.id === chatId);
      if (session) {
        setMessages(session.messages);
      } else {
        setMessages([{ id: 'initial-greeting', role: 'assistant', content: 'Namaskar! How can I assist you with Maharashtra agriculture?' }]);
      }
    } catch (e) {
      setMessages([{ role: 'assistant', content: 'Namaskar! How can I assist you with Maharashtra agriculture?' }]);
    }
  }, [chatId]);


  // Auto-send transcript
  useEffect(() => {
    if (transcript) {
      handleSend(transcript);
    }
  }, [transcript]);



  // Save chat history
  useEffect(() => {
    if (messages.length > 1) {
      const saved = JSON.parse(localStorage.getItem('ai_mitra_sessions') || '[]');
      const sessionIndex = saved.findIndex(s => s.id === chatId);
      const newSession = { id: chatId, title: messages[1]?.content.substring(0, 30) || 'New Chat', messages };
      if (sessionIndex !== -1) {
        saved[sessionIndex] = newSession;
      } else {
        saved.push(newSession);
      }
      localStorage.setItem('ai_mitra_sessions', JSON.stringify(saved.slice(-10)));
    }
  }, [messages, chatId]);

  // Auto-scroll
  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Speak the bot's message automatically when a new one is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (voiceEnabled && isReady && lastMessage && lastMessage.role === 'assistant' && !isSpeaking && lastMessage.id !== lastSpokenMessageId) {
      let cleanedText = stripMarkdown(lastMessage.content);
      cleanedText = stripEmojis(cleanedText);
      speak(cleanedText, i18n.language);
      setLastSpokenMessageId(lastMessage.id);
    }
  }, [messages, isSpeaking, speak, lastSpokenMessageId, voiceEnabled, isReady, i18n.language]);

  const handleSend = useCallback((text) => {
    const messageToSend = typeof text === 'string' ? text : inputValue;
    if (messageToSend.trim() === '' || isProcessing) return;
    setInputValue('');
    cancel();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: messageToSend }]);
    setIsAwaitingResponse(true);
  }, [inputValue, isProcessing, cancel]);

  // Effect to generate bot response when a new user message is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    const getResponse = async () => {
      setIsProcessing(true);
      setError(null);

      try {
        let responseContent;
        const localResponse = getAiMitraResponse(lastMessage.content);

        if (localResponse) {
          setMessages((prev) => [...prev, { id: Date.now(), role: 'assistant', content: localResponse }]);
          setIsProcessing(false);
          return;
        } else {
          const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
          if (!apiKey || apiKey === '<PUT_OPENROUTER_API_KEY_HERE>') {
            throw new Error('API key not found for OpenRouter.');
          }

          const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini",
              messages: [createSystemPrompt(), ...messages.map(({ role, content }) => ({ role, content }))],
            }),
          });

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw new Error(errorData.error?.message || 'An unknown API error occurred.');
          }

          const data = await apiResponse.json();
          responseContent = data.choices[0].message.content;
        }

        setMessages((prev) => [...prev, { id: Date.now(), role: 'assistant', content: responseContent }]);
      } catch (err) {
        const errorMessage = err.message || 'Sorry, I encountered an error.';
        setError({ type: 'API_ERROR', message: errorMessage });
        setMessages((prev) => [...prev, { id: Date.now(), role: 'assistant', content: errorMessage }]);
      } finally {
        setIsProcessing(false);
        setIsAwaitingResponse(false);
      }
    };

    if (isAwaitingResponse && messages.length > 0 && messages[messages.length - 1].role === 'user' && !isProcessing) {
      getResponse(messages);
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Remove the text-based UI and replace with a voice-only interface
  useEffect(() => {
    // Automatically start listening when the component mounts and audio is unlocked
    if (voiceEnabled && !isListening && !isProcessing && !isSpeaking) {
      startListening();
    }
  }, [voiceEnabled, isProcessing, isSpeaking, startListening]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#0a0f1f] to-[#10172d] relative">
      <button className="absolute top-6 left-6 text-sm text-slate-300 hover:text-white transition" onClick={() => navigate('/')}>← Home</button>

      <div className="absolute top-6 right-6 flex items-center space-x-2">
        <span className={`text-sm ${voiceEnabled ? 'text-cyan-400' : 'text-slate-400'}`}>{isReady ? 'Voice' : 'Loading Voice...'}</span>
        <button 
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          disabled={!isReady}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${voiceEnabled ? 'bg-cyan-500' : 'bg-slate-700'} disabled:opacity-50`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${voiceEnabled ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>


      {error && <ErrorBanner error={error} />}

      <GeneratingLoader 
        isListening={isListening} 
        isSpeaking={isSpeaking}
        isProcessing={isProcessing}
        onClick={isListening ? stopListening : startListening} 
      />

      <div className="absolute bottom-10 text-center text-slate-400">
        <p>Tap the icon to speak</p>
      </div>
    </div>
  );
}

const ErrorBanner = ({ error }) => (
  <div className="bg-red-800/90 text-white p-3 text-center text-sm flex items-center justify-center gap-3">
    <AlertTriangle size={18} />
    <span>{error.message}</span>
        {error.type === 'INVALID_API_KEY' && <a href="https://elevenlabs.io/" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-red-200">Get Key</a>}
  </div>
);
