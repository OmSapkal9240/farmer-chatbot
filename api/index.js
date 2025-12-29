import { OpenRouter } from '@openrouter/sdk';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const openrouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY,
  });

  try {
    const { messages } = req.body;

    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === '<PUT_OPENROUTER_API_KEY_HERE>') {
      console.log('[API] OpenRouter API key is missing or a placeholder. Instructing client to use demo mode.');
      return res.json({ demo_mode: true });
    }

    const response = await openrouter.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages,
    });

    res.status(200).json(response);
  } catch (err) {
    console.error('OpenRouter Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
