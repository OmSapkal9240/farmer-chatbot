// @/src/components/ErrorBanner.jsx

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

const ErrorBanner = ({ message, type = 'error' }) => {
  if (!message) return null;

  const isError = type === 'error';

  const containerClasses = isError
    ? 'bg-red-900/20 border-red-700/50 text-red-200'
    : 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200';

  const icon = isError
    ? <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0" />
    : <Info className="h-6 w-6 text-yellow-400 flex-shrink-0" />;

  const title = isError ? 'An Error Occurred' : 'Information';

  return (
    <div className={`p-4 rounded-lg flex items-start gap-4 mb-6 backdrop-blur-sm ${containerClasses}`}>
      {icon}
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorBanner;
