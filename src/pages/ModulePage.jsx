import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Smartphone, ArrowRight } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const WhatsAppSMSPage = () => {

  const openWhatsApp = () => {
    window.location.href = 'https://api.whatsapp.com/send?phone=15817019840&text=C4D36X';
  };

  return (
    <div className="relative min-h-screen text-white p-8 overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-4xl mx-auto">

        {/* Hero Block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer bg-[length:200%_100%]">WhatsApp & SMS Crop Advisory</h1>
          <p className="text-xl text-slate-300 mb-6">Get instant crop guidance directly on your phone.</p>
          <div className="flex justify-center space-x-8 text-slate-400">
            <span>No app download needed</span>
            <span>Works on basic smartphones</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* WhatsApp Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-lg hover:shadow-glow-green-blue-hover hover:-translate-y-1.5 transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MessageCircle className="w-10 h-10 text-emerald-400 mr-4 shadow-icon-glow" />
              </motion.div>
              <h2 className="text-2xl font-semibold">Chat with Kisan Pulse on WhatsApp</h2>
            </div>
            <p className="text-slate-400 mb-6">
              Crop care guidance, seasonal tips, and simple messages to help you grow more.
            </p>
            <motion.button
              onClick={openWhatsApp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all duration-300 group animate-pulse-glow"
            >
              <span>Start WhatsApp Chat</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
            <p className="text-xs text-slate-500 mt-4 text-center">You will be redirected to WhatsApp. No login required • Free to use.</p>
          </motion.div>

          {/* SMS Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-lg opacity-80"
          >
            <div className="flex items-center mb-4">
              <Smartphone className="w-10 h-10 text-slate-500 mr-4" />
              <h2 className="text-2xl font-semibold text-slate-500">SMS Advisory (Coming Soon)</h2>
            </div>
            <p className="text-slate-500 mb-6">
              Get updates and alerts directly via SMS. This feature is under development.
            </p>
            <button
              disabled
              className="w-full bg-slate-700 text-slate-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
            <p className="text-xs text-slate-600 mt-4 text-center">Backend integration required</p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default WhatsAppSMSPage; 

