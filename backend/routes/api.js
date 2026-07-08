const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../database');
const mockData = require('../mockData');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- MODULE 1: Crop Recommendation ---
router.post('/recommend-crop', (req, res) => {
    const { farmerId, sizeInAcres, season, irrigationSource, district } = req.body;
    
    // Fetch mock data
    const soil = mockData.getSoilData(district);
    const weather = mockData.getWeatherData(district);
    const groundwater = mockData.getGroundwaterData(district);

    // Mock AI Logic based on data
    let recommendations = [];
    if (season === 'Kharif') {
        if (weather.rainProbability > 70) {
            recommendations = [
                { crop: 'Paddy', score: 95, reason: 'High rainfall expected, ideal for Paddy.', water: 'High', costYield: 'Cost: ₹10k, Yield: 20q' },
                { crop: 'Maize', score: 80, reason: 'Good alternative if drainage is proper.', water: 'Medium', costYield: 'Cost: ₹6k, Yield: 15q' }
            ];
        } else {
            recommendations = [
                { crop: 'Groundnut', score: 90, reason: 'Low rainfall expected, Groundnut is drought-resistant.', water: 'Low', costYield: 'Cost: ₹8k, Yield: 10q' },
                { crop: 'Millets', score: 85, reason: 'Very low water requirement.', water: 'Very Low', costYield: 'Cost: ₹3k, Yield: 8q' }
            ];
        }
    } else {
        // Rabi/Zaid
        if (irrigationSource === 'Borewell' && groundwater.status === 'Safe') {
            recommendations = [
                { crop: 'Wheat', score: 92, reason: 'Safe groundwater levels support Wheat.', water: 'High', costYield: 'Cost: ₹9k, Yield: 18q' },
                { crop: 'Mustard', score: 88, reason: 'Requires less water, good for winter.', water: 'Low', costYield: 'Cost: ₹4k, Yield: 12q' }
            ];
        } else {
            recommendations = [
                { crop: 'Chickpea (Chana)', score: 94, reason: 'Low water availability; Chana is resilient.', water: 'Low', costYield: 'Cost: ₹5k, Yield: 10q' }
            ];
        }
    }

    // Always ensure 3 recommendations for UI
    if (recommendations.length < 3) {
        recommendations.push({ crop: 'Vegetables (Mixed)', score: 75, reason: 'Short duration cash crop.', water: 'Medium', costYield: 'Cost: ₹5k, Yield: Variable' });
    }

    res.json({ recommendations: recommendations.slice(0, 3) });
});

// --- MODULE 2: Advisory & Alerts ---
router.get('/farmers', (req, res) => {
    const farmers = db.prepare('SELECT * FROM Farmers').all();
    res.json(farmers);
});

router.post('/trigger-alert', (req, res) => {
    const { farmerId, type } = req.body;
    let message = '';
    
    if (type === 'DRY_SPELL') {
        message = 'Alert: No rainfall predicted for the next 7 days. Please arrange light irrigation to save your crop.';
    } else if (type === 'HEAVY_RAIN') {
        message = 'Alert: Heavy rainfall predicted. Delay fertilization and ensure field drainage.';
    }

    db.prepare('INSERT INTO Advisories (farmerId, type, message, date) VALUES (?, ?, ?, ?)').run(farmerId, type, message, new Date().toISOString());
    
    res.json({ success: true, message: 'Alert triggered' });
});

router.get('/advisories/:farmerId', (req, res) => {
    const advisories = db.prepare('SELECT * FROM Advisories WHERE farmerId = ? ORDER BY id DESC').all(req.params.farmerId);
    res.json(advisories);
});

router.post('/sms-simulate', (req, res) => {
    const { phone, message } = req.body;
    // Log to console to simulate Twilio/Exotel
    console.log(`[SMS SIMULATION] Sent to ${phone}: ${message}`);
    res.json({ success: true, logged: true });
});

// --- MODULE 3: Crop Health Logging ---
router.post('/crop-health', upload.single('photo'), (req, res) => {
    const { farmerId, farmId, voiceNoteContext } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Mock Gemini Vision AI response
    let diagnosis = 'Nutrient Deficiency (Nitrogen)';
    let confidence = 70;
    let homeRemedy = 'Apply Urea as top dressing or spray NPK 19:19:19.';
    let needsEscalation = true;

    // Determine nearest RSK
    const farmer = db.prepare('SELECT district FROM Farmers WHERE id = ?').get(farmerId);
    const rsk = mockData.getNearestRSK(farmer ? farmer.district : 'default');
    
    let rskTicketId = null;
    if (needsEscalation) {
        rskTicketId = `RSK-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Log it
    db.prepare('INSERT INTO CropLogs (farmerId, farmId, photoUrl, diagnosis, rskTicketId, date) VALUES (?, ?, ?, ?, ?, ?)').run(
        farmerId, farmId, photoUrl, diagnosis, rskTicketId, new Date().toISOString()
    );

    res.json({
        diagnosis,
        confidence,
        homeRemedy,
        escalation: needsEscalation ? { ticketId: rskTicketId, rskDetails: rsk } : null
    });
});

module.exports = router;
