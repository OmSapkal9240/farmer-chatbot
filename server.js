import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenRouter } from '@openrouter/sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

process.on('uncaughtException', (error, origin) => {
  console.error('===== UNCAUGHT EXCEPTION =====');
  console.error('Origin:', origin);
  console.error('Error:', error);
  process.exit(1);
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const OPENROUTER_API_KEY = "<PUT_OPENROUTER_API_KEY_HERE>";
const openrouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
});
const upload = multer({ storage: multer.memoryStorage() });

async function fileToGenerativePart(file) {
  return {
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype,
    },
  };
}


app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (OPENROUTER_API_KEY === '<PUT_OPENROUTER_API_KEY_HERE>') {
      console.log('[SERVER] OpenRouter API key is a placeholder. Instructing client to use demo mode.');
      return res.json({ demo_mode: true });
    }

    const response = await openrouter.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages,
    });
    res.json(response);
  } catch (err) {
    console.error('OpenRouter Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('===== GLOBAL ERROR HANDLER =====');
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
