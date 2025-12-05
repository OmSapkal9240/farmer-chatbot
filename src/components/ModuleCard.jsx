import React from "react";
import { motion } from "framer-motion";

export default function ModuleCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20, scale:0.97 }}
      whileInView={{ opacity:1, y:0, scale:1 }}
      viewport={{ once:true }}
      transition={{ duration:0.4 }}
      className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl backdrop-blur-xl hover:scale-[1.02] transition cursor-pointer"
    >
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-green-400 to-cyan-400 flex items-center justify-center text-black text-xl">
          {icon}
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-slate-400 mt-1">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}
