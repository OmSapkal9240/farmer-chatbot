// src/lib/chatApi.js
export async function askLLM(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Proxy error ${res.status}: ${txt}`);
  }
  return res.json();
}

