// P1 static audit: NAV/pages/i18n/seed-xref for visas + residency + onboarding +
// tracker + vault + org. Rebuilt from the P1 contract (post-/tmp-wipe).
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
const need = ['hr-visas', 'hr-residency', 'hr-onboarding', 'hr-tracker', 'hr-documents', 'hr-org'];
ok('nav-6-leaves', need.every((k) => nav.some((n) => n[1] === k)));
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
const pages = ['hr_visas', 'hr_residency', 'hr_onboarding', 'hr_tracker', 'hr_documents', 'hr_org_chart'];
const mods = ['visas', 'residency', 'onboarding', 'tracker', 'documents', 'org-chart'];
const roots = { visas: 'data-hr-visas', residency: 'data-hr-residency', onboarding: 'data-hr-onboarding', tracker: 'data-hr-tracker', documents: 'data-hr-documents', 'org-chart': 'data-hr-org' };
const dynamic = new Set(['ob-convert', 'ob-advance', 'ob-cost', 'res-renew', 'res-ins', 'res-fines']); // module-rendered
const used = new Set();
pages.forEach((p, i) => {
  const html = readFileSync(`${R}/production/${p}.html`, 'utf8');
  for (const m of html.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g)) {used.add(m[1]);}
  ok(`page-root-${p}`, html.includes(roots[mods[i]]), roots[mods[i]]);
  const src = readFileSync(`${R}/src/v4/${mods[i]}.js`, 'utf8');
  const ids = new Set([...src.matchAll(/getElementById\('([a-z-]+)'\)/g)].map((m) => m[1]));
  for (const id of ids) {
    if (dynamic.has(id)) {continue;}
    ok(`page-id-${p}#${id}`, html.includes(`id="${id}"`), 'missing in page');
  }
  for (const x of src.matchAll(/\bt\('([^'`$}]+)'\)/g)) {used.add(x[1]);}
});
const missing = [...used].filter((k) => !dictKeys.has(k));
ok('i18n-coverage', missing.length === 0, missing.join(', '));
console.log(`  (used=${used.size} dict=${dictKeys.size})`);

// 3. seed xref (documented P1 counts)
const seed = await import(`${R}/src/v4/hr-seed.js`);
const emps = new Set(seed.EMPLOYEES.map((e) => e.code));
ok('seed-visas-24', seed.VISAS.length === 24);
ok('seed-onboarding-4', seed.ONBOARDING.length === 4);
ok('seed-documents-19', seed.DOCUMENTS.length === 19);
ok('seed-orglinks-24', seed.ORG_LINKS.length === 24);
ok('seed-orglinks-xref', seed.ORG_LINKS.every((l) => emps.has(l.emp) && (!l.mgr || emps.has(l.mgr))));
ok('seed-docs-xref', seed.DOCUMENTS.every((d) => !d.emp || emps.has(d.emp)));

// 4. hr-api collections
const api = readFileSync(`${R}/src/v4/hr-api.js`, 'utf8');
ok('api-p1-collections', ['visaBlocks:', 'visas:', 'onboarding:', 'transfers:', 'residencyDocs:', 'documents:', 'orgLinks:'].every((k) => api.includes(k)));

console.log(fail.length ? `\nP1 AUDIT: ${fail.length} FAILURES` : '\nALL P1 CHECKS PASSED');
process.exit(fail.length ? 1 : 0);
