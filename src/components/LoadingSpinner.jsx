import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  const leafVariants = {
    initial: { scale: 0.5, opacity: 0, rotate: -15 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.7, 
        ease: 'easeOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={leafVariants}
        initial="initial"
        animate="animate"
      >
        <path 
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
          fill="url(#leafGradient)"
        />
        <defs>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#34D399', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
};

export default LoadingSpinner;
