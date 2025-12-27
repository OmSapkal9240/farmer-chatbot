import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <select value={language} onChange={handleChange} className="p-2 border rounded">
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="mr">Marathi</option>
    </select>
  );
};

export default LanguageSelector;
