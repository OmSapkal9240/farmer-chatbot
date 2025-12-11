export async function askLLM(messages) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      // Handle non-JSON responses gracefully
      const errorText = await response.text();
      console.error('API request failed with status:', response.status, 'and message:', errorText);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}


