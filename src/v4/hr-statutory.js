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

// ── Expiry bands + pre-renewal checklist (P1) ─────────────────────────────
// Renewal alert schedule: 90 / 60 / 30 / 7 days before expiry.

export const EXPIRY_ALERTS = [90, 60, 30, 7];

export function expiryBand(days) {
  if (days === null || days === undefined || Number.isNaN(days)) {
    return 'missing';
  }
  if (days < 0) {
    return 'expired';
  }
  if (days <= 7) {
    return 'critical';
  }
  if (days <= 30) {
    return 'urgent';
  }
  if (days <= 90) {
    return 'soon';
  }
  return 'ok';
}

// Pre-renewal checklist, auto-evaluated from worker + residency docs.
// docs: { passportExp, insExp, fines }. Saudis have no Iqama chain.
export function renewalChecklist(emp, docs = {}) {
  if (!emp) {
    return [];
  }
  if (emp.saudi) {
    return [{ key: 'saudi', ok: true, detail: 'no-iqama-chain' }];
  }
  const today = new Date().toISOString().slice(0, 10);
  const pp = docs.passportExp ? daysUntil(docs.passportExp, today) : null;
  const ins = docs.insExp ? daysUntil(docs.insExp, today) : null;
  return [
    { key: 'passport', ok: pp !== null && pp >= 180, detail: pp === null ? 'missing' : `${pp}d` },
    {
      key: 'insurance',
      ok: ins !== null && ins >= 0,
      detail: ins === null ? 'missing' : `${ins}d`
    },
    { key: 'fines', ok: (docs.fines || 0) === 0, detail: `${docs.fines || 0}` },
    { key: 'gosi', ok: true, detail: 'expat-2pct' }
  ];
}

// ── Time & leave engine (P2) ─────────────────────────────────────────────
// Weekend: Fri(5)+Sat(6). days param: JS getDay() numbers to skip.

export const OT_RATE = 1.5;
export const MAX_DAY_HOURS = 11;
export const RAMADAN_DAY_HOURS = 6;
export const NORMAL_DAY_HOURS = 8;

export function isWeekend(iso, weekend = [5, 6]) {
  return weekend.includes(new Date(`${iso}T00:00:00`).getDay());
}

// Working-day count in [from..to], skipping weekend + public-holiday spans.
// holidays: [{ start, days }]
export function leaveDays(from, to, holidays = [], weekend = [5, 6]) {
  if (!from || !to || to < from) {
    return 0;
  }
  const off = new Set();
  for (const h of holidays || []) {
    const s = new Date(`${h.start}T00:00:00`);
    for (let i = 0; i < (h.days || 1); i += 1) {
      const d = new Date(s.getTime() + i * 86400000);
      off.add(d.toISOString().slice(0, 10));
    }
  }
  let n = 0;
  const cur = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  while (cur <= end) {
    const iso = cur.toISOString().slice(0, 10);
    if (!weekend.includes(cur.getDay()) && !off.has(iso)) {
      n += 1;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return n;
}

export function annualBalance(joinDate, usedDays = 0, pendingDays = 0) {
  const ent = annualEntitlement(joinDate);
  const used = (usedDays || 0) + (pendingDays || 0);
  return { entitlement: ent, used, left: Math.max(0, ent - used) };
}

// Sick pay tier by cumulative sick day in the year (Art. 117: 30 full, 60 at
// 3/4, 30 unpaid). Returns { rate, tier }.
export function sickTier(cumDay) {
  if (cumDay <= 30) {
    return { rate: 1, tier: 1 };
  }
  if (cumDay <= 90) {
    return { rate: 0.75, tier: 2 };
  }
  if (cumDay <= 120) {
    return { rate: 0, tier: 3 };
  }
  return { rate: 0, tier: 0 };
}

// Hajj: once, after 2 years of service.
export function hajjEligible(joinDate, pastHajjCount = 0) {
  if ((pastHajjCount || 0) > 0) {
    return { ok: false, reason: 'already-taken' };
  }
  if (yearsBetween(joinDate) < 2) {
    return { ok: false, reason: 'tenure-under-2y' };
  }
  return { ok: true, reason: '' };
}

// Weekend-shifted observance: Fri/Sat holiday starts move to Sunday.
export function observedHoliday(iso) {
  const d = new Date(`${iso}T00:00:00`);
  const day = d.getDay();
  if (day === 5) {
    d.setDate(d.getDate() + 2);
  } else if (day === 6) {
    d.setDate(d.getDate() + 1);
  } else {
    return { observed: iso, shifted: false };
  }
  return { observed: d.toISOString().slice(0, 10), shifted: true };
}

export function inRamadan(iso, periods = []) {
  return (periods || []).some(p => iso >= p.start && iso <= p.end);
}

// Day split for timesheets. Weekend work is all overtime. Flags >11h days.
export function timesheetDay(totalMin, { ramadan = false, weekendDay = false } = {}) {
  const cap = (ramadan ? RAMADAN_DAY_HOURS : NORMAL_DAY_HOURS) * 60;
  const regMin = weekendDay ? 0 : Math.min(totalMin, cap);
  const otMin = weekendDay ? totalMin : Math.max(0, totalMin - cap);
  return { regMin, otMin, violation: totalMin > MAX_DAY_HOURS * 60 };
}

// — P3: billing + Ajeer —
export const VAT_RATE = 0.15;

const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;

// Monthly-rate billing: daily = rate/30, OT at 1.5x the hourly slice.
export function invoiceLine(rate, days, otH) {
  const daily = rate / 30;
  const reg = daily * (days || 0);
  const otRate = (daily / 8) * OT_RATE;
  const ot = otRate * (otH || 0);
  return { daily: r2(daily), reg: r2(reg), otRate: r2(otRate), ot: r2(ot), total: r2(reg + ot) };
}

export function invoiceTotals(lines) {
  const sub = (lines || []).reduce((s, l) => s + invoiceLine(l.rate, l.days, l.otH).total, 0);
  const vat = sub * VAT_RATE;
  return { sub: r2(sub), vat: r2(vat), total: r2(sub + vat) };
}

export function permitStatus(exp, todayIso) {
  if (!exp) {
    return 'missing';
  }
  const today = todayIso || new Date().toISOString().slice(0, 10);
  if (exp < today) {
    return 'expired';
  }
  return daysUntil(exp, today) <= 30 ? 'expiring' : 'active';
}

// Beneficiary must return the worker within 1 working day (Fri/Sat skipped).
export function returnDeadline(returnedAt) {
  const d = new Date(`${returnedAt}T00:00:00`);
  do {
    d.setDate(d.getDate() + 1);
  } while (d.getDay() === 5 || d.getDay() === 6);
  return d.toISOString().slice(0, 10);
}

export function professionMatch(permitProf, empProf) {
  return !!permitProf && permitProf === empProf;
}

// Licence scope guard (D11–D12): service vs labour vs both.
export function licenceScopeOk(scope, service) {
  return scope === 'both' || scope === service;
}

// Due date = billingDay of the month after the service month (clamped to 28).
export function invoiceDue(month, billingDay) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m, 1); // first day of next month (m is 0-based next)
  const day = Math.min(Math.max(1, billingDay || 5), 28);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
}
