import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { getPestDiagnosis } from '../services/diagnosisService';
import { Loader, UploadCloud, X, Bug } from 'lucide-react';

// A component to format the diagnosis text
const DiagnosisSection = ({ title, content }) => (
  <div>
    <h3 className="font-bold text-lg text-green-400 mb-2">{title}</h3>
    {Array.isArray(content) ? (
      <ul className="list-disc list-inside space-y-1 text-gray-300">
        {content.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    ) : (
      <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
    )}
  </div>
);

const PestDiagnosisPage = () => {
  const { t, i18n } = useTranslation();
    const [file, setFile] = useState(null); // Store the file object
  const [imagePreview, setImagePreview] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null); // Will store the JSON object
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

    const onDrop = useCallback(acceptedFiles => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile) {
      setFile(droppedFile);
      setImagePreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false
  });

    const handleDiagnose = async () => {
    if (!file) {
      setError(t('pest.error.no_image'));
      return;
    }

    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const diagnosisData = await getPestDiagnosis(file);
      setDiagnosis(diagnosisData);
    } catch (err) {
      setError(err.message || t('pest.error.api_fail'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    const handleClear = () => {
    setFile(null);
    setImagePreview(null);
    setDiagnosis(null);
    setError(null);
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
                                  </div>

          <div className="flex justify-center">
            <button
              onClick={handleDiagnose}
              disabled={!file || loading}
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
                <div className="space-y-4">
                  <DiagnosisSection title="🌾 Crop Identified" content={diagnosis.crop} />
                  <DiagnosisSection title="🐛 Problem Detected" content={diagnosis.problem} />
                  <DiagnosisSection title="🔍 Visible Symptoms" content={diagnosis.symptoms} />
                  <DiagnosisSection title="❓ Why This Happened" content={diagnosis.cause} />
                  <DiagnosisSection title="⚠️ Severity Level" content={diagnosis.severity} />
                  <DiagnosisSection title="✅ Treatment Steps" content={diagnosis.treatment} />
                  <DiagnosisSection title="🧪 Recommended Solution Type" content={diagnosis.solutionType} />
                  <DiagnosisSection title="🌿 Organic / Low-Cost Option" content={diagnosis.organicOption} />
                  <DiagnosisSection title="🛡️ Prevention Tips" content={diagnosis.prevention} />
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
