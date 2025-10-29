'use client';

import { useState, useEffect } from 'react';
import { getCompSets, checkServerStatus } from '@/lib/api';

interface CompSetToolbarProps {
  selectionCount: number;
  onSaveToCompSet: (compSetName: string) => void;
  disabled?: boolean;
}

export default function CompSetToolbar({
  selectionCount,
  onSaveToCompSet,
  disabled = false,
}: CompSetToolbarProps) {
  const [existingCompSets, setExistingCompSets] = useState<string[]>([]);
  const [selectedCompSet, setSelectedCompSet] = useState<string>('');
  const [newCompSetName, setNewCompSetName] = useState<string>('');
  const [serverOnline, setServerOnline] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Check server status and load existing comp sets
  useEffect(() => {
    async function loadData() {
      const status = await checkServerStatus();
      setServerOnline(status);

      if (status) {
        try {
          const compSets = await getCompSets();
          setExistingCompSets(compSets.map((cs) => cs.name));
        } catch (error) {
          console.error('Failed to load comp sets:', error);
        }
      }
    }

    loadData();

    // Add scroll listener for sticky toolbar shadow
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = () => {
    // Use new comp set name if provided, otherwise use selected existing one
    const compSetName = newCompSetName.trim() || selectedCompSet;

    if (!compSetName) {
      alert('Please enter a comp set name or select an existing one');
      return;
    }

    onSaveToCompSet(compSetName);

    // Reset form
    setNewCompSetName('');
    setSelectedCompSet('');
  };

  const canSave = selectionCount > 0 && !disabled && serverOnline;

  return (
    <div className={`comp-toolbar ${disabled ? 'disabled' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className="toolbar-wrapper">
        <div className="toolbar-left">
          <div className="selection-counter">
            {selectionCount} {selectionCount === 1 ? 'property' : 'properties'} selected
          </div>

          <select
            className="comp-select"
            value={selectedCompSet}
            onChange={(e) => {
              setSelectedCompSet(e.target.value);
              if (e.target.value) setNewCompSetName(''); // Clear new name if selecting existing
            }}
            disabled={!serverOnline}
          >
            <option value="">Select existing comp set...</option>
            {existingCompSets.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="comp-input"
            placeholder="Or enter new comp set name..."
            value={newCompSetName}
            onChange={(e) => {
              setNewCompSetName(e.target.value);
              if (e.target.value) setSelectedCompSet(''); // Clear selection if typing new name
            }}
            disabled={!serverOnline}
          />
        </div>

        <div className="toolbar-right">
          <div className={`server-status ${serverOnline ? 'online' : 'offline'}`}>
            {serverOnline ? 'Server Online' : 'Server Offline'}
          </div>

          <button
            className="comp-button"
            onClick={handleSave}
            disabled={!canSave}
          >
            Add Selected to Comp Set
          </button>
        </div>
      </div>
    </div>
  );
}
