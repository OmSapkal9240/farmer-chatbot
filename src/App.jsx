import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ModulePage from './pages/ModulePage';
import CropCarePage from './components/CropCarePage';
import PestDiagnosisPage from './pages/PestDiagnosisPage';
import SeasonalAdvicePage from './pages/SeasonalAdvicePage';
import GovtSchemesPage from './pages/GovtSchemesPage';
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
          <Route path="/crop-care" element={<CropCarePage />} />
          <Route path="/weather" element={<WeatherInsights />} />
          <Route path="/pest-diagnosis" element={<PestDiagnosisPage />} />
          <Route path="/seasonal-advice" element={<SeasonalAdvicePage />} />
          <Route path="/govt-schemes" element={<GovtSchemesPage />} />
          <Route path="/whatsapp-sms" element={<ModulePage title="WhatsApp / SMS Access" />} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}

export default App;
