import { elections as fallbackElections } from '../data/elections';
import { parties as fallbackParties } from '../data/parties';
import { constituencies as fallbackConstituencies } from '../data/constituencies';
import { candidates as fallbackCandidates } from '../data/candidates';
import { policies as fallbackPolicies } from '../data/policies';
import { resources as fallbackResources } from '../data/resources';

const API_BASE = '/api';

/**
 * Helper to fetch with timeout and fallback support
 */
async function fetchJson(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn(`[API] Fallback used for ${endpoint}:`, error.message);
    return null;
  }
}

// System Health Check
export async function getHealthStatus() {
  const res = await fetchJson('/health');
  return res || { status: 'offline', version: 'local-fallback' };
}

// System Overview Stats
export async function getStats() {
  const res = await fetchJson('/stats');
  if (res?.success && res.data) {
    return res.data;
  }
  return {
    electionsCount: fallbackElections.length,
    partiesCount: fallbackParties.length,
    constituenciesCount: fallbackConstituencies.length,
    candidatesCount: fallbackCandidates.length,
    policiesCount: fallbackPolicies.length,
    enquiriesCount: 0
  };
}

// Elections
export async function getElections(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetchJson(`/elections${query ? `?${query}` : ''}`);
  if (res?.success && Array.isArray(res.data)) {
    return res.data;
  }
  return fallbackElections;
}

export async function getElectionById(id) {
  const res = await fetchJson(`/elections/${id}`);
  if (res?.success && res.data) {
    return res.data;
  }
  return fallbackElections.find(e => e.id === id) || null;
}

// Parties
export async function getParties(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetchJson(`/parties${query ? `?${query}` : ''}`);
  if (res?.success && Array.isArray(res.data)) {
    return res.data;
  }
  return fallbackParties;
}

export async function getPartyById(id) {
  const res = await fetchJson(`/parties/${id}`);
  if (res?.success && res.data) {
    return res.data;
  }
  return fallbackParties.find(p => p.id === id) || null;
}

// Constituencies
export async function getConstituencies(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetchJson(`/constituencies${query ? `?${query}` : ''}`);
  if (res?.success && Array.isArray(res.data)) {
    return res.data;
  }
  return fallbackConstituencies;
}

export async function getConstituencyById(id) {
  const res = await fetchJson(`/constituencies/${id}`);
  if (res?.success && res.data) {
    return res.data;
  }
  return fallbackConstituencies.find(c => c.id === id) || null;
}

// Candidates
export async function getCandidates(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetchJson(`/candidates${query ? `?${query}` : ''}`);
  if (res?.success && Array.isArray(res.data)) {
    return res.data;
  }
  return fallbackCandidates;
}

export async function getCandidateById(id) {
  const res = await fetchJson(`/candidates/${id}`);
  if (res?.success && res.data) {
    return res.data;
  }
  return fallbackCandidates.find(c => c.id === id) || null;
}

// Policies
export async function getPolicies(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetchJson(`/policies${query ? `?${query}` : ''}`);
  if (res?.success && Array.isArray(res.data)) {
    return res.data;
  }
  return fallbackPolicies;
}

// Resources
export async function getResources(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetchJson(`/resources${query ? `?${query}` : ''}`);
  if (res?.success && Array.isArray(res.data)) {
    return res.data;
  }
  return fallbackResources;
}

// Citizen Enquiries
export async function getEnquiries() {
  const res = await fetchJson('/enquiries');
  if (res?.success && Array.isArray(res.data)) {
    return res.data;
  }
  try {
    const saved = localStorage.getItem('voter_citizen_enquiries');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export async function submitEnquiry(enquiryData) {
  const res = await fetchJson('/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiryData)
  });

  if (res?.success && res.data) {
    return { success: true, data: res.data, source: 'backend' };
  }

  // Offline / local storage fallback
  const fallbackEnquiry = {
    id: Date.now(),
    ...enquiryData,
    createdAt: new Date().toISOString(),
    status: 'Pending'
  };

  try {
    const existing = JSON.parse(localStorage.getItem('voter_citizen_enquiries') || '[]');
    existing.unshift(fallbackEnquiry);
    localStorage.setItem('voter_citizen_enquiries', JSON.stringify(existing));
  } catch {
    // ignore local storage error
  }

  return { success: true, data: fallbackEnquiry, source: 'local' };
}
