import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const ManualLocationInput = ({ onPinSubmit }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length === 6 && !isNaN(pin)) {
      onPinSubmit(pin);
    }
  };

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-lg mb-6">
      <p className="text-sm mb-2">Could not automatically detect your location. Please enter your 6-digit PIN code to get localized advice.</p>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter 6-digit PIN"
            maxLength={6}
            className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 disabled:bg-gray-500"
          disabled={pin.length !== 6 || isNaN(pin)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ManualLocationInput;
