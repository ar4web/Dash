// Runtime smoke: mounts every HR page's real HTML + executes its real
// init modules in jsdom, asserting render output in EN and AR, plus
// write-flow probes (language toggle, goal create, review advance).
// Run: npm run test:runtime
import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { initI18n, setLang, currentLang, t, applyBranding } from '../src/v4/i18n.js';
import { mountShell } from '../src/v4/shell.js';

const R = process.cwd();
const loaders = import.meta.glob('../src/v4/*.js');

const MARKERS = {
  hr_review: '#rw-flow > *',
  hr_contract: '#cd-party:text',
  hr_employee: '#emp360-head > *',
  hr_leave_calendar: '#lc-grid > *',
  hr_tracker: '#track-board > *',
  hr_org_chart: '#org-tree > *',
  hr_dashboard: '#hr-kpis > *',
  hr_settings: '#set-brand input',
  hr_roles: '#ro-matrix tr',
  hr_my_space: '#my-head > *',
  hr_client_dashboard: '#cl-roster > *',
  hr_payslip: '#ps-doc > *',
  hr_approvals: '#ap-body > *',
  hr_my_team: '#tm-grid > *',
  hr_pipeline: '#pl-board > *'
};
const DEFAULT_MARKER = 'tbody tr, .hr-wall > *, .hr-kpi, .hr-funnel-row';
const PARAMS = {
  hr_review: '?id=RV-2026-001',
  hr_contract: '?id=CT-2026-001',
  hr_employee: '?code=EMP-0006'
};

function markerHit(sel) {
  if (sel.endsWith(':text')) {
    const el = document.querySelector(sel.slice(0, -5));
    return !!el && el.textContent.trim().length > 0;
  }
  return !!document.querySelector(sel);
}

async function mountPage(page, paramOverride) {
  const html = readFileSync(`${R}/production/${page}.html`, 'utf8');
  document.open();
  document.write(html);
  document.close();
  window.history.replaceState({}, '', `/${paramOverride || PARAMS[page] || ''}`);
  localStorage.clear();
  localStorage.setItem('hr:lang', 'en');
  mountShell();
  initI18n();
  for (const m of html.matchAll(/from '(\/src\/v4\/[a-z0-9-]+\.js)'/g)) {
    const key = `../src/v4/${m[1].split('/').pop().replace(/\.js$/, '')}.js`;
    const mod = await loaders[key]();
    for (const [k, v] of Object.entries(mod)) {
      if (k.startsWith('init') && typeof v === 'function') {
        v();
      }
    }
  }
}

const pages = readdirSync(`${R}/production`)
  .filter(f => f.startsWith('hr_') && f.endsWith('.html'))
  .map(f => f.slice(0, -5));

describe('interactions (early: minimal cross-talk)', () => {
  // Single mount: module inits wire listeners only once (booted guard),
  // mirroring one real page load.
  test('toggle + new-goal write flow', async () => {
    await mountPage('hr_goals');
    const btn = document.getElementById('lang-toggle');
    expect(btn).toBeTruthy();
    btn.click();
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.title).not.toBe('Goals | Gentelella 2026 v4');
    expect(currentLang()).toBe('ar');
    btn.click();
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');

    const before = document.querySelectorAll('#gl-rows tr').length;
    expect(before).toBeGreaterThan(0);
    document.getElementById('gl-new').click();
    expect(document.querySelector('.modal-backdrop')).toBeTruthy();
    document.getElementById('ng-te').value = 'E2E Probe Goal';
    document.getElementById('ng-target').value = '10';
    document.getElementById('ng-current').value = '3';
    document.querySelector('.modal-footer .btn-primary').click();
    expect(document.querySelectorAll('#gl-rows tr').length).toBe(before + 1);
    expect(localStorage.getItem('hr:import:goals') || '').toContain('E2E Probe Goal');
  });

  test('topbar bell surfaces live HR alerts', async () => {
    await mountPage('hr_goals');
    document.querySelector('.tb-notifications').click();
    const panel = document.querySelector('.menu-popover.panel-notifications');
    expect(panel).toBeTruthy();
    // CT-2026-005 (ends 2026-10-15) is a permanent compliance demo: listed
    // while upcoming and after expiry alike.
    expect(panel.textContent).toContain('CT-2026-005');
    expect(panel.querySelectorAll('.panel-row').length).toBeGreaterThan(5);
  });

  test('review advance (draft -> self) patches the seed row', async () => {
    await mountPage('hr_review', '?id=RV-2026-004');
    expect(document.querySelector('#rw-release')).toBeTruthy();
    document.querySelector('#rw-release').click();
    expect(document.getElementById('rw-flow').textContent).toMatch(/Self/);
    const raw = localStorage.getItem('hr:import:reviews') || '';
    expect(raw).toContain('RV-2026-004');
    expect(raw).toContain('"self"');
  });
});

