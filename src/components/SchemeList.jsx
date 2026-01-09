/**
 * @file SchemeList.jsx
 * @description This file belongs to the Government Schemes module. It renders the list of schemes.
 * TODO: Add pagination or infinite scroll for large numbers of schemes.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import SchemeCard from './SchemeCard';

const SchemeList = ({ schemes, onSelectScheme, selectedSchemeId }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {schemes.length > 0 ? (
        schemes.map(scheme => (
          <SchemeCard 
            key={scheme.id} 
            scheme={scheme} 
            onSelect={() => onSelectScheme(scheme)} 
            isSelected={selectedSchemeId === scheme.id}
          />
        ))
      ) : (
        <p className="text-gray-400 text-center py-8">{t('schemes.list.no_match')}</p>
      )}
    </div>
  );
};

export default SchemeList;
