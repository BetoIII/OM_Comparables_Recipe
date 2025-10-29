// Client-side API helper functions

import { ApiResponse, SaveCompSetRequest, CompSet, CompSetListItem } from './types';

const API_BASE = '/api';

export async function checkServerStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/comp-sets`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getCompSets(): Promise<CompSetListItem[]> {
  const response = await fetch(`${API_BASE}/comp-sets`);
  if (!response.ok) throw new Error('Failed to fetch comp sets');
  const data: ApiResponse<CompSetListItem[]> = await response.json();
  return data.data || [];
}

export async function getCompSet(name: string): Promise<CompSet> {
  const response = await fetch(`${API_BASE}/comp-sets/${encodeURIComponent(name)}`);
  if (!response.ok) throw new Error(`Failed to fetch comp set: ${name}`);
  const data: ApiResponse<CompSet> = await response.json();
  if (!data.data) throw new Error('No data returned');
  return data.data;
}

export async function saveCompSet(request: SaveCompSetRequest): Promise<CompSet> {
  const response = await fetch(`${API_BASE}/comp-sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Failed to save comp set');
  const data: ApiResponse<CompSet> = await response.json();
  if (!data.data) throw new Error('No data returned');
  return data.data;
}

export async function renameCompSet(oldName: string, newName: string): Promise<void> {
  const response = await fetch(`${API_BASE}/comp-sets/${encodeURIComponent(oldName)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newName }),
  });
  if (!response.ok) throw new Error('Failed to rename comp set');
}

export async function deleteCompSet(name: string): Promise<void> {
  const response = await fetch(`${API_BASE}/comp-sets/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete comp set');
}

export async function removePropertyFromCompSet(
  compSetName: string,
  propertyId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/comp-sets/${encodeURIComponent(compSetName)}/properties/${encodeURIComponent(propertyId)}`,
    { method: 'DELETE' }
  );
  if (!response.ok) throw new Error('Failed to remove property from comp set');
}
