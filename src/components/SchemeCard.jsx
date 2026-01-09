/**
 * @file SchemeCard.jsx
 * @description This file belongs to the Government Schemes module. It's a card for a single scheme in the list.
 * TODO: Add a small icon for each category.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

const SchemeCard = ({ scheme, onSelect, isSelected }) => {
  const { t, i18n } = useTranslation();

  return (
    <div 
      onClick={onSelect}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-green-800/50 ring-2 ring-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}
    >
      <h3 className="font-bold text-lg text-green-400">{scheme.name[i18n.language] || scheme.name.en}</h3>
      <p className="text-sm text-gray-400 mt-1 mb-2">{scheme.shortDesc}</p>
      <div className="flex flex-wrap gap-2">
        {scheme.categories.map(cat => (
          <span key={cat} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full capitalize">{cat}</span>
        ))}
      </div>
    </div>
  );
};

export default SchemeCard;
