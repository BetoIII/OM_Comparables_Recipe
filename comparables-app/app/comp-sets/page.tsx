'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCompSets, deleteCompSet } from '@/lib/api';
import { CompSetListItem } from '@/lib/types';
import ToastContainer, { useToast } from '@/components/Toast';

export default function CompSetsPage() {
  const [compSets, setCompSets] = useState<CompSetListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const loadCompSets = async () => {
    try {
      setLoading(true);
      const sets = await getCompSets();
      setCompSets(sets);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompSets();
  }, []);

  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete the comp set "${name}"?`)) {
      return;
    }

    try {
      await deleteCompSet(name);
      showSuccess(`Comp set "${name}" deleted successfully`);
      loadCompSets(); // Reload list
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

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="header">
          <h1>Error</h1>
          <p style={{ marginTop: '20px', color: '#e53e3e' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (compSets.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="header">
          <h1>Comp Sets</h1>
          <p style={{ marginTop: '20px', fontSize: '1.1em', color: '#4a5568' }}>
            No comp sets found. Create your first comp set by viewing the comparables report and selecting
            properties.
          </p>
          <Link href="/comparables">
            <button className="comp-button" style={{ marginTop: '20px', fontSize: '1em', padding: '12px 24px' }}>
              Go to Comparables Report
            </button>
          </Link>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="header">
        <h1>Comp Sets</h1>
        <p style={{ marginTop: '10px', fontSize: '1.1em', color: '#4a5568' }}>
          Manage your saved comp sets. Click on a comp set to view details.
        </p>
      </div>

      <div className="comp-sets-list">
        {compSets.map((compSet) => (
          <div key={compSet.name} className="comp-set-card">
            <h3>{compSet.name}</h3>
            <p style={{ color: '#4a5568', marginTop: '8px' }}>
              {compSet.property_count} {compSet.property_count === 1 ? 'property' : 'properties'}
            </p>
            {compSet.updated_at && (
              <p style={{ color: '#718096', fontSize: '0.85em', marginTop: '5px' }}>
                Updated: {new Date(compSet.updated_at).toLocaleDateString()}
              </p>
            )}

            <div className="comp-set-actions">
              <Link href={`/comp-sets/${encodeURIComponent(compSet.name)}`}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  View
                </button>
              </Link>
              <button
                onClick={() => handleDelete(compSet.name)}
                style={{ background: '#e53e3e', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