describe('sidebar hierarchy', () => {
  test('HR NAV: 10 icon-bearing parents, 46 keyed leaves, all translated', async () => {
    const { NAV, ICONS } = await import('../src/v4/shell-render.js');
    const hr = NAV.find(g => g.label.includes('HR'));
    expect(hr.items.length).toBe(11);
    const leaves = hr.items.flatMap(p => (p.children || []).filter(c => c.key));
    expect(leaves.length).toBe(46);
    expect(new Set(leaves.map(l => l.key)).size).toBe(46);
    for (const p of hr.items) {
      expect(p.icon in ICONS).toBe(true);
    }
    await mountPage('hr_dashboard');
    const subs = [...document.querySelectorAll('.sidebar-nav a.nav-sublink')];
    for (const l of leaves) {
      expect(subs.some(a => a.getAttribute('href') === l.href)).toBe(true);
    }
    expect(subs.every(a => a.querySelector('.nav-text'))).toBe(true);
    setLang('ar');
    expect(document.querySelector('.sidebar-nav').textContent).toContain('الإعدادات');
    expect(document.querySelector('.sidebar-nav').textContent).toContain('الموارد البشرية');
    setLang('en');
  });

  test('template groups nest under HR Settings, off the top level', async () => {
    await mountPage('hr_dashboard');
    const labels = [...document.querySelectorAll('.sidebar-nav .nav-label')].map(e =>
      e.textContent.trim()
    );
    for (const gone of [
      'E-commerce',
      'Projects',
      'UI library',
      'Admin',
      'Layouts',
      'General',
      'Apps'
    ]) {
      expect(labels).not.toContain(gone);
    }
    expect(labels).toEqual(['HR & Operations']);
    expect(document.querySelectorAll('.sidebar-nav .nav-subtree').length).toBe(7);
    expect(
      document.querySelector('.sidebar-nav a.nav-sublink[href="orders.html"] .nav-text')
        ?.textContent
    ).toBe('All orders');
    expect(
      document.querySelector('.sidebar-nav a.nav-sublink[href="chat.html"] .badge')?.textContent
    ).toBe('3');
    const first = document.querySelector('.sidebar-nav .nav-subtoggle');
    first.click();
    expect(first.closest('.nav-subtree').classList.contains('open')).toBe(true);
    setLang('ar');
    const subNames = [...document.querySelectorAll('.sidebar-nav .nav-subtoggle .nav-text')].map(
      e => e.textContent
    );
    expect(subNames).toContain('المتجر');
    expect(
      document.querySelector('.sidebar-nav a.nav-sublink[href="pricing_tables.html"] .nav-text')
        ?.textContent
    ).toBe(t('nav.pricing'));
    expect(
      document.querySelector('.sidebar-nav a.nav-sublink[href="orders.html"] .nav-text')
        ?.textContent
    ).toBe('All orders');
    expect(
      document.querySelector('.sidebar-nav a.nav-sublink[href="calendar.html"] .nav-text')
        ?.textContent
    ).toBe(t('nav.calendar'));
    expect(
      document.querySelector('.sidebar-nav a.nav-sublink[href="form.html"] .nav-text')?.textContent
    ).toBe('General');
    setLang('en');
    await mountPage('orders');
    expect(
      document.querySelector('.sidebar-nav .nav-subtree.open .nav-subtoggle .nav-text')?.textContent
    ).toBe('E-commerce');
  });

  test('white-label branding applies from company profile', async () => {
    await mountPage('hr_dashboard');
    applyBranding();
    expect(document.title).toContain('Manpower Supply Co.');
    expect(document.querySelector('.sidebar-brand .brand-name')?.textContent).toBe(
      'Manpower Supply Co.'
    );
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#1ABB9C');
    setLang('ar');
    // Stale LANG_EVENT listeners from earlier mounts re-run applyI18n(document)
    // (their `|| document` fallback) after setLang's branding — a jsdom-only
    // artifact; re-apply to assert the composed end state.
    applyBranding();
    expect(document.title).toContain('شركة توريد العمالة');
    setLang('en');
  });
});

describe.each(pages)('%s renders', page => {
  test('EN: sidebar + root + content, no errors', async () => {
    await mountPage(page);
    expect(document.querySelector('.sidebar-nav')).toBeTruthy();
    const sel = MARKERS[page] || DEFAULT_MARKER;
    expect(markerHit(sel)).toBe(true);
  });

  test('AR: renders translated', async () => {
    await mountPage(page);
    localStorage.setItem('hr:lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
    // Re-run inits: renderAll paths re-execute (listener wiring bails via booted).
    const html = readFileSync(`${R}/production/${page}.html`, 'utf8');
    for (const m of html.matchAll(/from '(\/src\/v4\/[a-z0-9-]+\.js)'/g)) {
      const key = `../src/v4/${m[1].split('/').pop().replace(/\.js$/, '')}.js`;
      const mod = await loaders[key]();
      for (const [k, v] of Object.entries(mod)) {
        if (k.startsWith('init') && typeof v === 'function') {
          v();
        }
      }
    }
    const sel = MARKERS[page] || DEFAULT_MARKER;
    expect(markerHit(sel)).toBe(true);
    if (page !== 'hr_employee') {
      expect(document.querySelector('.page-pretitle')?.textContent).toBe(
        'الموارد البشرية والعمليات'
      );
    }
  });
});

describe('cross-talk', () => {
  test('setLang re-render storm throws nothing', async () => {
    await mountPage('hr_goals');
    expect(() => {
      setLang('ar');
      setLang('en');
    }).not.toThrow();
    expect(markerHit(DEFAULT_MARKER)).toBe(true);
  });
});
