import React from 'react';

const renderValue = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc list-inside pl-4">
        {value.map((item, index) => (
          <li key={index}>{renderValue(item)}</li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object' && value !== null) {
    return (
      <div className="pl-4 border-l-2 border-gray-200 mt-2">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="mb-2">
            <strong className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</strong>
            <div className="pl-2">{renderValue(val)}</div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const InfoCard = ({ title, data }) => {
  return (
    <div className="bg-slate-50 rounded-lg shadow-md p-6 border border-slate-200">
      {title && <h3 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">{title}</h3>}
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <strong className="font-semibold capitalize text-slate-600">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
            <div className="pl-2 text-slate-700">{renderValue(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
