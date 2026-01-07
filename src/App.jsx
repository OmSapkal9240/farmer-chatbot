import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticlesBackground from './components/ParticlesBackground';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const WhatsAppSMSPage = lazy(() => import('./pages/ModulePage'));
const CropCarePage = lazy(() => import('./components/CropCarePage'));
const PestDiagnosisPage = lazy(() => import('./pages/PestDiagnosisPage'));
const SeasonalAdvicePage = lazy(() => import('./pages/SeasonalAdvicePage'));
const GovtSchemesPage = lazy(() => import('./pages/GovtSchemesPage'));
const ChatThread = lazy(() => import('./pages/ChatThread'));
const WeatherInsights = lazy(() => import('./pages/WeatherInsights'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const AiMitraChat = lazy(() => import('./pages/AiMitraChat'));
const DemoOne = lazy(() => import('./pages/DemoOne'));

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat/');

  return (
          <div className="min-h-screen font-sans text-slate-200">
        {/* <ParticlesBackground /> */}
        {!isChatPage && <Navbar />}
        <main className="relative z-0">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<ChatThread />} />
              <Route path="/crop-care" element={<CropCarePage />} />
              <Route path="/weather" element={<WeatherInsights />} />
              <Route path="/pest-diagnosis" element={<PestDiagnosisPage />} />
              <Route path="/seasonal-advice" element={<SeasonalAdvicePage />} />
              <Route path="/govt-schemes" element={<GovtSchemesPage />} />
              <Route path="/whatsapp-sms" element={<WhatsAppSMSPage title={t('whatsapp_sms_access')} />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/ai-mitra/:chatId" element={<AiMitraChat />} />
              <Route path="/demo" element={<DemoOne />} />
            </Routes>
          </Suspense>
        </main>
        {!isChatPage && <Footer />}
</div>
      );
}

export default App;
