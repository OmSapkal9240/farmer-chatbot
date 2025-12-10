// server/chat-proxy.js
import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

// try both imports depending on SDK version
import { OpenRouter } from "@openrouter/sdk";

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error("Missing OPENROUTER_API_KEY in env");
  process.exit(1);
}

const openrouter = new OpenRouter({ apiKey });

console.log("openrouter object keys:", Object.keys(openrouter || {}));

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], model = "openai/gpt-4.1-mini" } = req.body;

    // Use SDK's chat.send (or chat.create depending on SDK). Try send first:
    if (openrouter.chat?.send) {
      const resp = await openrouter.chat.send({ model, messages, stream: false });
      return res.json(resp);
    }
    // fallback if SDK uses create()
    if (openrouter.chat?.create) {
      const resp = await openrouter.chat.create({ model, messages });
      return res.json(resp);
    }
    throw new Error("openrouter.chat has no send()/create() — check SDK version");
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message, stack: err.stack?.split("\n").slice(0,5) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Chat proxy running on http://localhost:${port}`));
