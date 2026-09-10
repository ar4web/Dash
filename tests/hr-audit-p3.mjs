// P3 static audit: NAV/pages/i18n/seed-xref for clients + requests +
// assignments + Ajeer + invoices.
import { readFileSync, existsSync } from 'node:fs';

const R = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const fail = [];
const ok = (name, cond, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${extra && !cond ? ` — ${extra}` : ''}`);
  if (!cond) {fail.push(name);}
};

// 1. NAV leaves -> files (multiline-safe)
const shell = readFileSync(`${R}/src/v4/shell-render.js`, 'utf8');
const nav = [...shell.matchAll(/key: '(hr-[a-z-]+)'[\s\S]{0,120}?href: '(hr_[a-z_]+\.html)'/g)];
const need = ['hr-clients', 'hr-requests', 'hr-assignments', 'hr-ajeer', 'hr-invoices'];
ok('nav-5-leaves', need.every((k) => nav.some((n) => n[1] === k)));
for (const m of nav.filter((n) => need.includes(n[1]))) {
  ok(`nav-file-${m[1]}`, existsSync(`${R}/production/${m[2]}`), m[2]);
}
const icons = new Set([...shell.matchAll(/^  ([a-z]+): ?['\n]/gm)].map((m) => m[1]));
for (const m of nav.filter((n) => need.includes(n[1]))) {
  const im = shell.match(new RegExp(`key: '${m[1]}'[\\s\\S]{0,160}?icon: '([a-z]+)'`));
  ok(`nav-icon-${m[1]}`, !!im && icons.has(im[1]), im?.[1]);
}

// 2. i18n coverage + DOM id xref
const i18nSrc = readFileSync(`${R}/src/v4/i18n.js`, 'utf8');
const dictKeys = new Set([...i18nSrc.matchAll(/'((?:nav|common|status|role|hr)\.[^']+)'\s*:/g)].map((m) => m[1]));
const pages = ['hr_clients', 'hr_requests', 'hr_assignments', 'hr_ajeer', 'hr_invoices'];
const mods = ['clients', 'requests', 'assignments', 'ajeer', 'invoices'];
const roots = { clients: 'data-hr-clients', requests: 'data-hr-requests', assignments: 'data-hr-assign', ajeer: 'data-hr-ajeer', invoices: 'data-hr-invoices' };
const used = new Set();
pages.forEach((p, i) => {
  const html = readFileSync(`${R}/production/${p}.html`, 'utf8');
  for (const m of html.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g)) {used.add(m[1]);}
  ok(`page-root-${p}`, html.includes(roots[mods[i]]), roots[mods[i]]);
  const src = readFileSync(`${R}/src/v4/${mods[i]}.js`, 'utf8');
  const ids = new Set([...src.matchAll(/getElementById\('([a-z-]+)'\)/g)].map((m) => m[1]));
  for (const id of ids) {
    ok(`page-id-${p}#${id}`, html.includes(`id="${id}"`), 'missing in page');
  }
  for (const x of src.matchAll(/\bt\('([^'`$}]+)'\)/g)) {used.add(x[1]);}
});
const missing = [...used].filter((k) => !dictKeys.has(k));
ok('i18n-coverage', missing.length === 0, missing.join(', '));
console.log(`  (used=${used.size} dict=${dictKeys.size})`);

// 3. seed xref
const seed = await import(`${R}/src/v4/hr-seed.js`);
const emps = new Set(seed.EMPLOYEES.map((e) => e.code));
const clients = new Set(seed.CLIENTS.map((c) => c.id));
const sites = new Set(seed.SITES.map((s) => s.id));
const asns = new Set(seed.ASSIGNMENTS.map((a) => a.id));
ok('seed-permits-14', seed.AJEER_PERMITS.length === 14);
ok('seed-permits-xref', seed.AJEER_PERMITS.every((p) => emps.has(p.emp) && clients.has(p.client) && sites.has(p.site) && (!p.asn || asns.has(p.asn))));
ok('seed-permit-mirrors-asn', seed.ASSIGNMENTS.filter((a) => a.ajeer).every((a) => seed.AJEER_PERMITS.some((p) => p.no === a.ajeer)));
ok('seed-one-missing-ajeer-demo', seed.ASSIGNMENTS.filter((a) => a.status === 'active' && !a.ajeer).length === 1);
ok('seed-invoices-2', seed.INVOICES.length === 2);
ok('seed-invoices-xref', seed.INVOICES.every((i) => clients.has(i.client) && (i.lines || []).every((l) => emps.has(l.emp) && sites.has(l.site))));

// 4. hr-api collections
const api = readFileSync(`${R}/src/v4/hr-api.js`, 'utf8');
ok('api-p3-collections', ['ajeerPermits:', 'invoices:'].every((k) => api.includes(k)));

console.log(fail.length ? `\nP3 AUDIT: ${fail.length} FAILURES` : '\nALL P3 CHECKS PASSED');
process.exit(fail.length ? 1 : 0);
