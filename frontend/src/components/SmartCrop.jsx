import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, Loader2, CheckCircle } from 'lucide-react';

export default function SmartCrop({ farmer }) {
  const { t, i18n } = useTranslation();
  const [season, setSeason] = useState('Kharif');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  const handleRecommend = async () => {
    if (!farmer) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: farmer.id,
          sizeInAcres: farmer.sizeInAcres || 2, // fallback
          season,
          irrigationSource: farmer.irrigationSource,
          district: farmer.district
        })
      });
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSpeak = (text, idx) => {
    if (!window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    if (speakingIdx === idx) {
      setSpeakingIdx(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to match language
    const langMap = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
    utterance.lang = langMap[i18n.language] || 'en-IN';
    
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  if (!farmer) return <div className="p-4 text-center text-gray-500">Please select a farmer profile first.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
        <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          {t('farm_details')}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="bg-green-50 p-3 rounded-xl border border-green-100">
            <span className="block text-green-700 font-semibold mb-1">{t('size_acres')}</span>
            <span className="text-gray-900 font-medium text-lg">{farmer.sizeInAcres} Ac</span>
          </div>
          <div className="bg-green-50 p-3 rounded-xl border border-green-100">
            <span className="block text-green-700 font-semibold mb-1">{t('irrigation')}</span>
            <span className="text-gray-900 font-medium text-lg">{farmer.irrigationSource}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-green-800 mb-2">{t('season')}</label>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {['Kharif', 'Rabi', 'Zaid'].map(s => (
              <button 
                key={s}
                onClick={() => setSeason(s)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${season === s ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleRecommend}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('get_recommendation')}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-green-500 border border-gray-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{rec.crop}</h3>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                  {rec.score}% Match
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{rec.reason}</p>
              
              <div className="flex gap-2 text-xs font-medium text-gray-500 mb-4">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">Water: {rec.water}</span>
                <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md">{rec.costYield}</span>
              </div>

              <button 
                onClick={() => handleSpeak(`${rec.crop}. ${rec.reason}`, idx)}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${speakingIdx === idx ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {speakingIdx === idx ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                {speakingIdx === idx ? t('stop') : t('listen')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
