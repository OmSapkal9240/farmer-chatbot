import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Loader, UploadCloud, X, Bug } from 'lucide-react';

// A component to format the diagnosis text
const FormattedDiagnosis = ({ text }) => {
  const { t } = useTranslation();
  if (!text) return null;

  const sections = [];
  try {
    // Use a regex to split the text by the numbered headings, keeping the delimiters
    const parts = text.split(/(\d+\.\s+\*\*[🌾🦠🔍❓✅🛡️📌].*?\*\*)/).filter(Boolean);

    // Check if the split resulted in pairs of title/content
    if (parts.length > 0 && parts[0].match(/^\d+\./)) {
        for (let i = 0; i < parts.length; i += 2) {
            if (parts[i] && parts[i+1]) {
                sections.push({
                    title: parts[i].trim(),
                    content: parts[i+1].trim(),
                });
            } else if (parts[i]) {
                // Handle case where content might be missing for the last title
                sections.push({ title: parts[i].trim(), content: '' });
            }
        }
    }
  } catch (e) {
    // If any parsing error occurs, we'll fall back to raw text rendering.
    console.error("Failed to parse diagnosis text:", e);
  }

  // If parsing fails or results in no sections, render the raw text safely.
  if (sections.length === 0) {
    return (
      <div>
        <h3 className="font-bold text-lg text-green-400 mb-2">{t('pest.diagnosis_result')}</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {sections.map(({ title, content }, index) => (
        <div key={`${title}-${index}`}>
          <h3 className="font-bold text-lg text-green-400 mb-2">{title}</h3>
          <div 
            className="text-gray-300 whitespace-pre-wrap" 
            dangerouslySetInnerHTML={{ __html: content.replace(/\*\*/g, '').replace(/\* /g, '• ').replace(/\n/g, '<br />') }} 
          />
        </div>
      ))}
    </div>
  );
};

const PestDiagnosisPage = () => {
  const { t, i18n } = useTranslation();
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
      setError(t('pest.error.no_image'));
      return;
    }

    setLoading(true);
    setError(null);
    setDiagnosis('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setError('Google AI API key is missing.');
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

      const systemPrompt = t('pest.system_prompt', { language: i18n.language });
      const userPrompt = t('pest.user_prompt', { cropInfo: cropInfo || t('not_provided') });

      const imageParts = [
        {
          inlineData: {
            data: image.split(",")[1],
            mimeType: image.match(/:(.*?);/)[1],
          },
        },
      ];

      const result = await model.generateContentStream([systemPrompt, userPrompt, ...imageParts]);

      let fullContent = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullContent += chunkText;
        setDiagnosis(fullContent);
      }

    } catch (err) {
      setError(t('pest.error.api_fail'));
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
        <h1 className="text-4xl font-bold text-green-400">{t('pest.title')}</h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{t('pest.subtitle')}</p>
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
                <p className="mt-2 text-sm text-gray-400">{t('pest.dropzone.text')}</p>
                <p className="text-xs text-gray-500">{t('pest.dropzone.subtext')}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="crop-info" className="block text-sm font-medium text-gray-300 mb-2">{t('pest.crop_info.label')}</label>
            <input type="text" id="crop-info" value={cropInfo} onChange={(e) => setCropInfo(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-green-500 focus:border-green-500" placeholder={t('pest.crop_info.placeholder')} />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleDiagnose}
              disabled={!image || loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <><Loader className="animate-spin -ml-1 mr-3 h-5 w-5" /> {t('pest.button.analyzing')}</> : <><Bug className="-ml-1 mr-2 h-5 w-5" /> {t('pest.button.diagnose')}</>}
            </button>
          </div>
        </div>

        {(loading || error || diagnosis) && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-4">{t('pest.status.title')}</h2>
            <div className="bg-slate-900/70 p-4 rounded-lg text-left min-h-[100px]">
              {loading && !diagnosis && <p className="text-yellow-400 flex items-center"><Loader className="animate-spin mr-2"/>{t('pest.status.analyzing')}</p>}
              {error && <p className="text-red-400 whitespace-pre-wrap"><b>{t('pest.status.error')}</b> {error}</p>}
              {diagnosis && (
                <div>
                  {!loading && <p className="text-green-400 font-bold mb-4">{t('pest.status.success')}</p>}
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
