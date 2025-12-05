import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ModulePage from './pages/ModulePage';
import ChatThread from './pages/ChatThread';
import OrbitBackground from './components/OrbitBackground';
import WeatherInsights from './pages/WeatherInsights';

function App() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat/');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1f] to-[#10172d] font-sans text-slate-200">
      {!isChatPage && <OrbitBackground />}
      {!isChatPage && <Navbar />}
      <main className={`${isChatPage ? '' : 'relative z-10'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:chatId" element={<ChatThread />} />
          <Route path="/crop-care" element={<ModulePage title="Crop Care" />} />
                    <Route path="/weather" element={<WeatherInsights />} />
          <Route path="/pest-diagnosis" element={<ModulePage title="Pest / Disease Diagnosis" />} />
          <Route path="/seasonal-advice" element={<ModulePage title="Seasonal Advice" />} />
          <Route path="/govt-schemes" element={<ModulePage title="Government Schemes" />} />
          <Route path="/whatsapp-sms" element={<ModulePage title="WhatsApp / SMS Access" />} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}

export default App;
