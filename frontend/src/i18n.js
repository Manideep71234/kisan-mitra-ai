import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "Kisan Mitra AI",
      "home": "Home",
      "recommendations": "Crop Recommendations",
      "advisories": "Advisories",
      "crop_health": "Crop Health",
      "select_farmer": "Select Farmer Profile",
      "farm_details": "Farm Details",
      "size_acres": "Size (Acres)",
      "season": "Season",
      "irrigation": "Irrigation Source",
      "get_recommendation": "Get Smart Recommendation",
      "listen": "Listen",
      "stop": "Stop",
      "alerts": "Real-time Alerts & Advisories",
      "trigger_dry_spell": "Trigger Dry Spell Alert (Demo)",
      "trigger_heavy_rain": "Trigger Heavy Rain Alert (Demo)",
      "sms_simulation": "SMS Delivery Simulation",
      "upload_photo": "Upload Crop Photo",
      "voice_note": "Record Voice Note",
      "analyze": "Analyze Health",
      "diagnosis": "AI Diagnosis",
      "home_remedy": "Recommended Remedy",
      "rsk_ticket": "Escalated to RSK"
    }
  },
  hi: {
    translation: {
      "app_name": "किसान मित्र AI",
      "home": "मुख्य पृष्ठ",
      "recommendations": "फसल सिफारिश",
      "advisories": "सलाह",
      "crop_health": "फसल स्वास्थ्य",
      "select_farmer": "किसान प्रोफाइल चुनें",
      "farm_details": "खेत का विवरण",
      "size_acres": "आकार (एकड़)",
      "season": "मौसम",
      "irrigation": "सिंचाई का स्रोत",
      "get_recommendation": "सिफारिश प्राप्त करें",
      "listen": "सुनें",
      "stop": "रुकें",
      "alerts": "वास्तविक समय अलर्ट",
      "trigger_dry_spell": "सूखा अलर्ट (डेमो)",
      "trigger_heavy_rain": "भारी बारिश अलर्ट (डेमो)",
      "sms_simulation": "SMS सिमुलेशन",
      "upload_photo": "फसल की फोटो अपलोड करें",
      "voice_note": "वॉयस नोट रिकॉर्ड करें",
      "analyze": "स्वास्थ्य का विश्लेषण करें",
      "diagnosis": "AI निदान",
      "home_remedy": "अनुशंसित उपाय",
      "rsk_ticket": "RSK को भेजा गया"
    }
  },
  te: {
    translation: {
      "app_name": "కిసాన్ మిత్ర AI",
      "home": "హోమ్",
      "recommendations": "పంట సిఫార్సులు",
      "advisories": "సలహాలు",
      "crop_health": "పంట ఆరోగ్యం",
      "select_farmer": "రైతు ప్రొఫైల్ ఎంచుకోండి",
      "farm_details": "పొలం వివరాలు",
      "size_acres": "పరిమాణం (ఎకరాలు)",
      "season": "ఋతువు",
      "irrigation": "నీటి పారుదల వనరు",
      "get_recommendation": "సిఫార్సు పొందండి",
      "listen": "వినండి",
      "stop": "ఆపండి",
      "alerts": "నిజ-సమయ హెచ్చరికలు",
      "trigger_dry_spell": "డ్రై స్పెల్ అలర్ట్ (డెమో)",
      "trigger_heavy_rain": "భారీ వర్షం అలర్ట్ (డెమో)",
      "sms_simulation": "SMS అనుకరణ",
      "upload_photo": "పంట ఫోటో అప్‌లోడ్ చేయండి",
      "voice_note": "వాయిస్ నోట్ రికార్డ్ చేయండి",
      "analyze": "ఆరోగ్యాన్ని విశ్లేషించండి",
      "diagnosis": "AI నిర్ధారణ",
      "home_remedy": "సిఫార్సు చేయబడిన పరిష్కారం",
      "rsk_ticket": "RSK కి పంపబడింది"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
