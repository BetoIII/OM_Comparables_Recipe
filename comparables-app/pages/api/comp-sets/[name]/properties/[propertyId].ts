import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const compSetsDir = path.join(process.cwd(), '..', 'output', 'comp_sets');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, propertyId } = req.query;

  if (typeof name !== 'string' || typeof propertyId !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid parameters' });
  }

  const compSetPath = path.join(compSetsDir, `${name}.json`);

  if (req.method === 'DELETE') {
    // Remove property from comp set
    try {
      if (!fs.existsSync(compSetPath)) {
        return res.status(404).json({ success: false, error: 'Comp set not found' });
      }

      const properties = JSON.parse(fs.readFileSync(compSetPath, 'utf8'));

      // Filter out the property by property_id or property_name
      const updatedProperties = properties.filter(
        (prop: any) => prop.property_id !== propertyId && prop.property_name !== propertyId
      );

      if (updatedProperties.length === properties.length) {
        return res.status(404).json({ success: false, error: 'Property not found in comp set' });
      }

      fs.writeFileSync(compSetPath, JSON.stringify(updatedProperties, null, 2));

      return res.status(200).json({
        success: true,
        message: 'Property removed successfully',
        data: { remaining: updatedProperties.length },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to remove property' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
