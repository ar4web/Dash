// HR + Operations — KSA statutory engine (single versioned source).
// ONLY this module may contain KSA rates/rules. Everything else imports from here.
// Overrides (Nitaqat/licence/levy) merge from Settings store (localStorage in seed mode).

import {
  SEED_COMPANY,
  SEED_NITAQAT,
  SEED_LICENCE,
  GOSI_VERSIONS,
  GOSI_SANED,
  GOSI_HAZARDS,
  GOSI_CAP,
  GOSI_CUTOFF,
  LEVY_TABLE,
  LEAVE_TYPES,
  BLOCKED_DEDUCTIONS
} from './hr-seed.js';

export const SETTINGS_KEY = 'hr:settings:v1';

// ── Customization store (Settings page reads/writes this shape) ──────────
// company: brand placeholders the owner completes in Settings.
// nitaqat: activity category / size band / target % (owner sets later).
// licence: service vs labour outsourcing scope (owner/counsel sets later).

export const DEFAULT_SETTINGS = {
  company: {
    nameEn: SEED_COMPANY.nameEn,
    nameAr: SEED_COMPANY.nameAr,
    cr: SEED_COMPANY.crNo,
    address: SEED_COMPANY.addressEn,
    logo: SEED_COMPANY.logoUrl
  },
  nitaqat: {
    activity: SEED_NITAQAT.activity,
    size: SEED_NITAQAT.sizeClass,
    target: SEED_NITAQAT.targetPct
  },
  licence: {
    scope: SEED_LICENCE.scope,
    strictAjeer: SEED_LICENCE.strictAjeerGuards
  },
  language: SEED_COMPANY.defaultLang || 'en'
};

function storedSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  } catch (_e) {
    return {};
  }
}

function isObj(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function mergeDeep(base, over) {
  const out = { ...base };
  if (!isObj(over)) {
    return out;
  }
  for (const k of Object.keys(over)) {
    out[k] = isObj(base[k]) && isObj(over[k]) ? mergeDeep(base[k], over[k]) : over[k];
  }
  return out;
}

/** Company/nitaqat/licence/language merged over seed defaults. */
export function getSettings() {
  const base = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  return mergeDeep(base, storedSettings());
}

/** Persist full or partial settings; returns the merged result. */
export function saveSettings(next) {
  const merged = mergeDeep(getSettings(), next || {});
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  } catch (_e) {
    /* private mode */
  }
  return merged;
}

export function getStatutoryConfig() {
  const s = storedSettings();
  return {
    levy: { ...LEVY_TABLE, ...(s.levy || {}) },
    nitaqat: s.nitaqat || {},
    licence: {
      scope: (s.licence && s.licence.scope) || 'both',
      strictAjeerGuards: !s.licence || s.licence.strictAjeer !== false
    },
    leave: LEAVE_TYPES
  };
}

// ── Dates ────────────────────────────────────────────────────────────────

export function daysUntil(iso, fromIso) {
  const from = fromIso ? new Date(fromIso) : new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(`${iso}T00:00:00`);
  return Math.round((to - from) / 86400000);
}

export function yearsBetween(fromIso, toIso) {
  const from = new Date(`${fromIso}T00:00:00`);
  const to = toIso ? new Date(`${toIso}T00:00:00`) : new Date();
  let y = (to - from) / 31557600000;
  return Math.max(0, y);
}

// ── GOSI ─────────────────────────────────────────────────────────────────

export function gosiPensionRate(atIso) {
  const at = atIso || new Date().toISOString().slice(0, 10);
  let rate = GOSI_VERSIONS[0].pension;
  for (const v of GOSI_VERSIONS) {
    if (at >= v.from) {
      rate = v.pension;
    }
  }
  return rate;
}

export function isOldGosiSystem(enrolledOn) {
  return !!enrolledOn && enrolledOn < GOSI_CUTOFF;
}

