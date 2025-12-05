import React from "react";
import { motion } from "framer-motion";

export default function ModuleCard({ icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay * 0.1, ease: 'easeOut' }}
      className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl shadow-glow-green-blue hover:shadow-glow-green-blue-hover hover:scale-[1.03] hover:-translate-y-1 transition-all duration-250 ease-out"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald to-cyan flex items-center justify-center text-black text-3xl shadow-icon-glow animate-breathing mb-4">
          {icon}
        </div>
        <div>
          <div className="font-bold text-lg tracking-wider gradient-text" style={{ fontFamily: "'Orbitron', sans-serif" }}>{title}</div>
          <div className="text-sm text-slate-400 mt-2">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}
