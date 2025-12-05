import React from 'react';

const SectionBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-teal-500/30 to-green-500/30 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyan-500/30 to-emerald-500/30 rounded-full blur-3xl opacity-20" />
    </div>
  );
};

export default SectionBackground;
