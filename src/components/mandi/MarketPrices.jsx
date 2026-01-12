import React, { useState, useEffect, useMemo } from 'react';
import useAgmarknetData from '../../hooks/useAgmarknetData';
import { cropNames as crops, states } from '../../data/crops';
import { Loader, AlertCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const Card = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md transform hover:-translate-y-1 transition-transform duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
        {children}
    </div>
);

const MarketPrices = () => {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [selectedMandi, setSelectedMandi] = useState('');
  const { data, loading, error, fetchData } = useAgmarknetData();

  useEffect(() => {
    if (selectedState && selectedCrop) {
      fetchData({ state: selectedState, commodity: selectedCrop });
    }
  }, [selectedState, selectedCrop, fetchData]);

  const handleRefresh = () => {
    if (selectedState && selectedCrop) {
      fetchData({ state: selectedState, commodity: selectedCrop });
    }
  };

  const { latestPrice, previousPrice, mandis } = useMemo(() => {
    if (!data || data.length === 0) return { latestPrice: null, previousPrice: null, mandis: [] };

    const uniqueMandis = [...new Set(data.map(item => item.market))];
    
    let filteredData = data;
    if (selectedMandi) {
        filteredData = data.filter(item => item.market === selectedMandi);
    }

    if (filteredData.length === 0) return { latestPrice: null, previousPrice: null, mandis: uniqueMandis };

    const sortedData = [...filteredData].sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date));

    const latest = sortedData[0];
    const previous = sortedData.find(d => new Date(d.arrival_date) < new Date(latest.arrival_date));

    return { latestPrice: latest, previousPrice: previous, mandis: uniqueMandis };
  }, [data, selectedMandi]);

  const priceMovement = useMemo(() => {
    if (!latestPrice || !previousPrice) {
      return { text: 'Kal ka data uplabdh nahi', icon: <ArrowRight className="w-8 h-8" />, color: 'text-gray-500' };
    }
    const latestModal = parseFloat(latestPrice.modal_price);
    const previousModal = parseFloat(previousPrice.modal_price);

    if (isNaN(latestModal) || isNaN(previousModal)) return { text: 'Bhav uplabdh nahi', icon: <ArrowRight className="w-8 h-8" />, color: 'text-gray-500' };

    const change = latestModal - previousModal;

    if (change > 0) {
      return { text: 'Kal ke mukable bhav badha', icon: <TrendingUp className="w-8 h-8" />, color: 'text-green-600' };
    } else if (change < 0) {
      return { text: 'Kal ke mukable bhav ghata', icon: <TrendingDown className="w-8 h-8" />, color: 'text-red-600' };
    } else {
      return { text: 'Kal ke mukable bhav sthir', icon: <ArrowRight className="w-8 h-8" />, color: 'text-gray-500' };
    }
  }, [latestPrice, previousPrice]);

  const priceTrend = useMemo(() => {
    if (!latestPrice || !previousPrice) {
      return {
        trend: 'Trend Spasht Nahi',
        advice: 'Bhav ka trend janne ke liye pichla data uplabdh nahi hai.',
        emoji: '🤔'
      };
    }

    const latestModal = parseFloat(latestPrice.modal_price);
    const previousModal = parseFloat(previousPrice.modal_price);
    
    if (isNaN(latestModal) || isNaN(previousModal) || previousModal === 0) {
        return { trend: 'Trend Spasht Nahi', advice: 'Data aparyaapt hai.', emoji: '🤔' };
    }

    const percentageChange = ((latestModal - previousModal) / previousModal) * 100;

    if (percentageChange > 2) {
      return {
        trend: 'Bhav Badh Raha Hai',
        advice: 'Bhav badhne ki ummeed hai. Agar sambhav ho to fasal ko thoda rok kar bechein.',
        emoji: '📈'
      };
    } else if (percentageChange < -2) {
      return {
        trend: 'Bhav Gir Raha Hai',
        advice: 'Bhav girne ki aashanka hai. Jaldi bechne ka vichar karein.',
        emoji: '📉'
      };
    } else {
      return {
        trend: 'Bhav Sthir Hai',
        advice: 'Bhav sthir rehne ki sambhavna hai. Apni suvidha anusar bech sakte hain.',
        emoji: '➡️'
      };
    }
  }, [latestPrice, previousPrice]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      <aside className="w-full lg:w-1/4 xl:w-1/5 bg-white p-6 rounded-2xl shadow-md h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bhav Pata Karein</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-600 mb-2">Rajya Chunein</label>
            <select id="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="crop" className="block text-sm font-medium text-gray-600 mb-2">Fasal Chunein</label>
            <select id="crop" value={selectedCrop} onChange={(e) => { setSelectedCrop(e.target.value); setSelectedMandi(''); }} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="mandi" className="block text-sm font-medium text-gray-600 mb-2">Mandi Chunein (Optional)</label>
            <select id="mandi" value={selectedMandi} onChange={(e) => setSelectedMandi(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" disabled={mandis.length === 0}>
              <option value="">Sabhi Mandi</option>
              {mandis.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <button onClick={handleRefresh} disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? <Loader className="animate-spin mr-2" /> : 'Bhav Refresh Karein'}
          </button>
        </div>
      </aside>

      <main className="w-full lg:w-3/4 xl:w-4/5">
        {loading && !data && (
          <div className="flex justify-center items-center h-96">
            <Loader className="w-12 h-12 text-green-600 animate-spin" />
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md flex items-center">
            <AlertCircle className="mr-3" />
            <p className="font-semibold">{error}</p>
          </div>
        )}
        {data && !latestPrice && !loading && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md">
                <p className="font-bold text-lg">Is fasal ke liye abhi koi bhav uplabdh nahi hai.</p>
                <p className="text-sm mt-1">Kripya koi aur fasal ya rajya chunein.</p>
            </div>
        )}
        {latestPrice && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="🧺 Aaj ka Mandi Bhav">
              <p className="text-xl font-semibold text-gray-700">{latestPrice.commodity} ({latestPrice.variety})</p>
              <p className="text-lg text-gray-500">{selectedMandi ? latestPrice.market : 'प्रमुख मंडियां'}</p>
              <div className="my-4 text-center">
                <p className="text-5xl font-bold text-green-700">₹{latestPrice.modal_price}</p>
                <p className="text-gray-500">prati Quintal</p>
              </div>
              <div className="flex justify-between text-lg">
                <p className="text-red-600">Min: ₹{latestPrice.min_price}</p>
                <p className="text-blue-600">Max: ₹{latestPrice.max_price}</p>
              </div>
              <p className="text-sm text-gray-400 mt-4 text-right">Date: {new Date(latestPrice.arrival_date).toLocaleDateString('en-IN')}</p>
            </Card>

            <Card title="📊 Bhav mein Badalav">
              <div className={`flex items-center justify-center h-full ${priceMovement.color}`}>
                {priceMovement.icon}
                <p className="text-xl font-bold ml-3">{priceMovement.text}</p>
              </div>
            </Card>

            <Card title="🔮 Agle Kuch Din ka Trend">
              <div className="text-center h-full flex flex-col justify-center items-center">
                <p className="text-4xl mb-2">{priceTrend.emoji}</p>
                <p className="text-xl font-bold text-gray-800">{priceTrend.trend}</p>
                <p className="text-sm text-gray-500 mt-2">Ye trend pichhle bhav ke adhar par hai.</p>
              </div>
            </Card>

            <Card title="🧠 Kisan ke liye Salah">
              <div className="h-full flex items-center justify-center">
                <p className="text-lg text-center font-medium text-gray-700">{priceTrend.advice}</p>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketPrices;
