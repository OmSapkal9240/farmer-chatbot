import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import ModuleCard from '../components/ModuleCard';
import SectionBackground from '../components/SectionBackground';

const modules = [
  { icon: '🌾', title: 'Crop Care', desc: 'Get tailored crop advice.', path: '/crop-care' },
  { icon: '⛅', title: 'Weather Insights', desc: 'Check local forecasts.', path: '/weather-insights' },
  { icon: '🐛', title: 'Pest Diagnosis', desc: 'Identify and treat pests.', path: '/pest-diagnosis' },
  { icon: '📅', title: 'Seasonal Advice', desc: 'Plan for the season.', path: '/seasonal-advice' },
  { icon: '🏛️', title: 'Govt Schemes', desc: 'Find relevant schemes.', path: '/govt-schemes' },
  { icon: '📲', title: 'WhatsApp/SMS', desc: 'Connect via messaging.', path: '/whatsapp-sms' },
];

const FloatingFarmIcon = () => (
  <motion.div 
    animate={{ y: [-2, 2, -2] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    className="mt-8 text-emerald-400/50"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22s2-2 6-2 6 2 6 2"/><path d="M14 16s2-2 6-2"/><path d="M2 18s2-2 6-2 6 2 6 2"/><path d="M14 12s2-2 6-2"/><path d="M3 14s2-2 6-2 6 2 6 2"/><path d="M14 8s2-2 6-2"/>
    </svg>
  </motion.div>
);

export default function Home() {
  const navigate = useNavigate();

  const startChat = () => {
    const id = Date.now().toString();
    const chats = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
    chats.unshift({ id, title: "New Chat", messages: [{role:"assistant", content:"Namaskar! How can I help?"}] });
    localStorage.setItem("chat_sessions", JSON.stringify(chats));
    navigate(`/chat/${id}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div 
            className="relative w-full max-w-4xl mx-auto aspect-video bg-slate-900/50 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 mb-12 animate-float-subtle"
          >
             <div className="absolute -inset-8 bg-gradient-to-r from-green-500/30 to-cyan-500/30 rounded-full blur-3xl opacity-60"></div>
             <div className="flex items-center justify-center h-full text-slate-500">Video/Image Placeholder</div>
          </div>
          <div className="relative">
            <div className="absolute -inset-x-8 -top-4 h-32 bg-gradient-to-t from-transparent to-emerald-900/30 blur-3xl"></div>
            <h2 
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text animate-hue-shift"
            >
              Your AI Farming Assistant
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-8">
              Get instant, reliable advice on crops, weather, and more. Start a conversation to get the help you need.
            </p>
          </div>
          <div className="mt-10">
            <button 
              onClick={startChat}
              className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold rounded-full px-8 py-4 text-lg shadow-lg hover:shadow-cyan-400/40 hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <Rocket size={22} />
              <span>Start a New Chat</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Modules Grid */}
      <section className="mt-28 relative">
        <SectionBackground />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, i) => (
            <Link to={mod.path} key={i}>
              <ModuleCard {...mod} delay={i} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
