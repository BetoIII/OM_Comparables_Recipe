import * as XLSX from 'xlsx';
import { ComparableProperty } from './types';

/**
 * Format number with locale string
 */
const formatNumber = (value: number | null | undefined): string | number => {
  if (value === null || value === undefined) return '';
  return value.toLocaleString('en-US');
};

/**
 * Format percentage
 */
const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return `${value}%`;
};

/**
 * Get current date in YYYY-MM-DD format
 */
const getCurrentDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Export comparables data to Excel (XLS)
 */
export const exportComparablesToXLS = (
  properties: ComparableProperty[],
  filename?: string
): void => {
  if (!properties || properties.length === 0) {
    alert('No properties to export');
    return;
  }

  // Prepare summary data
  const summaryData = properties.map((prop) => ({
    'Property Name': prop.property_name || '',
    'Address': prop.full_address || '',
    'Type': prop.basic_info.property_type || '',
    'Total Units': formatNumber(prop.basic_info.total_units),
    'Total SF': formatNumber(prop.basic_info.total_square_feet),
    'Year Built': prop.basic_info.year_built || '',
    'Year Renovated': prop.basic_info.year_renovated || '',
    'Occupancy Rate': formatPercentage(prop.basic_info.occupancy_rate),
    'Distance': prop.distance_from_subject || '',
    'Notes': prop.notes || '',
    'Source Document': prop.source_document || '',
  }));

  // Prepare unit details data (if any properties have unit details)
  const unitDetailsData: any[] = [];
  properties.forEach((prop) => {
    if (prop.units_detail && prop.units_detail.length > 0) {
      prop.units_detail.forEach((unit) => {
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

  // Add summary sheet
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Properties Summary');

  // Add unit details sheet if there are any
  if (unitDetailsData.length > 0) {
    const wsUnits = XLSX.utils.json_to_sheet(unitDetailsData);
    XLSX.utils.book_append_sheet(wb, wsUnits, 'Unit Details');
  }

  // Generate filename
  const finalFilename = filename || `Comparables_Report_${getCurrentDate()}.xlsx`;

  // Trigger download
  XLSX.writeFile(wb, finalFilename);
};

/**
 * Export comp set data to Excel (XLS)
 */
export const exportCompSetToXLS = (
  compSetName: string,
  properties: ComparableProperty[],
  filename?: string
): void => {
  if (!properties || properties.length === 0) {
    alert('No properties to export');
    return;
  }

  // Prepare comp set data
  const compSetData = properties.map((prop) => ({
    'Property Name': prop.property_name || '',
    'Address': prop.full_address || '',
    'Type': prop.basic_info.property_type || '',
    'Total Units': formatNumber(prop.basic_info.total_units),
    'Total SF': formatNumber(prop.basic_info.total_square_feet),
    'Year Built': prop.basic_info.year_built || '',
    'Year Renovated': prop.basic_info.year_renovated || '',
    'Occupancy Rate': formatPercentage(prop.basic_info.occupancy_rate),
    'Distance': prop.distance_from_subject || '',
    'Notes': prop.notes || '',
    'Source Document': prop.source_document || '',
  }));

  // Prepare unit details
  const unitDetailsData: any[] = [];
  properties.forEach((prop) => {
    if (prop.units_detail && prop.units_detail.length > 0) {
      prop.units_detail.forEach((unit) => {
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

  // Add metadata sheet
  const metadataData = [
    { Key: 'Comp Set Name', Value: compSetName },
    { Key: 'Total Properties', Value: properties.length },
    { Key: 'Export Date', Value: getCurrentDate() },
  ];
  const wsMetadata = XLSX.utils.json_to_sheet(metadataData);
  XLSX.utils.book_append_sheet(wb, wsMetadata, 'Comp Set Info');

  // Add properties sheet
  const wsProperties = XLSX.utils.json_to_sheet(compSetData);
  XLSX.utils.book_append_sheet(wb, wsProperties, 'Properties');

  // Add unit details sheet if there are any
  if (unitDetailsData.length > 0) {
    const wsUnits = XLSX.utils.json_to_sheet(unitDetailsData);
    XLSX.utils.book_append_sheet(wb, wsUnits, 'Unit Details');
  }

  // Generate filename
  const sanitizedName = compSetName.replace(/[^a-zA-Z0-9]/g, '_');
  const finalFilename = filename || `CompSet_${sanitizedName}_${getCurrentDate()}.xlsx`;

  // Trigger download
  XLSX.writeFile(wb, finalFilename);
};
