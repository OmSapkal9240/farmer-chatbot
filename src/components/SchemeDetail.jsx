/**
 * @file SchemeDetail.jsx
 * @description This file belongs to the Government Schemes module. It displays the detailed view of a scheme.
 * TODO: Fetch detailed content for each tab from a live API.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Save, Download, Share2, Bell } from 'lucide-react';
import { saveSchemeToLocal } from '../utils/schemesUtils';

const TABS = ['Overview', 'Eligibility', 'Benefits', 'How to Apply', 'Documents'];

const SchemeDetail = ({ scheme }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const handleSave = () => {
    saveSchemeToLocal(scheme);
    alert(`${t(scheme.name[i18n.language] || scheme.name.en)} saved to your schemes!`);
  };

  const handleDownload = () => {
    // Mock download logic
    const summary = `Scheme: ${t(scheme.name[i18n.language] || scheme.name.en)}\nBenefits: ${scheme.benefits}`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scheme.id}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Eligibility': return <p>{scheme.eligibility}</p>;
      case 'Benefits': return <p>{scheme.benefits}</p>;
      case 'How to Apply': return <p>{scheme.regionNotes}</p>;
      case 'Documents': return <ul>{scheme.documents.map(doc => <li key={doc}>- {doc}</li>)}</ul>;
      case 'Overview':
      default:
        return <p>{scheme.longDesc}</p>;
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg h-full">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-green-400">{t(scheme.name[i18n.language] || scheme.name.en)}</h2>
          <p className="text-sm text-gray-400">Last updated: {new Date(scheme.lastUpdated).toLocaleDateString()}</p>
        </div>
        <span className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-full">Active</span>
      </div>

            <div className="flex flex-wrap gap-2 my-4">
        <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg font-bold transition-colors duration-200 hover:bg-green-600">
          <ExternalLink size={16} /> Official Page
        </a>
        <button onClick={handleSave} className="inline-flex items-center gap-2 py-2 px-4 bg-slate-600 text-white rounded-lg font-bold transition-colors duration-200 hover:bg-slate-500"><Save size={16} /> Save Scheme</button>
        <button onClick={handleDownload} className="inline-flex items-center gap-2 py-2 px-4 bg-slate-600 text-white rounded-lg font-bold transition-colors duration-200 hover:bg-slate-500"><Download size={16} /> Download</button>
        <button className="inline-flex items-center gap-2 py-2 px-4 bg-slate-600 text-white rounded-lg font-bold transition-colors duration-200 hover:bg-slate-500"><Share2 size={16} /> Share</button>
        <button className="inline-flex items-center gap-2 py-2 px-4 bg-slate-600 text-white rounded-lg font-bold transition-colors duration-200 hover:bg-slate-500"><Bell size={16} /> Notify Me</button>
      </div>

      <div className="border-b border-gray-700 mb-4">
        <nav className="-mb-px flex space-x-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-green-500 text-green-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="text-gray-300 text-sm leading-relaxed min-h-[200px]">
        {renderTabContent()}
      </div>

          </div>
  );
};

export default SchemeDetail;
