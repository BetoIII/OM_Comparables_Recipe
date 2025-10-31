'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import SummaryStats from '@/components/SummaryStats';
import CompSetToolbar from '@/components/CompSetToolbar';
import ToastContainer, { useToast } from '@/components/Toast';
import { ComparablesData, ComparableProperty } from '@/lib/types';
import { saveCompSet } from '@/lib/api';
import { exportComparablesToXLS } from '@/lib/xlsExport';

export default function ComparablesPage() {
  const [data, setData] = useState<ComparablesData | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Load comparables data
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/comparables');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load data');
        }

        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSelectProperty = (propertyName: string, selected: boolean) => {
    setSelectedProperties((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(propertyName);
      } else {
        newSet.delete(propertyName);
      }
      return newSet;
    });
  };

  const handleSaveToCompSet = async (compSetName: string) => {
    try {
      const properties = data?.comparable_properties || data?.properties || [];
      const selectedProps = properties.filter((p) =>
        selectedProperties.has(p.property_name)
      );

      if (!selectedProps || selectedProps.length === 0) {
        showError('No properties selected');
        return;
      }

      await saveCompSet({
        compSetName,
        propertyIds: selectedProps.map((p) => p.property_name),
        properties: selectedProps,
      });

      showSuccess(`Added ${selectedProps.length} properties to "${compSetName}"`);
      setSelectedProperties(new Set());
    } catch (err: any) {
      showError(err.message || 'Failed to save comp set');
    }
  };

  const handleExportToXLS = () => {
    const properties = data?.comparable_properties || data?.properties || [];
    if (properties.length === 0) {
      showError('No properties to export');
      return;
    }

    try {
      exportComparablesToXLS(properties);
      showSuccess(`Exported ${properties.length} properties to XLS`);
    } catch (err: any) {
      showError(err.message || 'Failed to export to XLS');
    }
  };

  const handleExportToCSV = async () => {
    try {
      const response = await fetch('/api/export/csv');
      if (!response.ok) {
        throw new Error('Failed to generate CSV export');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comparables_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess('Exported to CSV successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to export to CSV');
    }
  };

  const handleExportToServerXLS = async () => {
    try {
      const response = await fetch('/api/export/xls');
      if (!response.ok) {
        throw new Error('Failed to generate XLS export');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comparables_data_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess('Exported to XLS successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to export to XLS');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="header">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="header">
          <h1>Error</h1>
          <p style={{ marginTop: '20px', color: '#e53e3e' }}>
            {error || 'No data available'}
          </p>
          <p style={{ marginTop: '10px', color: '#4a5568' }}>
            Please run the search_comps recipe in Goose first to extract comparables.
          </p>
        </div>
      </div>
    );
  }

  const properties = data.comparable_properties || data.properties || [];

  // Helper function to extract occupancy from property (basic_info or notes)
  const getOccupancy = (property: ComparableProperty): number | null => {
    if (property.basic_info?.occupancy_rate !== undefined) {
      return property.basic_info.occupancy_rate;
    }
    if (property.notes) {
      const match = property.notes.match(/Occupancy:\s*(\d+(?:\.\d+)?)/i);
      if (match) return parseFloat(match[1]);
    }
    return null;
  };

  // Helper function to extract avg rent/sqft from property notes
  const getAvgRentPerSqft = (property: ComparableProperty): number | null => {
    if (property.notes) {
      const match = property.notes.match(/Avg\.?\s*Rent\/SF:\s*\$?([\d.]+)/i);
      if (match) return parseFloat(match[1]);
    }
    return null;
  };

  const stats = [
    { number: data.summary.total_properties, label: 'Total Properties' },
    {
      number: properties.reduce(
        (sum, p) => sum + (p.basic_info.total_units || 0),
        0
      ),
      label: 'Total Units',
    },
    {
      number: (() => {
        const occupancies = properties.map(getOccupancy).filter((o): o is number => o !== null);
        return occupancies.length > 0
          ? `${Math.round(occupancies.reduce((sum, o) => sum + o, 0) / occupancies.length)}%`
          : 'N/A';
      })(),
      label: 'Avg Occupancy',
    },
    {
      number: (() => {
        const rentPerSqfts = properties.map(getAvgRentPerSqft).filter((r): r is number => r !== null);
        return rentPerSqfts.length > 0
          ? `$${(rentPerSqfts.reduce((sum, r) => sum + r, 0) / rentPerSqfts.length).toFixed(2)}`
          : 'N/A';
      })(),
      label: 'Avg Rent/SF',
    },
    {
      number: Math.round(
        properties.filter((p) => p.basic_info.year_built).length > 0
          ? properties.reduce((sum, p) => sum + (p.basic_info.year_built || 0), 0) /
              properties.filter((p) => p.basic_info.year_built).length
          : 0
      ),
      label: 'Avg Year Built',
    },
  ];

  return (
    <>
      <CompSetToolbar
        selectionCount={selectedProperties.size}
        onSaveToCompSet={handleSaveToCompSet}
      />

      <div className="container">
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ marginBottom: 0 }}>Comparable Properties Report</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="comp-button export-button"
                onClick={handleExportToCSV}
                style={{
                  background: '#3b82f6',
                  padding: '8px 16px',
                  fontSize: '14px'
                }}
              >
                📄 Export CSV
              </button>
              <button
                className="comp-button export-button"
                onClick={handleExportToServerXLS}
                style={{
                  background: '#10b981',
                  padding: '8px 16px',
                  fontSize: '14px'
                }}
              >
                📊 Export XLS
              </button>
            </div>
          </div>
          {data.summary.documents_processed && data.summary.documents_processed.length > 0 && (
            <div style={{
              marginBottom: '20px',
              padding: '12px',
              background: '#f7fafc',
              borderRadius: '8px',
              borderLeft: '4px solid #667eea'
            }}>
              <strong style={{ color: '#2d3748' }}>Source Documents:</strong>
              <span style={{ color: '#4a5568', marginLeft: '8px' }}>
                {data.summary.documents_processed.join(', ')}
              </span>
            </div>
          )}
          <SummaryStats stats={stats} />
        </div>

        <div className="properties-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.property_name}
              property={property}
              selected={selectedProperties.has(property.property_name)}
              onSelect={(selected) => handleSelectProperty(property.property_name, selected)}
              showCheckbox={true}
              showSource={false}
              showDistance={true}
            />
          ))}
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
