const Database = require('better-sqlite3');

// Use in-memory database as requested for hackathon demo
const db = new Database(':memory:');

// Initialize schema
function initDB() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS Farmers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            language TEXT DEFAULT 'en',
            village TEXT NOT NULL,
            district TEXT NOT NULL,
            state TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Farms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmerId INTEGER NOT NULL,
            sizeInAcres REAL NOT NULL,
            soilType TEXT NOT NULL,
            irrigationSource TEXT NOT NULL,
            FOREIGN KEY (farmerId) REFERENCES Farmers(id)
        );

        CREATE TABLE IF NOT EXISTS Advisories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmerId INTEGER NOT NULL,
            type TEXT NOT NULL, -- e.g., 'DRY_SPELL', 'PEST_ALERT', 'GENERAL'
            message TEXT NOT NULL,
            date TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            FOREIGN KEY (farmerId) REFERENCES Farmers(id)
        );

        CREATE TABLE IF NOT EXISTS CropLogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmerId INTEGER NOT NULL,
            farmId INTEGER NOT NULL,
            photoUrl TEXT,
            diagnosis TEXT,
            rskTicketId TEXT,
            date TEXT NOT NULL,
            FOREIGN KEY (farmerId) REFERENCES Farmers(id),
            FOREIGN KEY (farmId) REFERENCES Farms(id)
        );
    `);

    // Seed diverse farmer profiles
    const insertFarmer = db.prepare(`INSERT INTO Farmers (name, phone, language, village, district, state) VALUES (?, ?, ?, ?, ?, ?)`);
    const insertFarm = db.prepare(`INSERT INTO Farms (farmerId, sizeInAcres, soilType, irrigationSource) VALUES (?, ?, ?, ?)`);

    const info1 = insertFarmer.run('Ramesh Kumar', '+919876543210', 'hi', 'Palampur', 'Kangra', 'Himachal Pradesh');
    insertFarm.run(info1.lastInsertRowid, 2.5, 'Loamy', 'Rainfed');

    const info2 = insertFarmer.run('Venkata Rao', '+918765432109', 'te', 'Annavaram', 'Kakinada', 'Andhra Pradesh');
    insertFarm.run(info2.lastInsertRowid, 4.0, 'Alluvial', 'Canal');

    const info3 = insertFarmer.run('Sunita Devi', '+917654321098', 'hi', 'Bhilwara', 'Bhilwara', 'Rajasthan');
    insertFarm.run(info3.lastInsertRowid, 1.5, 'Sandy', 'Borewell');

    const info4 = insertFarmer.run('Kiran Reddy', '+916543210987', 'te', 'Medchal', 'Medchal-Malkajgiri', 'Telangana');
    insertFarm.run(info4.lastInsertRowid, 5.0, 'Red', 'Borewell');

    console.log('Database seeded with 4 diverse farmer profiles.');
}

initDB();

module.exports = db;
