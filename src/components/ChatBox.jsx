import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askLLM } from '../lib/chatApi';
import useElevenLabsTTS from '../hooks/useElevenLabsTTS';

// Simple canned responses for demo mode
const demoReplies = {
  default: "This is a demo response. For a real answer, please provide an API key.",
  crop: "Demo: For tomatoes, ensure they get 6-8 hours of sunlight and are watered deeply once a week.",
  pest: "Demo: To control aphids, you can spray plants with a solution of water and a few drops of dish soap.",
};

const getDemoReply = (message) => {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('tomato') || lowerMsg.includes('crop')) return demoReplies.crop;
  if (lowerMsg.includes('pest') || lowerMsg.includes('aphid')) return demoReplies.pest;
  return demoReplies.default;
};

const ChatBox = ({ voice }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null); // { type: 'API_KEY_MISSING' | 'INVALID_API_KEY', message: '...' }
  const [useDemo, setUseDemo] = useState(false);
  const chatContainerRef = useRef(null);
  const { speak } = useElevenLabsTTS();

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chat_history');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([{ role: 'assistant', content: 'Namaskar! How can I assist you with your crops today?' }]);
      }
    } catch (e) {
      console.error("Failed to parse chat history:", e);
      setMessages([{ role: 'assistant', content: 'Namaskar! How can I assist you with your crops today?' }]);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(messages.slice(-20))); // save last 20 messages
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = useCallback(async () => {
    if (inputValue.trim() === '' || isProcessing) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    setError(null);

    try {
      let response;
      if (useDemo) {
        await new Promise(resolve => setTimeout(resolve, 500));
        response = { choices: [{ message: { content: getDemoReply(userMessage.content) } }] };
      } else {
        const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
        response = await askLLM(history);
        if (response.demo_mode) {
          console.log('Server instructed to use demo mode.');
          setUseDemo(true);
          response = { choices: [{ message: { content: getDemoReply(userMessage.content) } }] };
        }
      }
      const botMessage = { role: 'assistant', content: response.choices[0].message.content };
      setMessages((prev) => [...prev, botMessage]);
      speak(botMessage.content, voice);
    } catch (err) {
      const message = err.message.toLowerCase();
      if (message.includes('missing')) {
        setError({ type: 'API_KEY_MISSING', message: 'API key missing. Set VITE_OPENROUTER_API_KEY in your environment.' });
      } else if (message.includes('invalid')) {
        setError({ type: 'INVALID_API_KEY', message: 'Invalid API key.' });
      } else {
        setError({ type: 'NETWORK_ERROR', message: 'Network error. Please try again.' });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, isProcessing, useDemo, messages, speak, voice]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const ErrorBanner = () => {
    if (!error) return null;
    return (
      <div className="bg-red-800/80 backdrop-blur-sm text-white p-3 text-center text-sm flex items-center justify-center gap-3">
        <AlertTriangle size={18} />
        <span>{error.message}</span>
        {error.type === 'API_KEY_MISSING' && <button onClick={() => setUseDemo(true)} className="font-bold underline hover:text-red-200">Use demo replies</button>}
        {error.type === 'INVALID_API_KEY' && <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-red-200">Get Key</a>}
      </div>
    );
  };

  return (
    <div id="chat-section" className="fixed bottom-4 right-4 z-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl w-[440px] h-[600px] flex flex-col border border-slate-700 overflow-hidden">
          
          <div className="p-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-orbitron font-bold text-lg">Agri-Assistant</h3>
            <button onClick={() => setUseDemo(!useDemo)} className={`text-xs px-2 py-1 rounded-full ${useDemo ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-300'}`}>Demo {useDemo ? 'ON' : 'OFF'}</button>
          </div>

          <ErrorBanner />

          <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <MessageBubble key={index} msg={msg} />
              ))}
            </AnimatePresence>
            {isProcessing && <TypingIndicator />}
          </div>

          <div className="p-3 bg-slate-900/50 border-t border-slate-700">
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
              <button onClick={handleSend} disabled={isProcessing} className="p-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"><Send size={20} /></button>
            </div>
          </div>
        </motion.div>
    </div>
  );
};

const MessageBubble = ({ msg }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      role="log"
      className={`max-w-sm px-4 py-2 rounded-xl shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none' : `bg-slate-700 text-slate-200 rounded-bl-none ${msg.isError ? 'border border-red-500' : ''}`}`}>
      {msg.content}
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start">
      <div className="bg-slate-700 text-slate-200 px-4 py-3 rounded-xl shadow-md flex items-center space-x-2 rounded-bl-none">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
      </div>
  </motion.div>
);

export default ChatBox;
