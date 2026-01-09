import React from "react";

export default function OrbitBackground(){
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="orbit-circle bg-gradient-to-r from-teal-400 to-blue-500" style={{ top:"15%", left:"55%", width:"260px", height:"180px", animation:"orbitRotate 60s linear infinite" }} />
      <div className="orbit-circle bg-gradient-to-r from-yellow-300 to-emerald-300" style={{ top:"30%", left:"28%", width:"220px", height:"150px", animation:"orbitRotate 90s linear reverse infinite" }} />
      <div className="orbit-circle bg-gradient-to-r from-cyan-400 to-green-300" style={{ bottom:"12%", right:"20%", width:"300px", height:"200px", animation:"orbitRotate 70s linear infinite" }} />
    </div>
  );
}
