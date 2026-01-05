import React from 'react';
import './Loader.css';

const GeneratingLoader = ({ isListening, isProcessing, isSpeaking, onClick }) => {
  const getStatusText = () => {
    if (isListening) return 'Listening...';
    if (isProcessing) return 'Generating';
    if (isSpeaking) return 'Speaking...';
    return 'Tap to Speak';
  };

  const wrapperClass = `loader-wrapper ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''} ${isSpeaking ? 'speaking' : ''}`;

  return (
    <div className={wrapperClass} onClick={onClick}>
      {isProcessing ? (
        <>
          <span className="loader-letter">G</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">n</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">r</span>
          <span className="loader-letter">a</span>
          <span className="loader-letter">t</span>
          <span className="loader-letter">i</span>
          <span className="loader-letter">n</span>
          <span className="loader-letter">g</span>
        </>
      ) : (
        getStatusText()
      )}
      <div className="loader"></div>
    </div>
  );
};

export default GeneratingLoader;
