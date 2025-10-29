'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import SummaryStats from '@/components/SummaryStats';
import CompSetToolbar from '@/components/CompSetToolbar';
import ToastContainer, { useToast } from '@/components/Toast';
import { ComparablesData, ComparableProperty } from '@/lib/types';
import { saveCompSet } from '@/lib/api';

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
      const selectedProps = data?.comparable_properties.filter((p) =>
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

  const stats = [
    { number: data.summary.total_properties, label: 'Total Properties' },
    {
      number: data.comparable_properties.reduce(
        (sum, p) => sum + (p.basic_info.total_units || 0),
        0
      ),
      label: 'Total Units',
    },
    { number: data.summary.documents_processed.length, label: 'Documents Processed' },
    {
      number: Math.round(
        data.comparable_properties.filter((p) => p.basic_info.year_built).length > 0
          ? data.comparable_properties.reduce((sum, p) => sum + (p.basic_info.year_built || 0), 0) /
              data.comparable_properties.filter((p) => p.basic_info.year_built).length
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
          <h1>Comparable Properties Report</h1>
          <SummaryStats stats={stats} />
        </div>

        <div className="properties-grid">
          {data.comparable_properties.map((property) => (
            <PropertyCard
              key={property.property_name}
              property={property}
              selected={selectedProperties.has(property.property_name)}
              onSelect={(selected) => handleSelectProperty(property.property_name, selected)}
              showCheckbox={true}
            />
          ))}
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
