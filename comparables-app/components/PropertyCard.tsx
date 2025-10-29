'use client';

import { useState } from 'react';
import { ComparableProperty, CompSetProperty } from '@/lib/types';

interface PropertyCardProps {
  property: ComparableProperty | CompSetProperty;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  showCheckbox?: boolean;
  showSource?: boolean;
  showDistance?: boolean;
}

export default function PropertyCard({
  property,
  selected = false,
  onSelect,
  showRemoveButton = false,
  onRemove,
  showCheckbox = true,
  showSource = true,
  showDistance = false,
}: PropertyCardProps) {
  const compSetProperty = property as CompSetProperty;
  const propertyId = compSetProperty.property_id || property.property_name;
  const [notesExpanded, setNotesExpanded] = useState(false);

  // Get property type badge class
  const getBadgeClass = (type: string) => {
    const typeNormalized = type.toLowerCase();
    if (typeNormalized.includes('multifamily')) return 'badge-multifamily';
    if (typeNormalized.includes('office')) return 'badge-office';
    if (typeNormalized.includes('retail')) return 'badge-retail';
    if (typeNormalized.includes('industrial')) return 'badge-industrial';
    if (typeNormalized.includes('mixed')) return 'badge-mixed';
    return 'badge-multifamily'; // default
  };

  // Extract occupancy and avg rent/sqft from notes or basic_info
  const extractDataFromNotes = () => {
    let occupancy = null;
    let avgRentPerSqft = null;

    // First check if data is in basic_info
    if (property.basic_info?.occupancy_rate !== undefined) {
      occupancy = `${property.basic_info.occupancy_rate}%`;
    }

    // Then try to extract from notes
    if (property.notes) {
      const occupancyMatch = property.notes.match(/Occupancy:\s*(\d+(?:\.\d+)?%)/i);
      if (occupancyMatch && !occupancy) {
        occupancy = occupancyMatch[1];
      }

      const rentSqftMatch = property.notes.match(/Avg\.?\s*Rent\/SF:\s*\$?([\d.]+)/i);
      if (rentSqftMatch) {
        avgRentPerSqft = `$${rentSqftMatch[1]}`;
      }
    }

    return { occupancy, avgRentPerSqft };
  };

  const { occupancy, avgRentPerSqft } = extractDataFromNotes();

  // Clean notes by removing occupancy and avg rent/sqft since they're now displayed separately
  const getCleanedNotes = () => {
    if (!property.notes) return null;

    let cleanedNotes = property.notes;

    // Remove "Occupancy: XX%," or "Occupancy: XX%"
    cleanedNotes = cleanedNotes.replace(/Occupancy:\s*\d+(?:\.\d+)?%,?\s*/gi, '');

    // Remove "Avg. Rent/SF: $X.XX," or "Avg Rent/SF: $X.XX"
    cleanedNotes = cleanedNotes.replace(/Avg\.?\s*Rent\/SF:\s*\$?[\d.]+,?\s*/gi, '');

    // Clean up any leading/trailing commas and extra spaces
    cleanedNotes = cleanedNotes.replace(/^[,\s]+|[,\s]+$/g, '').trim();

    return cleanedNotes || null;
  };

  const cleanedNotes = getCleanedNotes();

  return (
    <div className={`property-card ${selected ? 'selected' : ''}`}>
      {/* Checkbox for selection */}
      {showCheckbox && (
        <input
          type="checkbox"
          className="property-checkbox"
          checked={selected}
          onChange={(e) => onSelect?.(e.target.checked)}
          data-property-id={propertyId}
        />
      )}

      {/* Data Not Found warning if applicable */}
      {compSetProperty.dataNotFound && (
        <div className="data-not-found-badge">
          Data Not Found
        </div>
      )}

      {/* Property Header */}
      <div className="property-header">
        <h3 className="property-name">{property.property_name}</h3>
        <p className="property-address">{property.full_address}</p>
        {property.basic_info?.property_type && (
          <span className={`property-type-badge ${getBadgeClass(property.basic_info.property_type)}`}>
            {property.basic_info.property_type}
          </span>
        )}
      </div>

      {/* Property Details */}
      {property.basic_info && (
        <div className="property-details">
          {property.basic_info.year_built && (
            <div className="detail-row">
              <span className="detail-label">Year Built:</span>
              <span className="detail-value">{property.basic_info.year_built}</span>
            </div>
          )}
          {property.basic_info.total_units && (
            <div className="detail-row">
              <span className="detail-label">Total Units:</span>
              <span className="detail-value">{property.basic_info.total_units}</span>
            </div>
          )}
          {occupancy && (
            <div className="detail-row">
              <span className="detail-label">Occupancy:</span>
              <span className="detail-value">{occupancy}</span>
            </div>
          )}
          {avgRentPerSqft && (
            <div className="detail-row">
              <span className="detail-label">Avg Rent/SF:</span>
              <span className="detail-value">{avgRentPerSqft}</span>
            </div>
          )}
          {showDistance && (property as any).distance_from_subject && (
            <div className="detail-row">
              <span className="detail-label">Distance from Subject:</span>
              <span className="detail-value">{(property as any).distance_from_subject}</span>
            </div>
          )}
          {property.basic_info.total_square_feet && (
            <div className="detail-row">
              <span className="detail-label">Total Square Feet:</span>
              <span className="detail-value">
                {property.basic_info.total_square_feet.toLocaleString()} SF
              </span>
            </div>
          )}
        </div>
      )}

      {/* Unit Mix Table */}
      {property.units_detail && property.units_detail.length > 0 && (
        <div className="units-section">
          <h4 className="units-title">Unit Mix</h4>
          <table className="units-table">
            <thead>
              <tr>
                <th>Unit Type</th>
                <th>Rent</th>
                <th>Sq Ft</th>
              </tr>
            </thead>
            <tbody>
              {property.units_detail.map((unit, idx) => (
                <tr key={idx}>
                  <td>{unit.unit_type}</td>
                  <td className="rent-highlight">{unit.rent || 'N/A'}</td>
                  <td>{unit.square_feet ? unit.square_feet.toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Source Document */}
      {showSource && (
        <div className="source-document">
          <strong>Source:</strong> {property.source_document}
        </div>
      )}

      {/* Notes - Collapsible */}
      {cleanedNotes && (
        <div className="notes">
          <button
            className="notes-toggle"
            onClick={() => setNotesExpanded(!notesExpanded)}
          >
            <strong>Notes:</strong>
            <span className="toggle-icon">{notesExpanded ? '▼' : '▶'}</span>
          </button>
          {notesExpanded && (
            <div className="notes-content">
              {cleanedNotes}
            </div>
          )}
        </div>
      )}

      {/* Remove Button (only shown in comp set detail view) */}
      {showRemoveButton && onRemove && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            onClick={onRemove}
            className="comp-button"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#dc2626',
              fontSize: '0.875rem',
              padding: '8px 16px',
              fontWeight: '500',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            Remove 🗑️
          </button>
        </div>
      )}
    </div>
  );
}
