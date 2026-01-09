import React from 'react';

const StreamingText = ({ text, className }) => {
  return (
    <div className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {text}
    </div>
  );
};

export default StreamingText;
