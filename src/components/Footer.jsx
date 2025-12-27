import React from 'react';
import useTranslation from '../hooks/useTranslation';

const Footer = () => {
  const { translatedText: footerText } = useTranslation('© 2025 Farmer Advisory AI — Built for TechFiesta Hackathon');
  return (
    <footer className="bg-transparent text-center py-6">
      <p className="text-sm text-slate-500">
        {footerText}
      </p>
    </footer>
  );
};

export default Footer;
