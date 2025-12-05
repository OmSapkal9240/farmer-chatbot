// src/components/WeatherCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const WeatherCard = ({ day, icon, minTemp, maxTemp, tip }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-white shadow-lg 
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <h3 className="text-xl font-bold text-center font-orbitron">{day}</h3>
      <img 
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
        alt="weather icon" 
        className="w-20 h-20 mx-auto" 
      />
      <div className="text-center my-2">
        <span className="text-lg font-semibold">{Math.round(maxTemp)}°</span>
        <span className="text-gray-300 ml-2">{Math.round(minTemp)}°</span>
      </div>
      <p className="text-xs text-center text-cyan-200 h-10">{tip}</p>
    </motion.div>
  );
};

export default WeatherCard;
