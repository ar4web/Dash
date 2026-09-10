// P2 static audit: NAV/pages/i18n/seed-xref for Time & Leave.
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
const need = ['hr-attendance', 'hr-shifts', 'hr-timesheets', 'hr-leave', 'hr-holidays', 'hr-leave-calendar', 'hr-approvals', 'hr-my-team'];
ok('nav-8-leaves', need.every((k) => nav.some((n) => n[1] === k)));
for (const m of nav.filter((n) => need.includes(n[1]))) {
  ok(`nav-file-${m[1]}`, existsSync(`${R}/production/${m[2]}`), m[2]);
}
const icons = new Set([...shell.matchAll(/^  ([a-z]+): ?['\n]/gm)].map((m) => m[1]));
for (const m of nav.filter((n) => need.includes(n[1]))) {
  const im = shell.match(new RegExp(`key: '${m[1]}'[\\s\\S]{0,160}?icon: '([a-z]+)'`));
  ok(`nav-icon-${m[1]}`, !!im && icons.has(im[1]), im?.[1]);
}

// 2. i18n coverage: data-i18n in 8 pages + t('') in 8 modules + DOM id xref
const i18nSrc = readFileSync(`${R}/src/v4/i18n.js`, 'utf8');
const dictKeys = new Set([...i18nSrc.matchAll(/'((?:nav|common|status|role|hr)\.[^']+)'\s*:/g)].map((m) => m[1]));
const pages = ['hr_attendance', 'hr_shifts', 'hr_timesheets', 'hr_leave', 'hr_holidays', 'hr_leave_calendar', 'hr_approvals', 'hr_my_team'];
const mods = ['attendance', 'shifts', 'timesheets', 'leave', 'holidays', 'leave-calendar', 'approvals', 'my-team'];
const roots = { attendance: 'data-hr-attendance', shifts: 'data-hr-shifts', timesheets: 'data-hr-timesheets', leave: 'data-hr-leave', holidays: 'data-hr-holidays', 'leave-calendar': 'data-hr-leavecal', approvals: 'data-hr-approvals', 'my-team': 'data-hr-myteam' };
const used = new Set();
pages.forEach((p, i) => {
  const html = readFileSync(`${R}/production/${p}.html`, 'utf8');
  for (const m of html.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g)) {used.add(m[1]);}
  ok(`page-root-${p}`, html.includes(roots[mods[i]]), roots[mods[i]]);
  const src = readFileSync(`${R}/src/v4/${mods[i]}.js`, 'utf8');
  const ids = new Set([...src.matchAll(/getElementById\('([a-z-]+)'\)/g)].map((m) => m[1]));
  ids.delete('ts-submit'); // rendered dynamically inside the detail panel
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
const sites = new Set(seed.SITES.map((s) => s.id));
ok('seed-shifts-3', seed.SHIFTS.length === 3);
ok('seed-site-shifts-xref', seed.SITE_SHIFTS.every((m) => sites.has(m.site)));
ok('seed-attendance-xref', seed.ATTENDANCE.every((r) => emps.has(r.emp) && sites.has(r.site)));
ok('seed-attendance-no-weekend', seed.ATTENDANCE.every((r) => ![5, 6].includes(new Date(`${r.date}T00:00:00`).getDay())));
ok('seed-timesheets-xref', seed.TIMESHEETS.every((x) => sites.has(x.site) && (x.lines || []).every((l) => emps.has(l.emp))));
ok('seed-leave-xref', seed.LEAVE_REQUESTS.every((r) => emps.has(r.emp)));
ok('seed-chains', seed.APPROVAL_CHAINS.length === 2 && seed.APPROVAL_CHAINS.every((c) => c.steps.length === 2));

// 4. hr-api collections
const api = readFileSync(`${R}/src/v4/hr-api.js`, 'utf8');
ok('api-p2-collections', ['shifts:', 'siteShifts:', 'attendance:', 'timesheets:', 'leaveRequests:'].every((k) => api.includes(k)));

console.log(fail.length ? `\nP2 AUDIT: ${fail.length} FAILURES` : '\nALL P2 CHECKS PASSED');
process.exit(fail.length ? 1 : 0);
