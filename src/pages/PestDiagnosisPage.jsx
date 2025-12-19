import React, { useState } from 'react';
import { Loader, UploadCloud, X, Bug } from 'lucide-react';

// A component to format the diagnosis text
const FormattedDiagnosis = ({ text }) => {
  if (!text || !text.trim()) {
    return (
      <div>
        <h3 className="font-bold text-lg text-yellow-400 mb-2">Analysis Complete</h3>
        <p className="text-gray-300">The analysis did not return a specific diagnosis. This may be due to image quality or the AI's content safety filters. Please try a different image.</p>
      </div>
    );
  }

  // Simple parser to format the response
  const sections = text.split(/(Diagnosis:|Treatment Options:)/).filter(Boolean);
  const formatted = [];
  for (let i = 0; i < sections.length; i += 2) {
    const title = sections[i];
    const content = sections[i + 1];
    if (title && content) {
      formatted.push({ title: title.trim(), content: content.trim() });
    }
  }

  // Fallback for when parsing fails, to ensure a result is always displayed.
  if (formatted.length === 0) {
    return (
      <div>
        <h3 className="font-bold text-lg text-green-400 mb-2">Diagnosis Result</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {formatted.map(({ title, content }) => (
        <div key={title}>
          <h3 className="font-bold text-lg text-green-400 mb-2">{title}</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
        </div>
      ))}
    </div>
  );
};


const PestDiagnosisPage = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setDiagnosis('');
      setError('');
    }
  };

  const handleClear = () => {
    setImage(null);
    setImagePreview('');
    setDiagnosis('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setDiagnosis('');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3000/api/diagnose', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Server response: ${errorBody}`);
      }

      console.log('API response received:', response);
      const data = await response.json();
      console.log('Parsed JSON data:', data);

      if (data.error) {
        console.error('API returned an error:', data.error);
        throw new Error(data.error);
      }

      console.log('Setting diagnosis state with:', data.diagnosis);
      setDiagnosis(data.diagnosis);
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
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">Crop Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-500" />
                <div className="flex text-sm text-slate-400">
                  <label htmlFor="image-upload" className="relative cursor-pointer bg-slate-700 rounded-md font-medium text-green-400 hover:text-green-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-green-500 px-2">
                    <span>Upload a file</span>
                    <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="relative group">
              <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg max-h-80 mx-auto" />
              <button type="button" onClick={handleClear} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100">
                <X size={18} />
              </button>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!image || isLoading}
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
