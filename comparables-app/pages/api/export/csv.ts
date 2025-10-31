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

    // Create properties CSV
    const propertiesHeaders = [
      'Property Name',
      'Address',
      'Property Type',
      'Total Units',
      'Total SF',
      'Year Built',
      'Year Renovated',
      'Occupancy %',
      'Distance',
      'Notes',
      'Source'
    ];

    let propertiesCSV = propertiesHeaders.join(',') + '\n';

    properties.forEach((prop: any) => {
      const row = [
        escapeCSVField(prop.property_name),
        escapeCSVField(prop.full_address),
        escapeCSVField(prop.basic_info?.property_type),
        escapeCSVField(prop.basic_info?.total_units),
        escapeCSVField(prop.basic_info?.total_square_feet),
        escapeCSVField(prop.basic_info?.year_built),
        escapeCSVField(prop.basic_info?.year_renovated),
        escapeCSVField(prop.basic_info?.occupancy_rate),
        escapeCSVField(prop.distance_from_subject),
        escapeCSVField(prop.notes),
        escapeCSVField(prop.source_document)
      ];
      propertiesCSV += row.join(',') + '\n';
    });

    // Set headers for file download
    const filename = `comparables_data_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.status(200).send(propertiesCSV);
  } catch (error) {
    console.error('CSV export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate CSV export'
    });
  }
}
