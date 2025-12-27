import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { OpenRouter } from "@openrouter/sdk";
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
          <div className="text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/\*\*/g, '').replace(/\* /g, '• ').replace(/\n/g, '<br />') }} />
        </div>
      ))}
    </div>
  );
};

const PestDiagnosisPage = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropInfo, setCropInfo] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64 string
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false
  });

  const handleDiagnose = async () => {
    if (!image) {
      setError('Please upload an image of the crop first.');
      return;
    }

    setLoading(true);
    setError(null);
    setDiagnosis('');

    try {
      const openrouter = new OpenRouter({
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY_PEST,
        baseURL: 'https://openrouter.ai/api/v1'
      });

      const stream = await openrouter.chat.send({
        model: "openai/gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a specialized AI assistant for farmers. Your task is to analyze an image of a crop and provide a detailed pest or disease diagnosis. Structure your response clearly for a farmer, using the following mandatory sections in markdown format:\n\n1.  **🌾 Crop Identification**\n2.  **🦠 Pest / Disease Diagnosis**\n3.  **🔍 Visual Symptoms**\n4.  **❓ Cause Analysis**\n5.  **✅ Treatment Plan** (with subsections for A) Organic/Natural and B) Chemical)\n6.  **🛡️ Prevention Tips**\n7.  **📌 Final Farmer Advice**\n\nUse a farmer-friendly tone, avoid excessive jargon, and make the advice simple and actionable.`
            },
            {
                role: "user",
                content: `Please diagnose the crop in this image: ${image}. Additional info from user: ${cropInfo || 'Not provided'}`
            }
        ],
        stream: true
      });

      let fullContent = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullContent += content;
          setDiagnosis(fullContent);
        }
      }

    } catch (err) {
      setError('Failed to get diagnosis. Please check your API key and network connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setImagePreview(null);
    setCropInfo('');
    setDiagnosis('');
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] container mx-auto p-4 md:p-6 text-white">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-400">Pest & Disease Diagnosis</h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Upload an image of the affected crop to get an instant AI-powered diagnosis and treatment recommendation.</p>
      </header>

      <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700">
        <div className="space-y-6">
          <div {...getRootProps()} className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-green-500 bg-slate-700/50' : 'border-slate-600 hover:border-green-600 bg-slate-800/50'}`}>
            <input {...getInputProps()} />
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Crop preview" className="max-h-full max-w-full object-contain rounded-lg" />
                <button onClick={(e) => { e.stopPropagation(); handleClear(); }} className="absolute top-2 right-2 p-1.5 bg-slate-900/80 rounded-full text-white hover:bg-red-600 transition-colors">
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-400">Drag & drop an image, or click to select</p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="crop-info" className="block text-sm font-medium text-gray-300 mb-2">Optional: Crop Name / Location</label>
            <input type="text" id="crop-info" value={cropInfo} onChange={(e) => setCropInfo(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-green-500 focus:border-green-500" placeholder="e.g., Tomato plant in my backyard" />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleDiagnose}
              disabled={!image || loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <><Loader className="animate-spin -ml-1 mr-3 h-5 w-5" /> Analyzing...</> : <><Bug className="-ml-1 mr-2 h-5 w-5" /> Diagnose Crop</>}
            </button>
          </div>
        </div>

        {(loading || error || diagnosis) && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-4">Analysis Status</h2>
            <div className="bg-slate-900/70 p-4 rounded-lg text-left min-h-[100px]">
              {loading && !diagnosis && <p className="text-yellow-400 flex items-center"><Loader className="animate-spin mr-2"/>Analyzing image, please wait...</p>}
              {error && <p className="text-red-400 whitespace-pre-wrap"><b>Error:</b> {error}</p>}
              {diagnosis && (
                <div>
                  {!loading && <p className="text-green-400 font-bold mb-4">Success! Diagnosis complete.</p>}
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
