const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Enable CORS for local file access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

// Get specific comp set with enriched data
app.get('/api/comp-sets/:name', (req, res) => {
    const compSetName = req.params.name;
    const compSetPath = path.join(compSetDir, `${compSetName}.json`);
    const dataPath = path.join(__dirname, 'output', 'comparables_data.json');

    // Read comp set file
    fs.readFile(compSetPath, 'utf8', (err, compSetData) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ error: 'Comp set not found' });
            }
            return res.status(500).json({ error: 'Failed to read comp set' });
        }

        try {
            const compSet = JSON.parse(compSetData);

            // Try to read comparables data for enrichment
            fs.readFile(dataPath, 'utf8', (err, fullData) => {
                if (err) {
                    // Return comp set without enrichment if data file doesn't exist
                    return res.json({
                        name: compSetName,
                        properties: compSet.map(prop => ({ ...prop, dataNotFound: true }))
                    });
                }

                try {
                    const comparablesData = JSON.parse(fullData);
                    const propertyMap = {};

                    // Create a map of property IDs to full property data
                    if (comparablesData.comparable_properties) {
                        comparablesData.comparable_properties.forEach(prop => {
                            propertyMap[prop.property_id] = prop;
                        });
                    }

                    // Enrich comp set properties with full data
                    const enrichedProperties = compSet.map(prop => {
                        const fullProp = propertyMap[prop.id];
                        if (fullProp) {
                            return fullProp;
                        } else {
                            // Property not found, return minimal data with flag
                            return { ...prop, dataNotFound: true };
                        }
                    });

                    res.json({
                        name: compSetName,
                        properties: enrichedProperties,
                        metadata: comparablesData.metadata,
                        summary: comparablesData.summary
                    });
                } catch (parseErr) {
                    return res.status(500).json({ error: 'Failed to parse comparables data' });
                }
            });
        } catch (parseErr) {
            return res.status(500).json({ error: 'Failed to parse comp set' });
        }
    });
});

// Delete comp set
app.delete('/api/comp-sets/:name', (req, res) => {
    const compSetName = req.params.name;
    const filePath = path.join(compSetDir, `${compSetName}.json`);

    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ error: 'Comp set not found' });
            }
            return res.status(500).json({ error: 'Failed to delete comp set' });
        }
        res.json({ message: 'Comp set deleted successfully' });
    });
});

// Update comp set (rename or update properties)
app.put('/api/comp-sets/:name', (req, res) => {
    const oldName = req.params.name;
    const { newName, properties } = req.body;
    const oldPath = path.join(compSetDir, `${oldName}.json`);

    // If renaming
    if (newName && newName !== oldName) {
        const newPath = path.join(compSetDir, `${newName}.json`);

        // Read old file
        fs.readFile(oldPath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return res.status(404).json({ error: 'Comp set not found' });
                }
                return res.status(500).json({ error: 'Failed to read comp set' });
            }

            // Parse and update if properties provided
            let fileData = properties || JSON.parse(data);

            // Write to new file
            fs.writeFile(newPath, JSON.stringify(fileData, null, 2), (err) => {
                if (err) return res.status(500).json({ error: 'Failed to create renamed comp set' });

                // Delete old file
                fs.unlink(oldPath, (err) => {
                    if (err) return res.status(500).json({ error: 'Failed to delete old comp set' });
                    res.json({ message: 'Comp set renamed successfully', newName });
                });
            });
        });
    }
    // If just updating properties
    else if (properties) {
        fs.writeFile(oldPath, JSON.stringify(properties, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update comp set' });
            res.json({ message: 'Comp set updated successfully' });
        });
    } else {
        res.status(400).json({ error: 'Either newName or properties must be provided' });
    }
});

// Remove single property from comp set
app.delete('/api/comp-sets/:name/properties/:propertyId', (req, res) => {
    const compSetName = req.params.name;
    const propertyId = req.params.propertyId;
    const filePath = path.join(compSetDir, `${compSetName}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ error: 'Comp set not found' });
            }
            return res.status(500).json({ error: 'Failed to read comp set' });
        }

        try {
            const properties = JSON.parse(data);
            const updatedProperties = properties.filter(prop => prop.id !== propertyId);

            if (updatedProperties.length === properties.length) {
                return res.status(404).json({ error: 'Property not found in comp set' });
            }

            fs.writeFile(filePath, JSON.stringify(updatedProperties, null, 2), (err) => {
                if (err) return res.status(500).json({ error: 'Failed to update comp set' });
                res.json({ message: 'Property removed successfully' });
            });
        } catch (parseErr) {
            return res.status(500).json({ error: 'Failed to parse comp set' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
