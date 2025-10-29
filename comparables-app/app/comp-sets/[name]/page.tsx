'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import SummaryStats from '@/components/SummaryStats';
import ToastContainer, { useToast } from '@/components/Toast';
import { CompSet } from '@/lib/types';
import { getCompSet, removePropertyFromCompSet, renameCompSet, deleteCompSet } from '@/lib/api';

export default function CompSetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const name = decodeURIComponent(params.name as string);

  const [compSet, setCompSet] = useState<CompSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const loadCompSet = async () => {
    try {
      setLoading(true);
      const data = await getCompSet(name);
      setCompSet(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompSet();
  }, [name]);

  const handleRemoveProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to remove this property from the comp set?')) {
      return;
    }

    try {
      await removePropertyFromCompSet(name, propertyId);
      showSuccess('Property removed successfully');
      loadCompSet(); // Reload
    } catch (err: any) {
      showError(err.message || 'Failed to remove property');
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || newName.trim() === name) {
      setIsRenaming(false);
      return;
    }

    try {
      await renameCompSet(name, newName.trim());
      showSuccess(`Comp set renamed to "${newName.trim()}"`);
      router.push(`/comp-sets/${encodeURIComponent(newName.trim())}`);
    } catch (err: any) {
      showError(err.message || 'Failed to rename comp set');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the comp set "${name}"?`)) {
      return;
    }

    try {
      await deleteCompSet(name);
      showSuccess('Comp set deleted successfully');
      router.push('/comp-sets');
    } catch (err: any) {
      showError(err.message || 'Failed to delete comp set');
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

  if (error || !compSet) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="header">
          <h1>Error</h1>
          <p style={{ marginTop: '20px', color: '#e53e3e' }}>
            {error || 'Comp set not found'}
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    { number: compSet.properties.length, label: 'Total Properties' },
    {
      number: compSet.properties.reduce(
        (sum, p) => sum + (p.basic_info?.total_units || 0),
        0
      ),
      label: 'Total Units',
    },
    {
      number: Math.round(
        compSet.properties.filter((p) => p.basic_info?.year_built).length > 0
          ? compSet.properties.reduce((sum, p) => sum + (p.basic_info?.year_built || 0), 0) /
              compSet.properties.filter((p) => p.basic_info?.year_built).length
          : 0
      ),
      label: 'Avg Year Built',
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          {isRenaming ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                className="comp-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                autoFocus
                style={{ minWidth: '300px' }}
              />
              <button className="comp-button" onClick={handleRename}>
                Save
              </button>
              <button
                className="comp-button"
                onClick={() => setIsRenaming(false)}
                style={{ background: '#718096' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h1>{name}</h1>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="comp-button"
                  onClick={() => {
                    setNewName(name);
                    setIsRenaming(true);
                  }}
                  style={{ background: '#4299e1' }}
                >
                  Rename
                </button>
                <button
                  className="comp-button comp-button-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        <SummaryStats stats={stats} />
      </div>

      <div className="properties-grid">
        {compSet.properties.map((property) => (
          <PropertyCard
            key={property.property_id || property.property_name}
            property={property}
            showCheckbox={false}
            showRemoveButton={true}
            onRemove={() =>
              handleRemoveProperty(property.property_id || property.property_name)
            }
          />
        ))}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
