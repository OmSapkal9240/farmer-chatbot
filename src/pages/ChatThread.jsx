import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, AlertTriangle, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createSystemPrompt } from '../lib/context';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import useElevenLabsTTS from '../hooks/useElevenLabsTTS';
import VoiceVisualizer from '../components/VoiceVisualizer';
import SpeakerIcon from '../components/SpeakerIcon';
import { useTranslation } from 'react-i18next';
import { stripMarkdown } from '../utils/formatters';

export default function ChatThread() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
    const chatContainerRef = useRef(null);
  const { i18n } = useTranslation();
  const [voiceGender, setVoiceGender] = useState('female');

  const languageMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
  };
  const currentLang = languageMap[i18n.language] || 'en-IN';

  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition(currentLang);
  const { speak, isSpeaking, cancel, isAudioUnlocked, unlockAudio, ttsError } = useElevenLabsTTS();


  // Load chat history
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('chat_sessions') || '[]');
      const session = saved.find(s => s.id === chatId);
      if (session) {
        setMessages(session.messages);
      } else {
        setMessages([{ role: 'assistant', content: 'Namaskar! How can I assist you?' }]);
      }
    } catch (e) {
      setMessages([{ role: 'assistant', content: 'Namaskar! How can I assist you?' }]);
    }
  }, [chatId]);

  // Speak the bot's message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !isSpeaking && isAudioUnlocked) {
      const cleanedText = stripMarkdown(lastMessage.content);
      speak(cleanedText, voiceGender);
    }
  }, [messages]);

  // Auto-send transcript
  useEffect(() => {
    if (transcript) {
      handleSend(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (ttsError) {
      setError(ttsError);
    }
  }, [ttsError]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 1) {
      const saved = JSON.parse(localStorage.getItem('chat_sessions') || '[]');
      const sessionIndex = saved.findIndex(s => s.id === chatId);
      const newSession = { id: chatId, title: messages[1]?.content.substring(0, 30) || 'New Chat', messages };
      if (sessionIndex !== -1) {
        saved[sessionIndex] = newSession;
      } else {
        saved.push(newSession);
      }
      localStorage.setItem('chat_sessions', JSON.stringify(saved.slice(-10)));
    }
  }, [messages, chatId]);

  // Auto-scroll
  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = useCallback(async (text) => {
    const messageToSend = typeof text === 'string' ? text : inputValue;
    if (messageToSend.trim() === '' || isProcessing) return;

    setInputValue('');
    cancel();

    const userMessage = { role: 'user', content: messageToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsProcessing(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey || apiKey === '<PUT_OPENROUTER_API_KEY_HERE>') {
        setError({ type: 'DEMO_MODE', message: 'API key not found. Running in demo mode.' });
        const botMessage = {
          role: 'assistant',
          content: "I'm in demo mode. Please provide an OpenRouter API key to enable full functionality."
        };
        setMessages(prev => [...prev, botMessage]);
        setIsProcessing(false);
        return;
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/gpt-4o-mini",
          "messages": [createSystemPrompt(), ...newMessages.map(({ role, content }) => ({ role, content }))]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'An unknown error occurred.');
      }

      const data = await response.json();
      const botMessage = data.choices[0].message;
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      setError({ type: 'API_ERROR', message: err.message || 'Failed to get response from AI.' });
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, isProcessing, messages, chatId, cancel]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 py-8 bg-gradient-to-b from-[#0a0f1f] to-[#10172d]">
      <div className="w-full max-w-3xl flex flex-col h-[85vh]">
        <div className="relative flex items-center justify-center mb-4 p-2">
          <button className="absolute left-0 text-sm text-slate-300 hover:text-white transition" onClick={() => navigate('/')}>← Home</button>
          <h1 className="font-orbitron font-bold text-xl text-center">Agri-Assistant</h1>
          <div className="absolute right-0 flex items-center space-x-2">
            <button onClick={() => setVoiceGender('male')} className={`px-2 py-1 text-xs rounded ${voiceGender === 'male' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300'}`}>Male</button>
            <button onClick={() => setVoiceGender('female')} className={`px-2 py-1 text-xs rounded ${voiceGender === 'female' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300'}`}>Female</button>
          </div>
                  </div>

        <div className="relative flex-1 flex flex-col bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-slate-800">
          {!isAudioUnlocked && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
              <button 
                onClick={unlockAudio} 
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-105"
              >
                Enable Voice
              </button>
            </div>
          )}

          {error && <ErrorBanner error={error} />}
          
          <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth">
            <AnimatePresence>
              {messages.map((msg, index) => (
              <MessageBubble 
                key={index} 
                msg={msg} 
                isSpeaking={isSpeaking && index === messages.length - 1 && msg.role === 'assistant'} 
              />
            ))}
            </AnimatePresence>
            {isProcessing && <TypingIndicator />}
          </div>

          <div className="p-4 bg-slate-900/50 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <textarea
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about your crops..."
                aria-label="Chat input"
                className="flex-grow bg-slate-800 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-300 resize-none leading-tight"
              />
              <button onClick={() => handleSend()} disabled={isProcessing || !inputValue} className="p-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"><Send size={20} /></button>
            </div>
          </div>
        </div>
      </div>
      <VoiceVisualizer 
        isListening={isListening} 
        isSpeaking={isSpeaking} 
        onClick={isListening ? stopListening : startListening} 
      />
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

const MessageBubble = ({ msg, isSpeaking }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      role="log"
      className={`max-w-sm md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none' : `bg-slate-700/80 text-slate-200 rounded-bl-none ${msg.isError ? 'border border-red-500' : ''}`}`}>
      {msg.content}
      {isSpeaking && <SpeakerIcon />}
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start">
    <div className="bg-slate-700/80 text-slate-200 px-4 py-3 rounded-xl shadow-md flex items-center space-x-2 rounded-bl-none">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
    </div>
  </motion.div>
);
