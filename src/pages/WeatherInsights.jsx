import React, { useEffect, useState } from "react";
import { getCoordsByPlace, getThreeDayForecastByCoords } from "../lib/weatherApi";
import WeatherCard from "../components/WeatherCard";

function shortTipForDay(min, max, pop) {
  // simple rules for card tips
  if (max > 35) return "High heat—irrigate morning/evening";
  if (pop > 0.4) return "Rain expected—postpone spraying";
  return "Normal — monitor crop";
}

export default function WeatherInsights() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null); // { name, current, daily }
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentWeather")||"[]");
    } catch { return []; }
  });
  const [mockMode, setMockMode] = useState(false);

  useEffect(() => {
    // optional: load demo at start
  }, []);

  async function loadByQuery(q) {
    setError(null);
    setLoading(true);
    try {
      const geo = await getCoordsByPlace(q);
      if (geo.error) {
        setError(geo.message || "Location not found");
        setLoading(false);
        return;
      }
      const forecast = await getThreeDayForecastByCoords(geo.lat, geo.lon, geo.name);
      if (forecast.error && forecast.mock) {
        setMockMode(true);
        setPayload(forecast);
      } else {
        setMockMode(false);
        setPayload({ name: geo.name, ...forecast });
      }
      // save recent
      const r = [ { q: geo.name, lat: geo.lat, lon: geo.lon }, ...recent.filter(r=>r.q!==geo.name) ].slice(0,5);
      setRecent(r);
      localStorage.setItem("recentWeather", JSON.stringify(r));
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function useMyLocation() {
    setError(null);
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const forecast = await getThreeDayForecastByCoords(lat, lon, null);
        if (forecast.error && forecast.mock) {
          setMockMode(true);
          setPayload(forecast);
        } else {
          setMockMode(false);
          setPayload({ name: forecast.name || `${lat.toFixed(2)},${lon.toFixed(2)}`, ...forecast });
        }
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      setError("Location permission denied or unavailable");
      setLoading(false);
    });
  }

  function handleRecentClick(item) {
    setQuery(item.q);
    loadByQuery(item.q);
  }

  function renderAdvice(current, daily) {
    if (!current && !daily) return null;
    const adv = [];
    const temp = current?.temp ?? daily?.[0]?.max;
    const humidity = current?.humidity ?? null;
    const wind = current?.wind_kmh ?? null;
    if (temp > 35) adv.push("High heat: irrigate in morning/evening; avoid midday spraying.");
    if (humidity && humidity > 80) adv.push("High humidity: avoid spraying; fungal risk.");
    if (wind && wind > 8) adv.push("High wind: delay spraying.");
    if (daily && daily[0] && daily[0].pop > 0.4) adv.push("Rain likely: postpone fertiliser & spraying.");
    return adv;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-extrabold" style={{fontFamily:"'Orbitron', sans-serif"}}>Weather Insights</h2>

      <div className="mt-6 flex gap-3 items-center">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Enter city or PIN code" className="flex-grow px-4 py-3 rounded-full bg-[#0b1220] border border-slate-700" />
        <button onClick={()=>loadByQuery(query)} className="px-4 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 font-semibold">Search</button>
        <button onClick={useMyLocation} className="px-4 py-3 rounded-full bg-slate-700">Use My Location</button>
      </div>

      <div className="mt-4 flex gap-4">
        <div>
          <div className="text-sm text-slate-400">Recent</div>
          <div className="flex gap-2 mt-2">
            {recent.length===0 && <div className="text-slate-500">No recent</div>}
            {recent.map((r,i)=>(<button key={i} onClick={()=>handleRecentClick(r)} className="px-3 py-1 rounded-full bg-slate-800/50 text-sm">{r.q}</button>))}
          </div>
        </div>
        <div className="ml-auto">
          <button onClick={()=>{ setMockMode(!mockMode); if(mockMode) setPayload(null); }} className="text-sm px-3 py-1 rounded-full bg-slate-800/40">{mockMode ? "Demo ON" : "Toggle Demo"}</button>
        </div>
      </div>

      {loading && <div className="mt-8 text-slate-400">Loading…</div>}
      {error && <div className="mt-6 text-red-400">{error}</div>}

      {payload && (
        <section className="mt-8 grid gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Location</div>
                <div className="text-xl font-bold">{payload.name}</div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-extrabold">{payload.current ? Math.round(payload.current.temp) : Math.round(payload.daily[0].max)}°</div>
                <div className="text-sm text-slate-400">{payload.current?.weather ?? "—"}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto">
            {(payload.daily || []).slice(0,3).map((d,i)=>(<WeatherCard key={i} date={d.date} min={d.min} max={d.max} pop={d.pop} tip={shortTipForDay(d.min,d.max,d.pop)} />))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="font-semibold">Farming Advice</div>
            <ul className="list-disc list-inside mt-2 text-slate-300">
              {renderAdvice(payload.current, payload.daily)?.length ? renderAdvice(payload.current, payload.daily).map((a,i)=>(<li key={i}>{a}</li>)) : <li>All good — monitor conditions.</li>}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
