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
      'home.title': 'Your AI Farming Assistant',
      'home.subtitle': 'Get instant, reliable advice on crops, weather, and more. Start a conversation to get the help you need.',
      'home.cta': 'Start a New Chat',
    }
  },
  mr: {
    translation: {
      'projectTitle': 'शेतकरी सल्लागार एआय चॅटबॉट',
      'modules': 'मॉड्यूल्स',
      'heroSlogan': 'स्मार्ट, सोप्या, बहुभाषिक सल्ल्याने भारतीय शेतकऱ्यांना मदत करणे.',
      'getStarted': 'सुरुवात करा',
      'footerText': '© २०२५ शेतकरी सल्लागार एआय — टेकफिएस्टा हॅकाथॉनसाठी तयार केले आहे',
      'home.title': 'तुमचा एआय शेती सहाय्यक',
      'home.subtitle': 'पिके, हवामान आणि बरेच काही यावर त्वरित, विश्वसनीय सल्ला मिळवा. मदत मिळवण्यासाठी संभाषण सुरू करा.',
      'home.cta': 'नवीन चॅट सुरू करा',
    }
  },
  hi: {
    translation: {
      'projectTitle': 'किसान सलाहकार एआई चैटबॉट',
      'modules': 'मॉड्यूल',
      'heroSlogan': 'स्मार्ट, सरल, बहुभाषी सलाह से भारतीय किसानों की मदद करना।',
      'getStarted': 'शुरू करें',
      'footerText': '© 2025 किसान सलाहकार एआई — टेकफिएस्टा हैकाथॉन के लिए बनाया गया',
      'home.title': 'आपका एआई खेती सहायक',
      'home.subtitle': 'फसलों, मौसम, और बहुत कुछ पर तुरंत, विश्वसनीय सलाह प्राप्त करें। सहायता पाने के लिए बातचीत शुरू करें।',
      'home.cta': 'एक नई चैट शुरू करें',
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
