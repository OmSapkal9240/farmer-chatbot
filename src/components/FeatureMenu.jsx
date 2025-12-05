import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const modules = [
  { name: 'Crop Care', path: '/crop-care' },
  { name: 'Weather Insights', path: '/weather' },
  { name: 'Pest / Disease Diagnosis', path: '/pest-diagnosis' },
  { name: 'Seasonal Advice', path: '/seasonal-advice' },
  { name: 'Government Schemes', path: '/govt-schemes' },
  { name: 'WhatsApp / SMS Access', path: '/whatsapp-sms' },
];

const FeatureMenu = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-slate-300 transition-colors duration-200"
      >
        <span>{t('modules')}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={16} /></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-slate-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-slate-700 overflow-hidden"
          >
            <ul className="py-1">
              {modules.map((module) => (
                <li key={module.name}>
                  <Link to={module.path} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors duration-200">
                    {module.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureMenu;
