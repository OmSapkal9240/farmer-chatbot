import React from 'react';
import { motion } from 'framer-motion';

const ModulePage = ({ title }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
    >
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      <p className="mt-4 text-lg text-slate-400">This page is under construction.</p>
    </motion.div>
  );
};

export default ModulePage;
