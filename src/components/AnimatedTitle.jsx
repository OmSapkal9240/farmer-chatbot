import React from "react";
import { Link } from "react-router-dom";

export default function AnimatedTitle({ name = "KisanPulse" }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <svg width="42" height="42" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="rgba(96,165,250,0.1)" strokeWidth="1.5" fill="none"/>
        <path d="M6 12c2-3 6-6 12-6" stroke="rgba(16,185,129,0.25)" strokeWidth="1.4" fill="none"/>
      </svg>
      <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-2xl md:text-3xl font-bold">
        <span className="gradient-text">{name.split(/(?=[A-Z])|[\s]/)[0]}</span>
        {name.split(/(?=[A-Z])|[\s]/)[1] ? (
          <span className="gradient-text ml-2">{name.split(/(?=[A-Z])|[\s]/)[1]}</span>
        ) : null}
      </h1>
    </Link>
  );
}
