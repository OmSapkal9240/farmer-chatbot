// @/src/components/ManualLocationInput.jsx

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const ManualLocationInput = ({ onPinSubmit }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length === 6) {
      onPinSubmit(pin);
    }
  };

  return (
    <div className="bg-yellow-900/20 border border-yellow-700/50 text-yellow-200 p-4 rounded-lg mb-6 backdrop-blur-sm">
      <p className="text-sm font-medium mb-3">Could not automatically detect your location.</p>
      <p className="text-xs text-yellow-300/80 mb-3">Please enter your 6-digit PIN code to get localized advice.</p>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-grow">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300/50" size={18} />
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Enter 6-digit PIN"
            maxLength={6}
            className="w-full p-2 pl-10 bg-[#0f1b2e]/50 border border-yellow-800/60 rounded-md text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-yellow-500/20"
          disabled={pin.length !== 6}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ManualLocationInput;
