import React from 'react';

const FormattedAdvice = ({ text }) => {
  if (!text) {
    return null;
  }

  return (
    <div className="bg-gray-800 border-2 border-green-500/50 rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
        <span className="mr-2">🌱</span>
        Advice
      </h3>
      <div className="text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
        {text}
      </div>
    </div>
  );
};

export default FormattedAdvice;
