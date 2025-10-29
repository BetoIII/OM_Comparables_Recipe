'use client';

import { ComparableProperty, CompSetProperty } from '@/lib/types';

interface PropertyCardProps {
  property: ComparableProperty | CompSetProperty;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  showCheckbox?: boolean;
}

export default function PropertyCard({
  property,
  selected = false,
  onSelect,
  showRemoveButton = false,
  onRemove,
  showCheckbox = true,
}: PropertyCardProps) {
  const compSetProperty = property as CompSetProperty;
  const propertyId = compSetProperty.property_id || property.property_name;

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
        <span className={`property-type-badge ${getBadgeClass(property.basic_info.property_type)}`}>
          {property.basic_info.property_type}
        </span>
      </div>

      {/* Property Details */}
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
        {property.basic_info.total_square_feet && (
          <div className="detail-row">
            <span className="detail-label">Total Square Feet:</span>
            <span className="detail-value">
              {property.basic_info.total_square_feet.toLocaleString()} SF
            </span>
          </div>
        )}
      </div>

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

      {/* Notes */}
      {property.notes && (
        <div className="notes">
          <strong>Notes:</strong> {property.notes}
        </div>
      )}

      {/* Source Document */}
      <div className="source-document">
        <strong>Source:</strong> {property.source_document}
      </div>

      {/* Remove Button (only shown in comp set detail view) */}
      {showRemoveButton && onRemove && (
        <button onClick={onRemove} className="remove-btn">
          Remove from Comp Set
        </button>
      )}
    </div>
  );
}
