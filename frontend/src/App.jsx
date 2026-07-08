import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Bell, Camera, Globe, CheckCircle2 } from 'lucide-react';
import './i18n';
import SmartCrop from './components/SmartCrop';
import AdvisoryAlerts from './components/AdvisoryAlerts';
import CropHealth from './components/CropHealth';

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/farmers')
      .then(res => res.json())
      .then(data => {
        setFarmers(data);
        if (data.length > 0) setSelectedFarmer(data[0]);
      })
      .catch(err => console.error(err));
  }, []);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
    // Auto-update farmer's selected language in demo if needed, but for now just UI
  };

  return (
    <div className="min-h-screen bg-green-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8" />
          <h1 className="text-xl font-bold">{t('app_name')}</h1>
        </div>
        <div className="flex items-center gap-2 bg-green-800 p-1 rounded-lg">
          <Globe className="w-5 h-5 text-green-200" />
          <select 
            className="bg-transparent text-white font-medium outline-none"
            value={i18n.language}
            onChange={handleLanguageChange}
          >
            <option value="en" className="text-black">English</option>
            <option value="hi" className="text-black">हिंदी</option>
            <option value="te" className="text-black">తెలుగు</option>
          </select>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Farmer Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 mb-6">
          <label className="block text-sm font-semibold text-green-800 mb-2">{t('select_farmer')}</label>
          <select 
            className="w-full p-3 border border-green-300 rounded-lg bg-green-50 text-gray-800 font-medium"
            value={selectedFarmer ? selectedFarmer.id : ''}
            onChange={(e) => setSelectedFarmer(farmers.find(f => f.id === parseInt(e.target.value)))}
          >
            {farmers.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.village}, {f.district}) - Soil: {f.soilType}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Content */}
        <div className="mb-20">
          {activeTab === 'recommendations' && <SmartCrop farmer={selectedFarmer} />}
          {activeTab === 'advisories' && <AdvisoryAlerts farmer={selectedFarmer} />}
          {activeTab === 'crop_health' && <CropHealth farmer={selectedFarmer} />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-safe z-20">
        <button 
          onClick={() => setActiveTab('recommendations')}
          className={`flex flex-col items-center p-2 rounded-lg flex-1 ${activeTab === 'recommendations' ? 'text-green-700 bg-green-50' : 'text-gray-500'}`}
        >
          <Leaf className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium truncate w-full text-center">{t('recommendations')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('advisories')}
          className={`flex flex-col items-center p-2 rounded-lg flex-1 ${activeTab === 'advisories' ? 'text-green-700 bg-green-50' : 'text-gray-500'}`}
        >
          <Bell className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium truncate w-full text-center">{t('advisories')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('crop_health')}
          className={`flex flex-col items-center p-2 rounded-lg flex-1 ${activeTab === 'crop_health' ? 'text-green-700 bg-green-50' : 'text-gray-500'}`}
        >
          <Camera className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium truncate w-full text-center">{t('crop_health')}</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
