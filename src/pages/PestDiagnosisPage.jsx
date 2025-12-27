import React, { useState } from 'react';
import { Loader, UploadCloud, X, Bug } from 'lucide-react';

// A component to format the diagnosis text
const FormattedDiagnosis = ({ text }) => {
  if (!text) return null;

  // Use a regex to split the text by the numbered headings, keeping the delimiters
    const sections = text.split(/(\d+\.\s+\*\*[🌾🦠🔍❓✅🛡️📌].*?\*\*)/).filter(Boolean);

  const formattedSections = [];
  for (let i = 0; i < sections.length; i += 2) {
    if (sections[i] && sections[i+1]) {
      formattedSections.push({
        title: sections[i].trim(),
        content: sections[i+1].trim(),
      });
    }
  }

  if (formattedSections.length === 0) {
    // Fallback for unstructured responses
    return (
      <div>
        <h3 className="font-bold text-lg text-green-400 mb-2">Diagnosis Result</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {formattedSections.map(({ title, content }) => (
        <div key={title}>
          <h3 className="font-bold text-lg text-green-400 mb-2">{title}</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{content.replace(/\*\*/g, '').replace(/\*/g, '•')}</p>
        </div>
      ))}
    </div>
  );
};

const PestDiagnosisPage = () => {
  const GROQ_API_KEY = "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";

  const [cropName, setCropName] = useState('');
  const [problem, setProblem] = useState('');
  const [location, setLocation] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  
    const handleClear = () => {
    setCropName('');
    setProblem('');
    setLocation('');
        setDiagnosis('');
    setError('');
  };

      const handleSubmit = async (e) => {
    e.preventDefault();
        if (!problem || !cropName) {
      setError('Please provide a crop name and a problem description.');
      return;
    }

    setIsLoading(true);
    setError('');
    setDiagnosis('');

    try {
      
      
            const systemPrompt = `You are an expert agricultural assistant specializing in Indian farming conditions. Based *only* on the user's text description, your goal is to provide a comprehensive and easy-to-understand diagnosis for a farmer. Follow this structure exactly, using markdown for formatting:

1.  **🌾 Crop Identified**:
    -   **Crop:** [Crop Name]
    -   **Growth Stage:** [e.g., Seedling, Vegetative, Flowering, Fruiting - if discernible from description]

2.  **🦠 Disease / Pest Identified**:
    -   **Name:** [Common Name]
    -   **Type:** [Fungal / Bacterial / Viral / Insect / Nutrient Deficiency]

3.  **🔍 Symptoms**:
    -   **Visible Signs:** [Describe the symptoms based on the user's text]
    -   **How to Recognize:** [Simple field identification tips for the farmer]

4.  **❓ Cause**:
    -   **Primary Reason:** [Explain the main cause, e.g., high humidity, specific pest lifecycle]
    -   **Contributing Conditions:** [Weather, soil, or farming practices that help it spread]

5.  **✅ Treatment & Solution**:
    -   **A) Organic / Natural Control:**
        -   **Method:** [e.g., Neem oil spray, introducing beneficial insects]
        -   **Dosage & Frequency:** [e.g., Mix 5ml per liter of water, spray every 7 days]
    -   **B) Chemical Control:**
        -   **Recommended Product:** [Suggest a common, effective pesticide/fungicide, e.g., Mancozeb, Imidacloprid]
        -   **Safety Precautions:** [Crucial safety advice: wear gloves, mask, and follow label instructions]

6.  **🛡️ Prevention Tips**:
    -   [List 2-3 actionable tips like crop rotation, proper spacing, field hygiene, or monitoring]

7.  **📌 Final Farmer Advice**:
    -   [Provide a clear, simple summary and actionable next steps for the farmer.]

If the description is unclear, state that and ask for more information, but provide a potential diagnosis based on the available information. Do not mention images.`;

      const userMessages = [
        {
          type: 'text',
          text: `Crop: ${cropName}. Location: ${location || 'Not provided'}. Problem: ${problem}`,
        },
      ];

      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessages },
          ],
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content;
      setDiagnosis(text);

    } catch (err) {
      console.error('Diagnosis error:', err);
      setError(`Failed to get diagnosis. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] container mx-auto p-4 md:p-6 text-white">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-400">Pest & Disease Diagnosis</h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Upload an image of the affected crop to get an instant AI-powered diagnosis and treatment recommendation.</p>
      </header>

            <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="crop-name" className="block text-sm font-medium text-gray-300 mb-2">Crop Name</label>
              <input type="text" id="crop-name" value={cropName} onChange={(e) => setCropName(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-green-500 focus:border-green-500" placeholder="e.g., Tomato, Cotton" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">Location (Optional)</label>
              <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-green-500 focus:border-green-500" placeholder="e.g., Nashik, Maharashtra" />
            </div>
          </div>

                    <div>
            <label htmlFor="problem-description" className="block text-sm font-medium text-gray-300 mb-2">Problem Description</label>
            <textarea id="problem-description" value={problem} onChange={(e) => setProblem(e.target.value)} rows="4" className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-green-500 focus:border-green-500" placeholder="Describe the issue in detail, e.g., 'The tomato leaves have yellow spots with brown centers, and the lower leaves are wilting.'" required></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!problem || !cropName || isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <><Loader className="animate-spin -ml-1 mr-3 h-5 w-5" /> Analyzing...</> : <><Bug className="-ml-1 mr-2 h-5 w-5" /> Diagnose Pest</>}
            </button>
          </div>
        </form>

        {(isLoading || error || diagnosis) && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-4">Analysis Status</h2>
            <div className="bg-slate-900/70 p-4 rounded-lg text-left">
              {isLoading && <p className="text-yellow-400">Analyzing image, please wait...</p>}
              {error && <p className="text-red-400 whitespace-pre-wrap"><b>Error:</b> {error}</p>}
              {diagnosis && (
                <div>
                  <p className="text-green-400 font-bold mb-4">Success! Diagnosis complete.</p>
                  <FormattedDiagnosis text={diagnosis} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PestDiagnosisPage;
