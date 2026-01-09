import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ModuleCard from '../components/ModuleCard';
import SectionBackground from '../components/SectionBackground';
import AnimatedHeadline from '../components/AnimatedHeadline';
// import AIGuide from '../components/AIGuide';

const modules = [
  { icon: '🤖', titleKey: 'AI Mitra (Local RAG)', descKey: 'Specialized assistant for Maharashtra farmers, using local data.', path: '/ai-mitra/new', isExternal: true },
  { icon: '🌾', titleKey: 'home.modules.crop_care.title', descKey: 'home.modules.crop_care.desc', path: '/crop-care' },
  { icon: '⛅', titleKey: 'home.modules.weather_insights.title', descKey: 'home.modules.weather_insights.desc', path: '/weather' },
  { icon: '🐛', titleKey: 'home.modules.pest_diagnosis.title', descKey: 'home.modules.pest_diagnosis.desc', path: '/pest-diagnosis' },
  { icon: '📅', titleKey: 'home.modules.seasonal_advice.title', descKey: 'home.modules.seasonal_advice.desc', path: '/seasonal-advice' },
  { icon: '🏛️', titleKey: 'home.modules.govt_schemes.title', descKey: 'home.modules.govt_schemes.desc', path: '/govt-schemes' },
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
  const { t } = useTranslation();

  const startChat = () => {
    const id = Date.now().toString();
    const chats = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
    chats.unshift({ id, title: t('chat.new_chat'), messages: [{role:"assistant", content:t('chat.welcome_message')}] });
    localStorage.setItem("chat_sessions", JSON.stringify(chats));
    navigate(`/chat/${id}`);
  };

  const startAiMitraChat = () => {
    const id = Date.now().toString();
    const chats = JSON.parse(localStorage.getItem("ai_mitra_sessions") || "[]");
    chats.unshift({ id, title: 'New AI Mitra Chat', messages: [{role:"assistant", content:'Namaskar! How can I assist you with Maharashtra agriculture?'}] });
    localStorage.setItem("ai_mitra_sessions", JSON.stringify(chats));
    navigate(`/ai-mitra/${id}`);
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
            className="relative w-full max-w-4xl mx-auto aspect-video rounded-3xl shadow-2xl shadow-inner shadow-black/50 overflow-hidden border border-slate-700 mb-12"
          >
             <div className="absolute -inset-8 bg-gradient-to-r from-green-500/30 to-cyan-500/30 rounded-full blur-3xl opacity-60 border-2 border-cyan-400/50"></div>
             <img src="/models/hero-image.jpg" alt="A vibrant image of farmers working in a lush green field under a clear sky, representing modern agriculture."
              className="relative w-full h-full object-cover" />
          </div>
          <div className="relative">
            {/* <div className="absolute -inset-x-8 -top-4 h-32 bg-gradient-to-t from-transparent to-emerald-900/30 blur-3xl"></div> */}
            <AnimatedHeadline 
              text={t('home.title')}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text animate-hue-shift shining-text"
            />
            <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-8">
              {t('home.subtitle')}
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <motion.button 
              onClick={startChat}
              className="text-white font-semibold rounded-full px-8 py-4 text-lg shadow-lg flex items-center space-x-3 transition-all duration-300 cta-button"
              whileHover={{ scale: 1.1, transition: { type: 'spring', stiffness: 300 } }}
              whileTap={{ scale: 0.9 }}
                          >
              <Rocket size={22} />
              <span>{t('home.cta')}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* AI Guide Section */}
        {/* <AIGuide /> */}
      </section>

      {/* Modules Grid */}
      <section className="mt-28 relative">
        {/* <SectionBackground /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.filter(m => m.path !== '/ai-mitra/new').map((mod, i) => {
            const title = mod.isExternal ? mod.titleKey : t(mod.titleKey);
            const desc = mod.isExternal ? mod.descKey : t(mod.descKey);

            return (
              <Link to={mod.path} key={i}>
                <ModuleCard icon={mod.icon} title={title} desc={desc} delay={i} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Mitra Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 group"
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <button
          onClick={startAiMitraChat}
          className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-cyan-500 transition-all duration-300 border-2 border-slate-700 hover:border-cyan-400"
          aria-label="Start AI Mitra Chat"
        >
          🤖
        </button>
        <div className="absolute -top-12 right-0 w-max bg-slate-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          AI Mitra (Local RAG)
        </div>
      </motion.div>
    </main>
  );
}
