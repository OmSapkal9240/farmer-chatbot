import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

const SpeakerIcon = () => (
  <motion.div
    className="relative w-4 h-4 ml-2"
    animate={{
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Volume2 size={16} className="text-slate-400" />
  </motion.div>
);

export default SpeakerIcon;
