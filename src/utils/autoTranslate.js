export async function autoTranslate(text, targetLang = "hi") {
  if (!text || typeof text !== "string") return text;
  try {
    const resp = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang,
        format: "text"
      })
    });

    if (!resp.ok) {
      console.warn("LibreTranslate bad response:", resp.status);
      return text;
    }

    const data = await resp.json();
    return data.translatedText || data.result || text;
  } catch (err) {
    console.warn("autoTranslate error:", err);
    return text;
  }
}
