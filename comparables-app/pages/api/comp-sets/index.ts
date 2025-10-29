import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const compSetsDir = path.join(process.cwd(), '..', 'comp_sets');

// Ensure comp_sets directory exists
if (!fs.existsSync(compSetsDir)) {
  fs.mkdirSync(compSetsDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List all comp sets
    try {
      const files = fs.readdirSync(compSetsDir);
      const compSets = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(compSetsDir, file);
          const stats = fs.statSync(filePath);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

          return {
            name: path.basename(file, '.json'),
            property_count: Array.isArray(data) ? data.length : 0,
            created_at: stats.birthtime.toISOString(),
            updated_at: stats.mtime.toISOString(),
          };
        });

      return res.status(200).json({ success: true, data: compSets });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to read comp sets directory' });
    }
  }

  if (req.method === 'POST') {
    // Save/create comp set
    const { compSetName, properties } = req.body;

    if (!compSetName || !properties) {
      return res.status(400).json({ success: false, error: 'compSetName and properties are required' });
    }

    try {
      const filePath = path.join(compSetsDir, `${compSetName}.json`);

      // If file exists, merge properties
      let existingProperties = [];
      if (fs.existsSync(filePath)) {
        existingProperties = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }

      // Add property_id if not present and prevent duplicates
      const propertyMap = new Map();
      [...existingProperties, ...properties].forEach(prop => {
        const id = prop.property_id || prop.property_name;
        if (!propertyMap.has(id)) {
          propertyMap.set(id, { ...prop, property_id: id });
        }
      });

      const mergedProperties = Array.from(propertyMap.values());

      fs.writeFileSync(filePath, JSON.stringify(mergedProperties, null, 2));

      return res.status(200).json({
        success: true,
        message: 'Comp set saved successfully',
        data: { name: compSetName, properties: mergedProperties },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to save comp set' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
