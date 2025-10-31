import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const compSetsDir = path.join(process.cwd(), '..', 'output', 'comp_sets');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (typeof name !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid comp set name' });
  }

  const compSetPath = path.join(compSetsDir, `${name}.json`);

  if (req.method === 'GET') {
    // Get specific comp set
    try {
      if (!fs.existsSync(compSetPath)) {
        return res.status(404).json({ success: false, error: 'Comp set not found' });
      }

      const compSetData = JSON.parse(fs.readFileSync(compSetPath, 'utf8'));

      // Return comp set data as-is (it already contains full property data)
      return res.status(200).json({
        success: true,
        data: {
          name,
          properties: compSetData,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to read comp set' });
    }
  }

  if (req.method === 'PUT') {
    // Rename or update comp set
    const { newName, properties } = req.body;

    try {
      if (!fs.existsSync(compSetPath)) {
        return res.status(404).json({ success: false, error: 'Comp set not found' });
      }

      // Handle rename
      if (newName && newName !== name) {
        const newPath = path.join(compSetsDir, `${newName}.json`);

        if (fs.existsSync(newPath)) {
          return res.status(409).json({ success: false, error: 'Comp set with new name already exists' });
        }

        const currentData = properties || JSON.parse(fs.readFileSync(compSetPath, 'utf8'));
        fs.writeFileSync(newPath, JSON.stringify(currentData, null, 2));
        fs.unlinkSync(compSetPath);

        return res.status(200).json({
          success: true,
          message: 'Comp set renamed successfully',
          data: { oldName: name, newName },
        });
      }

      // Handle update properties
      if (properties) {
        fs.writeFileSync(compSetPath, JSON.stringify(properties, null, 2));
        return res.status(200).json({ success: true, message: 'Comp set updated successfully' });
      }

      return res.status(400).json({ success: false, error: 'Either newName or properties must be provided' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to update comp set' });
    }
  }

  if (req.method === 'DELETE') {
    // Delete comp set
    try {
      if (!fs.existsSync(compSetPath)) {
        return res.status(404).json({ success: false, error: 'Comp set not found' });
      }

      fs.unlinkSync(compSetPath);
      return res.status(200).json({ success: true, message: 'Comp set deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to delete comp set' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
