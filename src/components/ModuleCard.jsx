import React from "react";
import { motion } from "framer-motion";

export default function ModuleCard({ icon, title, desc, delay = 0, iconOnly = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay * 0.1, ease: 'easeOut' }}
      className="p-6 rounded-3xl transition-all duration-300 ease-out module-card"
    >
            {iconOnly ? (
        <div className="relative group flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-cyan-300 text-4xl group-hover:bg-slate-600 group-hover:scale-110 transition-all duration-300 cursor-pointer">
            {icon}
          </div>
          <div className="absolute -bottom-10 w-max bg-slate-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {title}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-cyan-300 text-3xl mb-4 group-hover:bg-slate-600 transition-colors">
            {icon}
          </div>
          <div>
            <div className="font-bold text-lg tracking-wider gradient-text" style={{ fontFamily: "'Orbitron', sans-serif" }}>{title}</div>
            <div className="text-sm text-slate-400 mt-2">{desc}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
