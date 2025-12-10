// src/lib/chatApi.js
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export async function askLLM(messages = [], model = "google/gemma-7b-it") {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY; // ensure VITE_ prefix
  if (!apiKey) throw new Error("Missing VITE_OPENROUTER_API_KEY");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model, messages })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter API error ${res.status}: ${text}`);
  }
  return res.json();
}