// Returns monthly SAR (major units, rounded to 2dp).
export function calcGosi({
  basic = 0,
  housing = 0,
  isSaudi = false,
  enrolledOn = null,
  at = null
} = {}) {
  const base = Math.min(Math.max(0, basic + housing), GOSI_CAP);
  if (!isSaudi) {
    const hazards = round2(base * GOSI_HAZARDS);
    return { base, employee: 0, employer: hazards, pension: 0, saned: 0, hazards, system: 'expat' };
  }
  const old = isOldGosiSystem(enrolledOn);
  const pensionRate = old ? 0.09 : gosiPensionRate(at);
  const pension = round2(base * pensionRate);
  const saned = round2(base * GOSI_SANED);
  const hazards = round2(base * GOSI_HAZARDS);
  return {
    base,
    employee: round2(pension + saned),
    employer: round2(pension + saned + hazards),
    pension,
    saned,
    hazards,
    system: old ? 'old' : 'new',
    pensionRate
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// ── EOSB (Art. 84/85) ────────────────────────────────────────────────────
// endReason: termination | resignation | resignation-fixed | art80 | art81

export function calcEOSB({ basic = 0, joinDate, endDate = null, endReason = 'termination' } = {}) {
  if (!basic || !joinDate) {
    return { net: 0, gross: 0, haircut: 0, years: 0, factor: 0, reason: endReason };
  }
  if (endReason === 'art80') {
    return { net: 0, gross: 0, haircut: 0, years: 0, factor: 0, reason: endReason };
  }
  const years = yearsBetween(joinDate, endDate);
  const first5 = Math.min(years, 5);
  const rest = Math.max(0, years - 5);
  const gross = round2(basic * 0.5 * first5 + basic * rest);
  let factor = 1;
  if (endReason === 'resignation' || endReason === 'resignation-fixed') {
    if (years < 2) {
      factor = 0;
    } else if (years < 5) {
      factor = 1 / 3;
    } else if (years < 10) {
      factor = 2 / 3;
    } else {
      factor = 1;
    }
  }
  const net = round2(gross * factor);
  return {
    net,
    gross,
    haircut: round2(gross - net),
    years: round2(years),
    factor,
    reason: endReason
  };
}

// ── Leave ────────────────────────────────────────────────────────────────

export function annualEntitlement(joinDate, atIso) {
  const t = LEAVE_TYPES.find(l => l.code === 'annual');
  return yearsBetween(joinDate, atIso) >= 5 ? t.after5 : t.base;
}

export function leaveTypes() {
  return LEAVE_TYPES;
}

// ── Nitaqat estimate ─────────────────────────────────────────────────────
// Weighted: full-time Saudi = 1, part-time Saudi ≥ 3000 = 1/3.

export function nitaqatEstimate(employees, targetPct = 0) {
  const list = (employees || []).filter(e => e.st !== 'exited');
  let saudiUnits = 0;
  let saudis = 0;
  let expats = 0;
  let qiwaAuth = 0;
  for (const e of list) {
    if (e.saudi) {
      saudis += 1;
      const wage = (e.basic || 0) + (e.housing || 0) + (e.transport || 0);
      if (e.partTime) {
        saudiUnits += wage >= 3000 ? 1 / 3 : 0;
      } else {
        saudiUnits += wage >= 4000 ? 1 : 0;
      }
      if (e.q === 'authenticated') {
        qiwaAuth += 1;
      }
    } else {
      expats += 1;
    }
  }
  const total = saudis + expats;
  const pct = total ? (saudiUnits / total) * 100 : 0;
  const qiwaPct = saudis ? (qiwaAuth / saudis) * 100 : 100;
  return {
    saudis,
    expats,
    total,
    saudiUnits: Math.round(saudiUnits * 100) / 100,
    pct: Math.round(pct * 10) / 10,
    qiwaAuth,
    qiwaPct: Math.round(qiwaPct),
    targetPct,
    gap: Math.max(0, Math.round((targetPct - pct) * 10) / 10)
  };
}

// ── Ajeer activation gates (§0.11) ───────────────────────────────────────

export function ajeerCheck(assignment, employee, client, todayIso) {
  const reasons = [];
  const today = todayIso || new Date().toISOString().slice(0, 10);
  if (!assignment) {
    return { ok: false, reasons: ['missing-assignment'] };
  }
  if (!employee) {
    return { ok: false, reasons: ['missing-employee'] };
  }
  if (employee.st === 'exited') {
    reasons.push('employee-exited');
  }
  if (!employee.saudi) {
    if (!employee.iqama) {
      reasons.push('no-iqama');
    } else if (employee.iqamaExp && employee.iqamaExp < today) {
      reasons.push('iqama-expired');
    }
  }
  if (!assignment.consent) {
    reasons.push('no-consent');
  }
  if (!assignment.ajeer) {
    reasons.push('no-ajeer-ref');
  }
  if (assignment.ajeerExp && assignment.ajeerExp < today) {
    reasons.push('ajeer-expired');
  }
  if (assignment.start && assignment.end) {
    const span = yearsBetween(assignment.start, assignment.end);
    if (span > 3.01) {
      reasons.push('over-3y-cap');
    }
  }
  if (client && client.wpsOk === false) {
    reasons.push('client-wps-fail');
  }
  if (client && client.nitaqat === 'Red') {
    reasons.push('client-nitaqat-red');
  }
  return { ok: reasons.length === 0, reasons };
}

// ── Payroll guards ───────────────────────────────────────────────────────

export function isBlockedDeduction(category) {
  return BLOCKED_DEDUCTIONS.includes((category || '').toLowerCase());
}

export function levyFor(bandOk = true) {
  const cfg = getStatutoryConfig();
  return bandOk ? cfg.levy.reduced : cfg.levy.standard;
}
