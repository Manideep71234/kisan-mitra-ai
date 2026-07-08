import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BellRing, CloudLightning, SunDim, Smartphone, Volume2, VolumeX } from 'lucide-react';

export default function AdvisoryAlerts({ farmer }) {
  const { t, i18n } = useTranslation();
  const [advisories, setAdvisories] = useState([]);
  const [smsLogs, setSmsLogs] = useState([]);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  const fetchAdvisories = async () => {
    if (!farmer) return;
    try {
      const res = await fetch(`http://localhost:3001/api/advisories/${farmer.id}`);
      const data = await res.json();
      setAdvisories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, [farmer]);

  const triggerAlert = async (type) => {
    if (!farmer) return;
    try {
      await fetch('http://localhost:3001/api/trigger-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId: farmer.id, type })
      });
      fetchAdvisories();
      
      // Simulate SMS
      const msg = type === 'DRY_SPELL' 
        ? 'Alert: No rainfall predicted for 7 days. Arrange light irrigation.' 
        : 'Alert: Heavy rainfall predicted. Delay fertilization.';
      
      await fetch('http://localhost:3001/api/sms-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: farmer.phone, message: msg })
      });

      setSmsLogs(prev => [{ phone: farmer.phone, message: msg, time: new Date().toLocaleTimeString() }, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeak = (text, idx) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (speakingIdx === idx) {
      setSpeakingIdx(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
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
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
        <h2 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
          <BellRing className="w-5 h-5 text-orange-600" />
          {t('alerts')}
        </h2>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => triggerAlert('DRY_SPELL')}
            className="w-full bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-orange-200"
          >
            <SunDim className="w-5 h-5" />
            {t('trigger_dry_spell')}
          </button>
          
          <button 
            onClick={() => triggerAlert('HEAVY_RAIN')}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-blue-200"
          >
            <CloudLightning className="w-5 h-5" />
            {t('trigger_heavy_rain')}
          </button>
        </div>
      </div>

      {smsLogs.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            {t('sms_simulation')}
          </h3>
          <div className="space-y-2">
            {smsLogs.map((log, idx) => (
              <div key={idx} className="bg-gray-800 p-3 rounded-lg">
                <div className="text-green-400 text-xs font-mono mb-1">To: {log.phone} at {log.time}</div>
                <div className="text-white text-sm">{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {advisories.map((adv, idx) => (
          <div key={adv.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-orange-500 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">
                {adv.type.replace('_', ' ')}
              </span>
              <span className="text-gray-400 text-xs">{new Date(adv.date).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-800 text-sm mb-4 leading-relaxed font-medium">{adv.message}</p>
            
            <button 
              onClick={() => handleSpeak(adv.message, idx)}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${speakingIdx === idx ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {speakingIdx === idx ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              {speakingIdx === idx ? t('stop') : t('listen')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
