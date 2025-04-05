const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/streaks.json');

// Helper functions
const readData = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Define routes
router.get('/streaks', (req, res) => {
    const data = readData();
    res.json(data);
});

router.post('/streaks/start', (req, res) => {
    const { user } = req.body;
    const data = readData();
    console.log('data:', data);
    if (typeof data[user] !== 'undefined') {
        return res.status(400).json({ message: 'User already exists.' });
    }
    
    data[user] = 0;
    writeData(data);
    res.status(201).json({ message: 'User added.', user, streak: 0 });
});

router.post('/streaks/plus', (req, res) => {
    const { user } = req.body;
    const data = readData();
    console.log('data:', data);
    
    if (typeof data[user] == 'undefined') {
        return res.status(404).json({ message: 'User not found.' });
    }
    
    data[user] += 1;
    writeData(data);
    res.json({ message: 'Streak incremented.', user, streak: data[user] });
});

router.delete('/streaks/end', (req, res) => {
    const { user } = req.body;
    const data = readData();
    
    if (typeof data[user] == 'undefined') {
        return res.status(404).json({ message: 'User not found.' });
    }
    
    delete data[user];
    writeData(data);
    res.json({ message: 'User deleted.', user });
});

module.exports = router;