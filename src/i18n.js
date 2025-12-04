import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'projectTitle': 'AI Chatbot for Farmer Advisory',
      'modules': 'Modules',
      'heroSlogan': 'Helping Indian Farmers with Smart, Simple, Multilingual Advisory.',
      'getStarted': 'Get Started',
      'footerText': '© 2025 Farmer Advisory AI — Built for TechFiesta Hackathon',
    }
  },
  mr: {
    translation: {
      'projectTitle': 'शेतकरी सल्लागार एआय चॅटबॉट',
      'modules': 'मॉड्यूल्स',
      'heroSlogan': 'स्मार्ट, सोप्या, बहुभाषिक सल्ल्याने भारतीय शेतकऱ्यांना मदत करणे.',
      'getStarted': 'सुरुवात करा',
      'footerText': '© २०२५ शेतकरी सल्लागार एआय — टेकफिएस्टा हॅकाथॉनसाठी तयार केले आहे',
    }
  },
  hi: {
    translation: {
      'projectTitle': 'किसान सलाहकार एआई चैटबॉट',
      'modules': 'मॉड्यूल',
      'heroSlogan': 'स्मार्ट, सरल, बहुभाषी सलाह से भारतीय किसानों की मदद करना।',
      'getStarted': 'शुरू करें',
      'footerText': '© 2025 किसान सलाहकार एआई — टेकफिएस्टा हैकाथॉन के लिए बनाया गया',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
