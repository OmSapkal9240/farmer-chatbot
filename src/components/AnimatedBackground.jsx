import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0a0f1f]">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-cyan-900/20 to-transparent"
        animate={{
          x: ['-10%', '10%', '-10%'],
          y: ['-20%', '20%', '-20%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-breathing"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-breathing animation-delay-4000"></div>
    </div>
  );
};

export default AnimatedBackground;
