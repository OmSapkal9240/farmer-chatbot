import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Cloud, Bug, Calendar, Award, MessageSquare } from 'lucide-react';

const modules = [
  { title: 'Crop Care', description: 'Get advice on crop management.', icon: <Leaf />, path: '/crop-care' },
  { title: 'Weather Insights', description: 'Check weather forecasts.', icon: <Cloud />, path: '/weather-insights' },
  { title: 'Pest / Disease Diagnosis', description: 'Identify and treat crop issues.', icon: <Bug />, path: '/pest-diagnosis' },
  { title: 'Seasonal Advice', description: 'Receive tips for the season.', icon: <Calendar />, path: '/seasonal-advice' },
  { title: 'Government Schemes', description: 'Find relevant govt. schemes.', icon: <Award />, path: '/govt-schemes' },
  { title: 'WhatsApp / SMS Access', description: 'Connect via messaging.', icon: <MessageSquare />, path: '/whatsapp-sms' },
];

const ModulesGrid = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <Link to={module.path} key={module.title}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 text-center flex flex-col items-center shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 h-full"
              >
                <div className="mb-4 text-blue-400">{React.cloneElement(module.icon, { size: 40 })}</div>
                <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{module.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulesGrid;
