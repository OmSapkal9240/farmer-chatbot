import React, { useEffect, useState } from "react";
import { autoTranslate } from "../utils/autoTranslate";

export default function TranslateButton({ originalText, lang = "hi", cacheKey, children }) {
  const [loading, setLoading] = useState(false);
  const [translated, setTranslated] = useState(null);
  const [error, setError] = useState(null);
  const [showTranslated, setShowTranslated] = useState(false);

  const storageKey = cacheKey ? `trans_cache_${cacheKey}` : null;

  const loadFromCache = () => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed[lang] || null;
    } catch {
      return null;
    }
  };

  const saveToCache = (txt) => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[lang] = txt;
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    } catch {}
  };

  const handleTranslate = async () => {
    setError(null);

    if (showTranslated) {
      setShowTranslated(false);
      return;
    }

    const cached = loadFromCache();
    if (cached) {
      setTranslated(cached);
      setShowTranslated(true);
      return;
    }

    setLoading(true);
    try {
      const res = await autoTranslate(originalText, lang);
      setTranslated(res);
      saveToCache(res);
      setShowTranslated(true);
    } catch (err) {
      setError("Translation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = loadFromCache();
    if (cached) {
      setTranslated(cached);
    } else {
      setTranslated(null);
      setShowTranslated(false);
    }
    setError(null);
  }, [originalText, lang]);

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleTranslate}
          disabled={!originalText || loading}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Translating..." : showTranslated ? "Show Original" : (children || "Translate")}
        </button>

        <span className="text-xs text-gray-300 px-2">
          {lang === "hi" ? "हिन्दी" : lang === "mr" ? "मराठी" : "EN"}
        </span>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {showTranslated && translated && (
        <div className="mt-1 p-2 bg-white/5 rounded text-sm text-gray-100">
          {translated}
        </div>
      )}
    </div>
  );
}
