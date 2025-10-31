import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const dataPath = path.join(process.cwd(), '..', 'output', 'comparables_data.json');

function formatNumber(value: number | null | undefined): string | number {
  if (value === null || value === undefined) return '';
  return value.toLocaleString('en-US');
}

function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return `${value}%`;
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
    const summary = jsonData.summary || {};

    if (!properties || properties.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No properties found in comparables data.'
      });
    }

    // Prepare summary data
    const summaryData = properties.map((prop: any) => ({
      'Property Name': prop.property_name || '',
      'Address': prop.full_address || '',
      'Type': prop.basic_info?.property_type || '',
      'Total Units': formatNumber(prop.basic_info?.total_units),
      'Total SF': formatNumber(prop.basic_info?.total_square_feet),
      'Year Built': prop.basic_info?.year_built || '',
      'Year Renovated': prop.basic_info?.year_renovated || '',
      'Occupancy Rate': formatPercentage(prop.basic_info?.occupancy_rate),
      'Distance': prop.distance_from_subject || '',
      'Notes': prop.notes || '',
      'Source Document': prop.source_document || '',
    }));

    // Prepare unit details data
    const unitDetailsData: any[] = [];
    properties.forEach((prop: any) => {
      if (prop.units_detail && prop.units_detail.length > 0) {
        prop.units_detail.forEach((unit: any) => {
          unitDetailsData.push({
            'Property Name': prop.property_name,
            'Unit Type': unit.unit_type,
            'Square Feet': formatNumber(unit.square_feet),
            'Rent': unit.rent || '',
          });
        });
      }
    });

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add summary info sheet
    const metadataData = [
      { Key: 'Total Properties', Value: summary.total_properties || properties.length },
      { Key: 'Documents Processed', Value: summary.documents_processed?.join(', ') || '' },
      { Key: 'Export Date', Value: new Date().toISOString().split('T')[0] },
    ];
    const wsMetadata = XLSX.utils.json_to_sheet(metadataData);
    XLSX.utils.book_append_sheet(wb, wsMetadata, 'Summary');

    // Add properties sheet
    const wsProperties = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsProperties, 'Properties');

    // Add unit details sheet if there are any
    if (unitDetailsData.length > 0) {
      const wsUnits = XLSX.utils.json_to_sheet(unitDetailsData);
      XLSX.utils.book_append_sheet(wb, wsUnits, 'Unit Details');
    }

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    const filename = `comparables_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.status(200).send(buffer);
  } catch (error) {
    console.error('XLS export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate Excel export'
    });
  }
}
