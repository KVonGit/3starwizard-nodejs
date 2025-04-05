const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Create data directory and streakdata.json file if they don't exist
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'streakdata.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
}

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', require('./routes/api'));

// Serve the main HTML page
app.get('/', (req, res) => {
    res.render('index', { 
        password: process.env.THREE_STAR_PASSWORD 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});