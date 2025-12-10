import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askLLM } from '../lib/chatApi';

// Demo responses
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

export default function ChatThread() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
    const chatContainerRef = useRef(null);

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

  const handleSend = useCallback(async () => {
    if (inputValue.trim() === '' || isProcessing) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    setError(null);

    try {
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
      const response = await askLLM(history);
      const botMessage = { role: 'assistant', content: response.choices[0].message.content };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const message = err.message.toLowerCase();
      if (message.includes('missing')) {
        setError({ type: 'API_KEY_MISSING', message: 'API key missing. Set VITE_GROQ_API_KEY in your environment.' });
      } else if (message.includes('invalid')) {
        setError({ type: 'INVALID_API_KEY', message: 'Invalid API key.' });
      } else {
        setError({ type: 'NETWORK_ERROR', message: 'Network error. Please try again.' });
      }
    } finally {
      setIsProcessing(false);
    }

  }, [inputValue, isProcessing, chatId]);

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
                  </div>

        <div className="flex-1 flex flex-col bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-slate-800">
          {error && <ErrorBanner error={error} />}
          
          <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth">
            <AnimatePresence>
              {messages.map((msg, index) => <MessageBubble key={index} msg={msg} />)}
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
              <button onClick={handleSend} disabled={isProcessing} className="p-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"><Send size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ErrorBanner = ({ error }) => (
  <div className="bg-red-800/90 text-white p-3 text-center text-sm flex items-center justify-center gap-3">
    <AlertTriangle size={18} />
    <span>{error.message}</span>
        {error.type === 'INVALID_API_KEY' && <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-red-200">Get Key</a>}
  </div>
);

const MessageBubble = ({ msg }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      role="log"
      className={`max-w-sm md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none' : `bg-slate-700/80 text-slate-200 rounded-bl-none ${msg.isError ? 'border border-red-500' : ''}`}`}>
      {msg.content}
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
