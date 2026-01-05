import React from 'react';

const parseAdviceText = (text) => {
  if (!text) return null;

  const parts = text.split(/\n--------------------------------------------------\n/);

  if (parts.length < 2) {
    return {
      header: '',
      summary: '',
      sections: [{ title: 'Advice', content: text }],
    };
  }

  const headerPart = parts[0].split('\n');
  const header = headerPart[0] || '';
  const summary = headerPart.length > 1 ? headerPart.slice(1).join('\n') : '';

  const sections = parts.slice(1).map((part) => {
    const lines = part.trim().split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    return { title, content };
  });

  return { header, summary, sections };
};

const getSectionIcon = (title) => {
  const icons = {
    '🌦️ Weather Check': '🌦️',
    '🌾 What To Do This Month': '🌾',
    '💧 Water & Nutrition': '💧',
    '🐛 Watch Out For': '🐛',
    '🌿 Daily Care Tips': '🌿',
    '🌾 Harvest & Storage': '🌾',
    '⭐ Expert Advice': '⭐'
  };
  return icons[title] || '🌱';
};

const AdviceCard = ({ title, content }) => {
  const icon = getSectionIcon(title);
  return (
  <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-green-400/20 rounded-3xl p-6 md:p-8 transform hover:scale-[1.01] transition-all duration-500 hover:shadow-2xl hover:shadow-green-400/10 relative overflow-hidden h-full">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-t-3xl"></div>
    <div className="relative z-10 h-full flex flex-col">
      <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400 mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
        <span className="text-3xl md:text-4xl">{icon}</span>
        <span className="leading-tight">{title}</span>
      </h3>
      <div className="bg-gray-700/40 rounded-2xl p-4 md:p-5 backdrop-blur-sm border border-gray-600/20 flex-grow">
        <p className="text-gray-100 whitespace-pre-wrap font-normal leading-relaxed text-sm md:text-base">{content}</p>
      </div>
    </div>
  </div>
  );
};

const FormattedAdvice = ({ text }) => {
  const advice = parseAdviceText(text);

  if (!advice) {
    return null;
  }

  const { header, summary, sections } = advice;

  return (
    <div className="font-sans w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 lg:p-12 xl:p-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-3xl blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-teal-400 to-green-300 mb-4 text-center">
              {header}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 italic font-light max-w-3xl mx-auto px-4">{summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 w-full">
          {sections.map((section, index) => (
            <AdviceCard key={index} title={section.title} content={section.content} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormattedAdvice;
