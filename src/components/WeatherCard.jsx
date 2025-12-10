import React from "react";
import { motion } from "framer-motion";

/**
 Props:
  - date (YYYY-MM-DD)
  - min
  - max
  - pop (0..1)
  - tip (string)
*/
export default function WeatherCard({ date, min, max, pop, tip }) {
  const d = new Date(date);
  const day = d.toLocaleDateString(undefined, { weekday: "short" }); // Mon, Tue
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-md min-w-[160px]">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{day}</div>
        <div className="text-sm text-slate-400">{Math.round(pop*100)}%</div>
      </div>
      <div className="mt-3 text-lg font-bold">{Math.round(max)}° / <span className="text-sm font-medium">{Math.round(min)}°</span></div>
      <div className="text-xs text-slate-300 mt-2">{tip}</div>
    </motion.div>
  );
}
