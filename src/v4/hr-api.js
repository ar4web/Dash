// HR + Operations — data access. Seed mode (default) merges hr-seed.js with any
// locally imported rows (localStorage overlay). API mode (?api=1) uses httpAdapter.

import { useApiMode, seedAdapter, httpAdapter } from './data-adapter.js';
import {
  EMPLOYEES,
  CLIENTS,
  SITES,
  ASSIGNMENTS,
  REQUESTS,
  LEAVE_TYPES,
  HOLIDAYS,
  EXPENSE_CATEGORIES
} from './hr-seed.js';

const SEED_MAP = {
  employees: EMPLOYEES,
  clients: CLIENTS,
  sites: SITES,
  assignments: ASSIGNMENTS,
  requests: REQUESTS,
  leaveTypes: LEAVE_TYPES,
  holidays: HOLIDAYS,
  expenseCategories: EXPENSE_CATEGORIES
};

const API_MAP = {
  employees: { path: '/api/hr/employees', listKey: 'employees' },
  clients: { path: '/api/hr/clients', listKey: 'clients' },
  sites: { path: '/api/hr/sites', listKey: 'sites' },
  assignments: { path: '/api/hr/assignments', listKey: 'assignments' },
  requests: { path: '/api/hr/requests', listKey: 'requests' },
  leaveTypes: { path: '/api/hr/leave-types', listKey: 'types' },
  holidays: { path: '/api/hr/holidays', listKey: 'holidays' },
  expenseCategories: { path: '/api/hr/expense-categories', listKey: 'categories' }
};

function overlayRows(name) {
  try {
    return JSON.parse(localStorage.getItem(`hr:import:${name}`) || '[]');
  } catch (_e) {
    return [];
  }
}

export function saveImportedRows(name, rows) {
  const prev = overlayRows(name);
  try {
    localStorage.setItem(`hr:import:${name}`, JSON.stringify(prev.concat(rows)));
  } catch (_e) {
    /* quota */
  }
}

export function clearImportedRows(name) {
  try {
    localStorage.removeItem(`hr:import:${name}`);
  } catch (_e) {
    /* ignore */
  }
}

/** Seeds merged with local overlay (seed mode only). */
export function getSeed(name) {
  const base = (SEED_MAP[name] || []).slice();
  const extra = overlayRows(name);
  if (!extra.length) {
    return base;
  }
  const keyOf = r => r.code || r.id;
  const seen = new Set(base.map(keyOf));
  for (const r of extra) {
    if (!seen.has(keyOf(r))) {
      base.push(r);
    }
  }
  return base;
}

const adapters = {};

export function hrAdapter(name) {
  if (adapters[name]) {
    return adapters[name];
  }
  let a;
  if (useApiMode() && API_MAP[name]) {
    a = httpAdapter(API_MAP[name].path, { listKey: API_MAP[name].listKey });
  } else {
    a = seedAdapter(getSeed(name));
  }
  adapters[name] = a;
  return a;
}

export async function hrList(name, query = {}) {
  return hrAdapter(name).list(query);
}

export function isApi() {
  return useApiMode();
}
