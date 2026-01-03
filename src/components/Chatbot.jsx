import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Chatbot = ({ crop }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GPT_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: `You are an expert agricultural assistant. Provide advice for ${crop.name}.` },
            ...messages,
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const botMessage = data.choices[0].message;
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching from GPT API:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I am having trouble getting a response. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="messages-container h-64 overflow-y-auto mb-4 p-2 bg-gray-700 rounded">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`message ${msg.role === 'user' ? 'text-right' : 'text-left'} mb-2`}>
            <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'}`}>
              {msg.content}
            </span>
          </motion.div>
        ))}
        {isLoading && <div className="text-center">Thinking...</div>}
      </div>
      <div className="input-container flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow p-2 rounded-l-lg bg-gray-600 border-none focus:outline-none"
          placeholder={`Ask about ${crop.name}...`}
        />
        <button onClick={handleSend} className="bg-blue-500 p-2 rounded-r-lg hover:bg-blue-600 transition-colors">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
