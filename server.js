const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Enable CORS for local file access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const compSetDir = path.join(__dirname, 'comp_sets');

// Load existing comp sets
app.get('/api/comp-sets', (req, res) => {
    fs.readdir(compSetDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to read directory' });
        const compSets = files.map(file => ({ name: path.basename(file, '.json') }));
        res.json(compSets);
    });
});

// Save comp set
app.post('/api/save-comp-set', (req, res) => {
    const { name, properties } = req.body;
    const filePath = path.join(compSetDir, `${name}.json`);
    fs.writeFile(filePath, JSON.stringify(properties, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save comp set' });
        res.json({ message: 'Comp set saved successfully' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
