// Mock data services for agricultural data

const mockSoilData = {
    'Kangra': { type: 'Loamy', ph: 6.5, nitrogen: 'Low', phosphorus: 'Medium', potassium: 'High' },
    'Kakinada': { type: 'Alluvial', ph: 7.2, nitrogen: 'Medium', phosphorus: 'High', potassium: 'Medium' },
    'Bhilwara': { type: 'Sandy', ph: 8.0, nitrogen: 'Low', phosphorus: 'Low', potassium: 'Medium' },
    'Medchal-Malkajgiri': { type: 'Red', ph: 6.8, nitrogen: 'Low', phosphorus: 'Medium', potassium: 'Low' },
    'default': { type: 'Mixed', ph: 7.0, nitrogen: 'Medium', phosphorus: 'Medium', potassium: 'Medium' }
};

const mockWeatherData = {
    'Kangra': { forecast: 'Moderate rain expected', rainProbability: 60, drySpellRisk: 'Low' },
    'Kakinada': { forecast: 'Heavy rain expected', rainProbability: 90, drySpellRisk: 'Low' },
    'Bhilwara': { forecast: 'Clear skies, no rain', rainProbability: 10, drySpellRisk: 'High' },
    'Medchal-Malkajgiri': { forecast: 'Light showers', rainProbability: 40, drySpellRisk: 'Medium' },
    'default': { forecast: 'Partly cloudy', rainProbability: 20, drySpellRisk: 'Medium' }
};

const mockGroundwater = {
    'Kangra': { depthMeters: 5, status: 'Safe' },
    'Kakinada': { depthMeters: 8, status: 'Safe' },
    'Bhilwara': { depthMeters: 45, status: 'Over-exploited' },
    'Medchal-Malkajgiri': { depthMeters: 25, status: 'Semi-critical' },
    'default': { depthMeters: 15, status: 'Safe' }
};

const mockRSKDirectory = [
    { id: 'RSK-HP-01', name: 'Palampur RSK Center', district: 'Kangra', state: 'Himachal Pradesh', contact: '+91 1892 230 000' },
    { id: 'RSK-AP-02', name: 'Annavaram Rythu Bharosa Kendra', district: 'Kakinada', state: 'Andhra Pradesh', contact: '+91 884 234 5678' },
    { id: 'RSK-RJ-03', name: 'Bhilwara Krishi Vigyan Kendra', district: 'Bhilwara', state: 'Rajasthan', contact: '+91 1482 220 123' },
    { id: 'RSK-TG-04', name: 'Medchal Rythu Vedika', district: 'Medchal-Malkajgiri', state: 'Telangana', contact: '+91 40 2345 6789' },
    { id: 'RSK-DEF-00', name: 'Central Agricultural Hub', district: 'default', state: 'default', contact: '1800 180 1551 (Kisan Call Center)' }
];

module.exports = {
    getSoilData: (district) => mockSoilData[district] || mockSoilData['default'],
    getWeatherData: (district) => mockWeatherData[district] || mockWeatherData['default'],
    getGroundwaterData: (district) => mockGroundwater[district] || mockGroundwater['default'],
    getNearestRSK: (district) => mockRSKDirectory.find(rsk => rsk.district === district) || mockRSKDirectory[4]
};
