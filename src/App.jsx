import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrbitBackground from './components/OrbitBackground';

const Home = lazy(() => import('./pages/Home'));
const ModulePage = lazy(() => import('./pages/ModulePage'));
const CropCarePage = lazy(() => import('./components/CropCarePage'));
const PestDiagnosisPage = lazy(() => import('./pages/PestDiagnosisPage'));
const SeasonalAdvicePage = lazy(() => import('./pages/SeasonalAdvicePage'));
const GovtSchemesPage = lazy(() => import('./pages/GovtSchemesPage'));
const ChatThread = lazy(() => import('./pages/ChatThread'));
const WeatherInsights = lazy(() => import('./pages/WeatherInsights'));
const JobsPage = lazy(() => import('./pages/JobsPage'));

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat/');

  return (
          <div className="min-h-screen bg-gradient-to-b from-[#0a0f1f] to-[#10172d] font-sans text-slate-200">
        {!isChatPage && <OrbitBackground />}
        {!isChatPage && <Navbar />}
        <main className={`${isChatPage ? '' : 'relative z-10'}`}>
          <Suspense fallback={<div className="flex justify-center items-center h-screen">{t('loading')}</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<ChatThread />} />
              <Route path="/crop-care" element={<CropCarePage />} />
              <Route path="/weather" element={<WeatherInsights />} />
              <Route path="/pest-diagnosis" element={<PestDiagnosisPage />} />
              <Route path="/seasonal-advice" element={<SeasonalAdvicePage />} />
              <Route path="/govt-schemes" element={<GovtSchemesPage />} />
              <Route path="/whatsapp-sms" element={<ModulePage title={t('whatsapp_sms_access')} />} />
              <Route path="/jobs" element={<JobsPage />} />
            </Routes>
          </Suspense>
        </main>
        {!isChatPage && <Footer />}
      </div>
      );
}

export default App;
