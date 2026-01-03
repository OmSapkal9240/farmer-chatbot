import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

const VoiceVisualizer = ({ isListening, isSpeaking, onClick }) => {
  const getBubbleStyle = (size, opacity, delay = 0) => ({
    position: 'absolute',
    width: size,
    height: size,
    backgroundColor: 'rgba(0, 194, 255, 0.5)',
    borderRadius: '50%',
    opacity: opacity,
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      repeatType: 'mirror', 
      delay 
    },
  });

  return (
    <div className="fixed bottom-24 right-1/2 translate-x-1/2 z-50">
      <motion.button
        onClick={onClick}
        className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform"
        whileTap={{ scale: 0.9 }}
      >
        {isListening && (
          <>
            <motion.div 
              className="absolute w-full h-full rounded-full bg-cyan-400/50"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
        {isSpeaking && (
          <>
             <motion.div 
              className="absolute w-full h-full rounded-full border-4 border-cyan-300"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
        <Mic size={32} className="text-white z-10" />
      </motion.button>
    </div>
  );
};

export default VoiceVisualizer;
