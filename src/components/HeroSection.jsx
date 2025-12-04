import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  const scrollToChat = () => {
    document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-40 md:pb-24 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative inline-block"
      >
        <div className="absolute -inset-12 bg-gradient-to-r from-blue-600/30 to-green-600/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <motion.div
          animate={{ y: ['-4px', '4px', '-4px'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full max-w-4xl mx-auto aspect-video bg-slate-900/70 rounded-2xl shadow-2xl overflow-hidden border border-slate-700"
        >
          <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
             {/* You can replace this with a real video source */}
            <source src="https://cdn.pixabay.com/video/2020/09/13/50632-459920139_large.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-16 mb-6 text-2xl md:text-3xl font-semibold text-slate-200 max-w-3xl mx-auto tracking-tight"
      >
        {t('heroSlogan')}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-10"
      >
        <button
          onClick={scrollToChat}
          className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
        >
          {t('getStarted')}
        </button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
