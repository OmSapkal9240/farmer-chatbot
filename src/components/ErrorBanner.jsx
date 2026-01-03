import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorBanner = ({ message }) => (
  <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg flex items-center space-x-3 mb-6">
    <AlertTriangle className="h-6 w-6" />
    <div>
      <h4 className="font-bold">An Error Occurred</h4>
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

export default ErrorBanner;
