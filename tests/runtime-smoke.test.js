// Runtime smoke: mounts every HR page's real HTML + executes its real
// init modules in jsdom, asserting render output in EN and AR, plus
// write-flow probes (language toggle, goal create, review advance).
// Run: npm run test:runtime
import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { initI18n, setLang, currentLang, t, applyBranding } from '../src/v4/i18n.js';
import { mountShell } from '../src/v4/shell.js';
import {
  leaveWindows,
  returnStats,
  expiryDeck,
  iqamaBuckets,
  contractsEnding,
  perfRanking,
  invoiceTotals
} from '../src/v4/hr-statutory.js';
import { getSeed } from '../src/v4/hr-api.js';

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

describe('security', () => {
  test('imported row values render inert (stored-XSS overlay)', async () => {
    await mountPage('hr_employees');
    localStorage.setItem(
      'hr:import:employees',
      JSON.stringify([
        {
          code: 'X"><img src=c onerror="window.__xss=1">',
          nameEn: '<img src=x onerror="window.__xss=1">',
          nameAr: '<svg onload="window.__xss=1">',
          nat: '<b>bold</b>',
          prof: '"><img src=p>',
          dept: 'HR',
          st: 'active',
          q: '"><img src=q>',
          saudi: false,
          client: ''
        }
      ])
    );
    // Re-run inits so the overlay row renders (same pattern as the AR tests).
    const html = readFileSync(`${R}/production/hr_employees.html`, 'utf8');
    for (const m of html.matchAll(/from '(\/src\/v4\/[a-z0-9-]+\.js)'/g)) {
      const key = `../src/v4/${m[1].split('/').pop().replace(/\.js$/, '')}.js`;
      const mod = await loaders[key]();
      for (const [k, v] of Object.entries(mod)) {
        if (k.startsWith('init') && typeof v === 'function') {
          v();
        }
      }
    }
    expect(document.querySelector('#emp-rows img')).toBeNull();
    expect(document.querySelector('#emp-rows b')).toBeNull();
    const body = document.querySelector('#emp-rows').textContent;
    expect(body).toContain('<img src=x');
    expect(body).toContain('<svg onload');
    expect(body).toContain('<b>bold</b>');
    const link = document.querySelector('#emp-rows a[href*="hr_employee.html?code=X"]');
    expect(link?.getAttribute('href')).toContain('X%22%3E');
    expect(window.__xss).toBeUndefined();
  });

  test('gateway lists roles and remembers the pick', async () => {
    await mountPage('landing');
    expect(document.querySelector('.sidebar-nav')).toBeNull();
    const cards = [...document.querySelectorAll('#gw-roles .gw-card')];
    expect(cards.length).toBe(9);
    document.querySelector('#gw-roles [data-role="employee"]').click();
    expect(localStorage.getItem('hr:role-view')).toBe('employee');
    document.querySelector('#gw-lang [data-lang="ar"]').click();
    expect(document.querySelector('#gw-roles [data-role="admin"] strong')?.textContent).toBe(
      'مدير النظام'
    );
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

describe('command center', () => {
  test('header + Zone A money render with live values', async () => {
    await mountPage('hr_dashboard');
    const head = document.getElementById('dash-head').textContent;
    expect(head).toContain('1448');
    expect(head).toContain('2026');
    expect(head).toContain('3');
    expect(document.querySelector('#dash-head a[href="hr_settings.html"]')).toBeTruthy();
    const cards = [...document.querySelectorAll('#money-cards .stat-value')].map(
      e => e.textContent
    );
    expect(cards.length).toBe(4);
    expect(cards[0]).toContain('64,600');
    expect(cards[2]).toContain('789');
    expect(document.getElementById('zone-money-meta').textContent).toContain('1.22%');
    // Thin-margin insight fires (1.22% < 5%).
    expect(document.getElementById('money-net').textContent).toMatch(/5%|٥٪/);
    expect(document.getElementById('money-formula').textContent).toContain('(18)');
    const clients = [...document.querySelectorAll('#top-clients tbody tr')];
    expect(clients.length).toBe(2);
    expect(clients[0].textContent).toContain('Facility Care');
  });

  test('charts carry screen-reader summaries (canvas or fallback)', async () => {
    await mountPage('hr_dashboard');
    for (const id of ['chart-runway', 'chart-headcount', 'chart-tenure', 'chart-separation']) {
      const el = document.getElementById(id);
      expect(el.getAttribute('role')).toBe('img');
      expect(el.getAttribute('aria-label')?.length).toBeGreaterThan(20);
    }
    // jsdom has no canvas: helper must degrade gracefully, not throw.
    const deadline = Date.now() + 4000;
    while (Date.now() < deadline) {
      const states = ['chart-runway', 'chart-headcount', 'chart-tenure', 'chart-separation'].map(
        id => document.getElementById(id)
      );
      if (
        states.every(el => el.querySelector('canvas') || el.hasAttribute('data-chart-fallback'))
      ) {
        break;
      }
      await new Promise(r => setTimeout(r, 100));
    }
    for (const id of ['chart-runway', 'chart-headcount', 'chart-tenure', 'chart-separation']) {
      const el = document.getElementById(id);
      expect(el.querySelector('canvas') || el.getAttribute('data-chart-fallback')).toBeTruthy();
    }
  });

  test('§1 huroob card links the case file; zones remember collapse', async () => {
    await mountPage('hr_dashboard');
    const card = document.getElementById('huroob-card');
    expect(card.textContent).toMatch(/Huroob|هروب/);
    expect(card.querySelector('a[href*="EMP-0027"]')).toBeTruthy();
    const zones = [...document.querySelectorAll('details.zone[data-zone]')];
    expect(zones.length).toBe(6);
    const money = document.querySelector('details.zone[data-zone="money"]');
    money.open = false;
    money.dispatchEvent(new Event('toggle'));
    expect(localStorage.getItem('hr:ui:zone:money')).toBe('0');
  });

  test('§2 leave pipeline matches the engine', async () => {
    await mountPage('hr_dashboard');
    const w = leaveWindows(getSeed('leaveRequests'));
    const cards = [...document.querySelectorAll('#vac-cards .stat-value')].map(e =>
      Number(e.textContent)
    );
    expect(cards).toEqual([w.onVacation.length, w.departing.length, w.returning.length]);
    const groups = [...document.querySelectorAll('#vac-list .vac-group')];
    expect(groups.length).toBe(3);
    expect(document.getElementById('zone-leave-meta').textContent).toContain(
      String(w.onVacation.length)
    );
    const rs = returnStats(getSeed('leaveRequests'));
    expect(document.getElementById('chart-return').getAttribute('aria-label')).toContain(
      `${rs.pct}%`
    );
    const overdueRows = document.querySelectorAll('#overdue-table tbody tr');
    expect(overdueRows.length).toBe(rs.overdue);
    expect(document.getElementById('overdue-table').textContent).toMatch(
      /Flight delay|تأخر رحلة الطيران/
    );
    expect(
      document.getElementById('chart-delayreasons').getAttribute('aria-label')?.length
    ).toBeGreaterThan(20);
    const eligRows = document.querySelectorAll('#eligible-table tbody tr');
    expect(eligRows.length).toBeGreaterThan(10);
    expect(eligRows[0].querySelector('a[href="hr_leave.html"]')).toBeTruthy();
  });

  test('§3 geo renders map data, roster and mixes', async () => {
    await mountPage('hr_dashboard');
    const map = document.getElementById('site-map');
    expect(map.getAttribute('data-marker-count')).toBe('6');
    expect(map.getAttribute('data-client-pins')).toBe('2');
    expect(map.getAttribute('aria-label')).toContain('6');
    const roster = document.getElementById('site-roster');
    expect(roster.textContent).toContain('KAFD');
    expect(roster.querySelectorAll('tbody tr').length).toBe(6);
    expect(document.getElementById('city-chips').textContent).toContain('Riyadh');
    expect(document.getElementById('zone-geo-meta').textContent).toContain('6');
    for (const id of ['chart-nationality', 'chart-saudiexp', 'chart-gender', 'chart-profession']) {
      const el = document.getElementById(id);
      expect(el.getAttribute('role')).toBe('img');
      expect(el.getAttribute('aria-label')?.length).toBeGreaterThan(10);
    }
    expect(document.getElementById('chart-nationality').getAttribute('aria-label')).toContain(
      '(24)'
    );
    const mx = [...document.querySelectorAll('#sponsor-matrix tbody tr')];
    expect(mx.length).toBe(2);
    expect(mx[0].textContent).toContain('22');
    expect(mx[1].textContent).toContain('2');
    expect(document.querySelectorAll('#skills-cloud .skill-tag').length).toBeGreaterThan(10);
  });

  test('§4 compliance shield matches the engine', async () => {
    await mountPage('hr_dashboard');
    const chips = document.getElementById('compliance-chips').textContent;
    expect(chips).toContain('Qiwa');
    expect(chips).toContain('WPS');
    expect(chips).toContain('GOSI');
    expect(document.getElementById('nitaqat-meter').textContent).toContain('18.1%');
    const ajNums = [...document.querySelectorAll('#ajeer-validity strong')].map(e =>
      Number(e.textContent)
    );
    expect(ajNums.length).toBe(4);
    expect(ajNums.reduce((x, y) => x + y, 0)).toBe(18);
    expect(document.getElementById('levy-card').textContent).toContain('15,200');
    const bk = iqamaBuckets(getSeed('employees'));
    expect(document.getElementById('iqama-buckets').textContent).toContain(`≤30: ${bk.le30}`);
    const deck = expiryDeck(getSeed('employees'), getSeed('residencyDocs'));
    for (const [id, bands] of [
      ['chart-exp-iqama', deck.iqama],
      ['chart-exp-passport', deck.passport],
      ['chart-exp-insurance', deck.insurance]
    ]) {
      const label = document.getElementById(id).getAttribute('aria-label');
      expect(label).toContain(`Valid ${bands.valid}`);
    }
    const cols = [...document.querySelectorAll('#transfer-kanban .kanban-col')];
    expect(cols.length).toBe(4);
    expect(cols.every(c => c.querySelectorAll('.kanban-card').length === 1)).toBe(true);
    expect(document.getElementById('transfer-kanban').textContent).toContain('QX-2026-022');
    const watch = contractsEnding(getSeed('contracts'), 90);
    const watchRows = document.querySelectorAll('#contracts-watch tbody tr');
    expect(watchRows.length).toBe(watch.length);
    if (watch.length) {
      expect(watchRows[0].textContent).toContain(watch[0].id);
    }
    expect(document.getElementById('zone-compliance-meta').textContent.length).toBeGreaterThan(0);
  });

  test('§5 money + performance matrix match the engine', async () => {
    await mountPage('hr_dashboard');
    const cats = getSeed('expenseCategories');
    const exLabel = document.getElementById('chart-expense').getAttribute('aria-label');
    expect(exLabel).toContain(cats[0].en);
    const inv = getSeed('invoices');
    const billRows = document.querySelectorAll('#billing-history tbody tr');
    expect(billRows.length).toBe(inv.length);
    expect(billRows[0].textContent).toContain(inv[0].month);
    expect(billRows[0].textContent).toContain(
      Math.round(invoiceTotals(inv[0].lines).total).toLocaleString('en-US')
    );
    const rank = perfRanking({
      attendance: getSeed('attendance'),
      goals: getSeed('goals'),
      feedback: getSeed('feedback'),
      timesheets: getSeed('timesheets')
    });
    const topRows = document.querySelectorAll('#perf-top tbody tr');
    const botRows = document.querySelectorAll('#perf-bottom tbody tr');
    expect(topRows.length).toBe(5);
    expect(botRows.length).toBe(5);
    expect(topRows[0].textContent).toContain(String(rank[0].index));
    const trendLabel = document.getElementById('chart-perf-trend').getAttribute('aria-label');
    expect(trendLabel).toContain('Top 5');
    expect(trendLabel).toContain(String(rank[rank.length - 1].index));
    expect(document.querySelector('[data-i18n="hr.dashboard.perfFormula"]').textContent).toContain(
      '40%'
    );
  });

  test('Arabic re-render flips chart summaries', async () => {
    await mountPage('hr_dashboard');
    setLang('ar');
    applyBranding();
    expect(document.getElementById('chart-tenure').getAttribute('aria-label')).toContain(
      'مدد الخدمة'
    );
    expect(document.getElementById('dash-head').textContent).toContain('نطاقات');
    setLang('en');
  });
});
