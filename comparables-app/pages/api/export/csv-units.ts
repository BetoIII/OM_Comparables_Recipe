import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), '..', 'output', 'comparables_data.json');

function escapeCSVField(field: any): string {
  if (field === null || field === undefined) {
    return '';
  }
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({
        success: false,
        error: 'No comparables data found. Please run an extraction recipe first.',
      });
    }

    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const properties = jsonData.properties || jsonData.comparable_properties || [];

    // Create units CSV
    const unitsHeaders = ['Property Name', 'Unit Type', 'Square Feet', 'Rent'];
    let unitsCSV = unitsHeaders.join(',') + '\n';

    let hasUnits = false;
    properties.forEach((prop: any) => {
      if (prop.units_detail && Array.isArray(prop.units_detail) && prop.units_detail.length > 0) {
        hasUnits = true;
        prop.units_detail.forEach((unit: any) => {
          const row = [
            escapeCSVField(prop.property_name),
            escapeCSVField(unit.unit_type),
            escapeCSVField(unit.square_feet),
            escapeCSVField(unit.rent)
          ];
          unitsCSV += row.join(',') + '\n';
        });
      }
    });

    if (!hasUnits) {
      return res.status(404).json({
        success: false,
        error: 'No unit details found in comparables data.'
      });
    }

    // Set headers for file download
    const filename = `comparables_units_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.status(200).send(unitsCSV);
  } catch (error) {
    console.error('CSV units export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate units CSV export'
    });
  }
}
