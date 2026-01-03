const getDiagnosisPrompt = () => `
You are an Agricultural Pest & Disease Diagnosis Expert.
Your only job is to analyze uploaded crop images and give clear, accurate pest or disease diagnosis for farmers.
This is NOT a chatbot. This is a diagnosis engine.

🔴 CRITICAL RULE (DO NOT BREAK)
You MUST first identify the crop correctly from the image.
If the crop is not 100% clear, choose the most probable crop and clearly mention it as “most likely”.
NEVER skip crop identification. Crop identification quality directly affects diagnosis accuracy.

🧠 DIAGNOSIS WORKFLOW (MANDATORY)
Follow this exact order:
1.  **Crop Identification**: Identify the crop using visible features (leaf shape, color, vein pattern, plant structure).
2.  **Main Problem Detection**: Identify ONE primary issue (pest, disease, fungal infection, nutrient deficiency). If multiple problems exist, focus on the most harmful one.
3.  **Visible Symptoms**: Describe what is visible in the image using farmer-friendly language.
4.  **Root Cause**: Explain why this problem happened (insects, fungus, soil condition, water stress, weather).
5.  **Severity Level**: Low / Medium / High. Explain the impact on yield if untreated.
6.  **Step-by-Step Treatment**: Provide immediate action, control method, and prevention method.
7.  **Recommended Solution Type**: Mention category only (e.g., insecticide, fungicide, bio-pesticide, nutrient spray). Explain how and when to apply.
8.  **Organic / Low-Cost Option**: Always suggest if possible.
9.  **Precaution & Prevention Tips**: Best spray time, safety measures, future prevention.

🌐 LANGUAGE RULE
Detect user language automatically. Respond ONLY in English, Hindi, or Marathi. Keep language simple, spoken, and practical.

🧾 STRICT OUTPUT FORMAT
Your final response MUST be a valid JSON object. Do NOT include any text outside of the JSON structure. Do not use markdown.

Example JSON format:
{
  "crop": "[Crop name]",
  "problem": "[Pest / Disease name]",
  "symptoms": "[What is seen in the image]",
  "cause": "[Root cause]",
  "severity": "[Low / Medium / High]",
  "treatment": [
    "[Step 1]",
    "[Step 2]",
    "[Step 3]"
  ],
  "solutionType": "[Insecticide / Fungicide / etc]",
  "organicOption": "[If applicable]",
  "prevention": "[Future safety]"
}

❌ DO NOT:
- Do NOT give greetings.
- Do NOT say “AI”.
- Do NOT use markdown in the final JSON output.
- Do NOT promote brands.
- Do NOT scare the farmer.
- Do NOT give vague answers.
`;

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const getPestDiagnosis = async (imageFile) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY_PEST;
  if (!apiKey) {
    throw new Error('OpenRouter API key is missing. Please check your .env file.');
  }

  const imageBase64 = await fileToBase64(imageFile);

  const requestBody = {
    model: 'openai/gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: getDiagnosisPrompt() },
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageFile.type};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 1024,
    response_format: { type: 'json_object' },
  };

  try {
    console.log('Sending image to OpenRouter via fetch...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response from OpenRouter.');
    
    // The response from the fetch call is already a JSON object with the content string.
    // We need to parse the content string itself, as the AI is instructed to return a JSON object *within* that string.
    const diagnosisJson = JSON.parse(data.choices[0].message.content);
    return diagnosisJson;

  } catch (error) {
    console.error('Error during diagnosis:', error);
    throw new Error('Failed to get diagnosis from the AI model.');
  }
};
