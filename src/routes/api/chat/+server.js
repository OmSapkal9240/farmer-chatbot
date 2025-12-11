import { OpenRouter } from "@openrouter/sdk";
import { OPENROUTER_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

const openrouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY
});

export async function POST({ request }) {
  try {
    const { messages } = await request.json();

    const response = await openrouter.chat.send({
      model: "openai/gpt-4.1-mini",
      messages,
      stream: false
    });

    return json(response);
  } catch (err) {
    console.error("OpenRouter Error:", err);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
