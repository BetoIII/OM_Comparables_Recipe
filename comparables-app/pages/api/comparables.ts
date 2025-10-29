import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), '..', 'output', 'comparables_data.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(dataPath)) {
        return res.status(404).json({
          success: false,
          error: 'No comparables data found. Please run the search_comps recipe first.',
        });
      }

      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to read comparables data' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
