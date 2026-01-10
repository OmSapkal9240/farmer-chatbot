import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// A simple WhatsApp icon SVG. You can replace this with a more detailed one if needed.
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const FloatingWhatsAppButton = ({ isHomePage }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate('/whatsapp-sms');
  };

  return (
    <div className={`fixed ${isHomePage ? 'bottom-28' : 'bottom-8'} right-6 z-50 group`}>
      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: [1, 1.03, 1],
          boxShadow: [
            '0 0 20px rgba(37, 211, 102, 0.4)',
            '0 0 30px rgba(37, 211, 102, 0.6)',
            '0 0 20px rgba(37, 211, 102, 0.4)',
          ],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg"
      >
        <WhatsAppIcon />
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-max px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md shadow-lg pointer-events-none"
      >
        Chat on WhatsApp
        <div className="absolute top-full right-1/2 translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
      </motion.div>
    </div>
  );
};

export default FloatingWhatsAppButton;
