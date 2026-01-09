import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const languages = {
  en: 'English',
  mr: 'मराठी',
  hi: 'हिन्दी',
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-slate-300 transition-colors duration-200"
      >
        <span>{languages[i18n.language]}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={16} /></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-32 bg-slate-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-slate-700 overflow-hidden"
          >
            <ul className="py-1">
              {Object.keys(languages).map((lng) => (
                <li key={lng}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      changeLanguage(lng);
                    }}
                    className={`block px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors duration-200 ${i18n.language === lng ? 'font-bold' : ''}`}>
                    {languages[lng]}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
