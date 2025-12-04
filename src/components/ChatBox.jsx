import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialMessages = [
  { text: 'Namaskar! How can I assist you with your crops today?', sender: 'bot' },
  { text: 'Tip: Balanced irrigation helps maintain soil moisture.', sender: 'bot' },
];

const ChatBox = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsProcessing(true);

    setTimeout(() => {
      const botResponse = { text: 'Assistant is preparing your advice...', sender: 'bot', isTyping: true };
      setMessages((prev) => [...prev, botResponse]);

      setTimeout(() => {
        setMessages((prev) => prev.slice(0, -1)); // Remove typing indicator
        const finalResponse = { text: 'Here is some advice based on your query.', sender: 'bot' };
        setMessages((prev) => [...prev, finalResponse]);
        setIsProcessing(false);
      }, 2000);
    }, 1000);
  };

  const MessageBubble = ({ msg }) => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl shadow-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
        {msg.text}
      </div>
    </motion.div>
  );

  const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start">
        <div className="bg-slate-700 text-slate-200 px-4 py-3 rounded-2xl shadow-md flex items-center space-x-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
        </div>
    </motion.div>
  );

  return (
    <div id="chat-section" className="fixed bottom-0 left-0 right-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-slate-800/60 backdrop-blur-xl rounded-t-2xl shadow-2xl max-w-4xl mx-auto border-t border-slate-700 overflow-hidden">
          <div ref={chatContainerRef} className="h-96 p-4 space-y-4 overflow-y-auto scroll-smooth">
            <AnimatePresence>
              {messages.map((msg, index) => (
                msg.isTyping ? <TypingIndicator key={index} /> : <MessageBubble key={index} msg={msg} />
              ))}
            </AnimatePresence>
            {isProcessing && !messages.some(m => m.isTyping) && <TypingIndicator />}
          </div>
          <div className="p-4 bg-slate-900/50 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 px-5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <button className="p-3 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-700"><Paperclip size={20} /></button>
              <button className="p-3 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-700"><Mic size={20} /></button>
              <button onClick={handleSend} className="p-3 bg-gradient-to-r from-blue-600 to-green-500 rounded-full text-white hover:opacity-90 transition-opacity transform hover:scale-110"><Send size={20} /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatBox;
