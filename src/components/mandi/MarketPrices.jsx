import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAgmarknetData from '../../hooks/useAgmarknetData';
import { cropNames as crops, states } from '../../data/crops';
import { Loader, AlertTriangle, TrendingUp, TrendingDown, ArrowRight, MapPin, Wheat, Store } from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
    <div className="h-10 bg-slate-700 rounded w-1/3 my-4"></div>
    <div className="flex justify-between">
      <div className="h-4 bg-slate-700 rounded w-1/4"></div>
      <div className="h-4 bg-slate-700 rounded w-1/4"></div>
    </div>
  </div>
);

const PriceCard = ({ record }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300 flex flex-col"
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="text-lg font-bold text-cyan-300 flex items-center"><Store className="w-5 h-5 mr-2" /> {record.market}</h3>
        <p className="text-sm text-slate-400"><Wheat className="w-4 h-4 mr-1.5 inline-block" /> {record.commodity} ({record.variety})</p>
      </div>
      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{new Date(record.arrival_date).toLocaleDateString('en-IN')}</span>
    </div>
    <div className="flex-grow flex items-center justify-center my-4">
        <p className="text-5xl font-extrabold text-green-400 [text-shadow:0_0_10px_rgba(74,222,128,0.5)]">₹{record.modal_price}</p>
        <p className="text-slate-400 self-end ml-2">/ Quintal</p>
    </div>
    <div className="flex justify-between text-base font-semibold border-t border-slate-700 pt-3">
      <p className="text-red-400">Min: <span className="font-bold">₹{record.min_price}</span></p>
      <p className="text-sky-400">Max: <span className="font-bold">₹{record.max_price}</span></p>
    </div>
  </motion.div>
);

const MarketPrices = () => {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [selectedMandi, setSelectedMandi] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { data, loading, error, lastUpdated, fetchData } = useAgmarknetData();

  
  const handleSearch = () => {
    if (selectedState && selectedCrop) {
      fetchData({ state: selectedState, commodity: selectedCrop });
      setHasSearched(true);
    }
  };

  const mandis = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map(item => item.market))];
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (selectedMandi) {
      return data.filter(item => item.market === selectedMandi);
    }
    return data;
  }, [data, selectedMandi]);

  if (!hasSearched) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full max-w-lg text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-cyan-300 to-green-300 mb-4 [text-shadow:0_0_20px_rgba(74,222,128,0.5)]">
            Live Mandi Bhav
          </h1>
          <p className="text-slate-300 text-lg mb-10">Apni fasal ka sahi bhav paayein, turant!</p>
          
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl space-y-8">
            <div className="relative text-left">
              <label htmlFor="state" className="block text-sm font-semibold text-slate-300 mb-2">1. Apna Rajya Chunein</label>
              <MapPin className="absolute left-4 top-11 w-5 h-5 text-slate-400 z-10" />
              <select id="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full pl-12 p-4 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none text-lg">
                {states.map(s => <option key={s} value={s}>{s}</option>)} 
              </select>
            </div>
            <div className="relative text-left">
              <label htmlFor="crop" className="block text-sm font-semibold text-slate-300 mb-2">2. Apni Fasal Chunein</label>
              <Wheat className="absolute left-4 top-11 w-5 h-5 text-slate-400 z-10" />
              <select id="crop" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full pl-12 p-4 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none text-lg">
                {crops.map(c => <option key={c} value={c}>{c}</option>)} 
              </select>
            </div>
            <motion.button 
              onClick={handleSearch} 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-4 px-4 rounded-lg text-xl hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader className="animate-spin mr-2" /> : 'Bhav Pata Karein'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 text-white p-4 sm:p-6 md:p-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-8 max-w-screen-2xl mx-auto">
        {/* Left Filter Panel */}
        <aside className="w-full lg:w-1/4 xl:w-1/5">
          <div className="sticky top-24 bg-slate-800/40 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-300">Filters</h2>
              <button onClick={() => setHasSearched(false)} className="text-sm text-cyan-300 hover:underline">
                New Search
              </button>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <label htmlFor="state" className="block text-sm font-semibold text-slate-300 mb-2">Rajya Chunein</label>
                <MapPin className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                <select id="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full pl-10 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none">
                  {states.map(s => <option key={s} value={s}>{s}</option>)} 
                </select>
              </div>
              <div className="relative">
                <label htmlFor="crop" className="block text-sm font-semibold text-slate-300 mb-2">Fasal Chunein</label>
                <Wheat className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                <select id="crop" value={selectedCrop} onChange={(e) => { setSelectedCrop(e.target.value); setSelectedMandi(''); }} className="w-full pl-10 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none">
                  {crops.map(c => <option key={c} value={c}>{c}</option>)} 
                </select>
              </div>
              <div className="relative">
                <label htmlFor="mandi" className="block text-sm font-semibold text-slate-300 mb-2">Mandi Chunein (Optional)</label>
                <Store className="absolute left-3 top-10 w-5 h-5 text-slate-400" />
                <select id="mandi" value={selectedMandi} onChange={(e) => setSelectedMandi(e.target.value)} className="w-full pl-10 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none" disabled={mandis.length === 0}>
                  <option value="">Sabhi Mandi</option>
                  {mandis.map(m => <option key={m} value={m}>{m}</option>)} 
                </select>
              </div>
              <motion.button 
                onClick={handleSearch} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <Loader className="animate-spin mr-2" /> : 'Refresh Bhav'}
              </motion.button>
            </div>
          </div>
        </aside>

        {/* Price Display Area */}
        <main className="w-full lg:w-3/4 xl:w-4/5">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center">
              <AlertTriangle className="mr-3 flex-shrink-0" />
              <div>
                <p className="font-bold">Data fetch karne mein samasya.</p>
                <p className="text-sm">{error} Kripya dobara koshish karein.</p>
              </div>
            </div>
          )}

          {lastUpdated && !loading && (
            <div className="bg-sky-900/50 border border-sky-700 text-sky-300 p-3 rounded-lg mb-6 text-center text-sm">
              {lastUpdated}
            </div>
          )}

          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              {!loading && filteredData.length > 0 && filteredData.map((record, index) => (
                <PriceCard key={`${record.market}-${record.commodity}-${index}`} record={record} />
              ))}
            </div>
          </AnimatePresence>

          {!loading && !error && filteredData.length === 0 && (
            <div className="text-center py-20 bg-slate-800/30 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-300">Data Uplabdh Nahi Hai</h3>
              <p className="text-slate-400 mt-2">Is fasal ke liye is mandi mein data uplabdh nahi hai.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MarketPrices;
