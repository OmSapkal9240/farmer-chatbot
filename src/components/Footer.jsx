import React from 'react';
import { useTranslation } from 'react-i18next';
import { version } from '../../package.json';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-transparent text-center py-6">
      <p className="text-sm text-slate-500">
        {t('footerText')} | Version {version}
      </p>
    </footer>
  );
};

export default Footer;
