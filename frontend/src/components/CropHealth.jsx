import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Mic, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function CropHealth({ farmer }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!farmer || !file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('farmerId', farmer.id);
    formData.append('farmId', 1); // Mocked farm ID for now
    formData.append('voiceNoteContext', 'Simulated voice note context');

    try {
      const res = await fetch('http://localhost:3001/api/crop-health', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!farmer) return <div className="p-4 text-center text-gray-500">Please select a farmer profile first.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100">
        <h2 className="text-lg font-bold text-blue-900 mb-4">{t('analyze')}</h2>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4 relative overflow-hidden"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
            capture="environment"
          />
          {preview ? (
            <img src={preview} alt="Crop Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 text-blue-500">
              <Upload className="w-8 h-8" />
              <span className="font-semibold">{t('upload_photo')}</span>
            </div>
          )}
        </div>

        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 mb-4">
          <Mic className="w-5 h-5 text-red-500" />
          {t('voice_note')} (Demo)
        </button>

        <button 
          onClick={handleAnalyze}
          disabled={!file || loading}
          className={`w-full font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm
            ${!file || loading ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('analyze')}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-blue-500 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">{t('diagnosis')}</h3>
            <p className="text-xl font-bold text-gray-900 mb-2">{result.diagnosis}</p>
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full mb-4">
              Confidence: {result.confidence}%
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="text-sm font-bold text-gray-700 mb-1">{t('home_remedy')}</h4>
              <p className="text-gray-800">{result.homeRemedy}</p>
            </div>
          </div>

          {result.escalation && (
            <div className="bg-red-50 p-5 rounded-2xl shadow-sm border border-red-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-24 h-24 text-red-900" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-red-800 font-bold mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  {t('rsk_ticket')}
                </div>
                <div className="text-sm text-red-900 mb-3">
                  This issue requires expert attention. It has been routed to your nearest Rythu Seva Kendra.
                </div>
                <div className="bg-white/60 p-3 rounded-xl border border-red-100">
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wide">Ticket ID</div>
                  <div className="font-mono font-bold text-gray-900 mb-2">{result.escalation.ticketId}</div>
                  
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wide">RSK Contact</div>
                  <div className="font-medium text-gray-900">{result.escalation.rskDetails.name}</div>
                  <div className="text-sm text-gray-700">{result.escalation.rskDetails.contact}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
