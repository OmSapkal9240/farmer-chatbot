import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import ModuleCard from '../components/ModuleCard';

const modules = [
  { icon: '🌾', title: 'Crop Care', desc: 'Get tailored crop advice.', path: '/crop-care' },
  { icon: '⛅', title: 'Weather Insights', desc: 'Check local forecasts.', path: '/weather-insights' },
  { icon: '🐛', title: 'Pest Diagnosis', desc: 'Identify and treat pests.', path: '/pest-diagnosis' },
  { icon: '📅', title: 'Seasonal Advice', desc: 'Plan for the season.', path: '/seasonal-advice' },
  { icon: '🏛️', title: 'Govt Schemes', desc: 'Find relevant schemes.', path: '/govt-schemes' },
  { icon: '📲', title: 'WhatsApp/SMS', desc: 'Connect via messaging.', path: '/whatsapp-sms' },
];

export default function Home() {
  const navigate = useNavigate();

  const startChat = () => {
    const id = Date.now().toString();
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    chats.unshift({ id, title: "New Chat", messages: [{role:"assistant", text:"Namaskar! How can I help?"}] });
    localStorage.setItem("chats", JSON.stringify(chats));
    navigate(`/chat/${id}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
      {/* Hero Section */}
      <section className="text-center">
        <div 
          className="relative w-full max-w-4xl mx-auto aspect-video bg-slate-900/50 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 mb-12"
          style={{ animation: 'floatY 4s ease-in-out infinite' }}
        >
           <div className="absolute -inset-8 bg-gradient-to-r from-green-500/30 to-cyan-500/30 rounded-full blur-3xl opacity-60"></div>
           <div className="flex items-center justify-center h-full text-slate-500">Video/Image Placeholder</div>
        </div>
        <h2 
          style={{ fontFamily: "'Orbitron', sans-serif" }}
          className="text-3xl md:text-4xl font-bold mb-8 gradient-text"
        >
          Helping Indian Farmers with Smart, Simple, Multilingual Advisory.
        </h2>
        <button 
          onClick={startChat}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-lg font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-cyan-500/30"
        >
          Start a New Chat
        </button>
      </section>

      {/* Modules Grid */}
      <section className="mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <Link to={mod.path} key={i}>
              <ModuleCard {...mod} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
