// HR + Operations — command dashboard (hr_dashboard.html). Stat cards + alerts +
// deployment mix bars + upcoming expiries. Idempotent.

import { ICONS } from './shell-render.js';
import { t, currentLang, LANG_EVENT, applyI18n } from './i18n.js';
import { fmtSAR, fmtDate } from './hr-locale.js';
import { daysUntil, nitaqatEstimate, ajeerCheck, getSettings } from './hr-statutory.js';
import { getSeed } from './hr-api.js';
import { CLIENTS } from './hr-seed.js';

let booted = false;

function L(en, ar) {
  return currentLang() === 'ar' ? ar : en;
}

function alerts() {
  const out = [];
  const emps = getSeed('employees');
  getSeed('assignments').forEach(a => {
    const e = emps.find(x => x.code === a.emp);
    const c = CLIENTS.find(x => x.id === a.client);
    if (!e) {
      return;
    }
    const g = ajeerCheck(a, e, c);
    if (!g.ok) {
      out.push({
        sev:
          g.reasons.includes('no-ajeer-ref') || g.reasons.includes('ajeer-expired')
            ? 'red'
            : 'yellow',
        text: `${a.id} · ${currentLang() === 'ar' ? e.nameAr : e.nameEn} — ${g.reasons.join(', ')}`,
        href: `hr_employee.html?code=${e.code}`
      });
    }
  });
  emps
    .filter(e => !e.saudi && e.st === 'active')
    .forEach(e => {
      if (!e.iqamaExp) {
        out.push({
          sev: 'red',
          text: `${L('Missing Iqama expiry', 'تاريخ انتهاء الإقامة مفقود')} · ${currentLang() === 'ar' ? e.nameAr : e.nameEn}`,
          href: `hr_employee.html?code=${e.code}`
        });
        return;
      }
      const d = daysUntil(e.iqamaExp);
      if (d <= 90) {
        out.push({
          sev: d <= 30 ? 'red' : 'yellow',
          text: `${L('Iqama', 'الإقامة')} ${fmtDate(e.iqamaExp)} (${d}${L('d', 'ي')}) · ${currentLang() === 'ar' ? e.nameAr : e.nameEn}`,
          href: `hr_employee.html?code=${e.code}`
        });
      }
    });
  const rank = { red: 0, yellow: 1 };
  return out.sort((a, b) => rank[a.sev] - rank[b.sev]);
}

function renderKpis() {
  const grid = document.getElementById('hr-kpis');
  if (!grid) {
    return;
  }
  const emps = getSeed('employees');
  const assigns = getSeed('assignments');
  const n = nitaqatEstimate(emps);
  const deployed = new Set(assigns.map(a => a.emp)).size;
  const bench = emps.filter(
    e => !e.saudi && e.st === 'active' && !assigns.some(a => a.emp === e.code)
  ).length;
  const payroll = emps
    .filter(e => e.st !== 'inactive')
    .reduce((s, e) => s + (e.basic || 0) + (e.housing || 0) + (e.transport || 0), 0);
  const monthly = assigns.reduce((s, a) => s + (a.rate || 0), 0);
  const blocked = assigns.filter(a => {
    const e = emps.find(x => x.code === a.emp);
    return (
      e &&
      !ajeerCheck(
        a,
        e,
        CLIENTS.find(c => c.id === a.client)
      ).ok
    );
  }).length;
  const cards = [
    {
      icon: 'users',
      color: 'teal',
      label: L('Workforce', 'القوى العاملة'),
      value: emps.length,
      sub: `${n.saudis} SA · ${n.expats} ${L('expat', 'أجنبي')}`,
      href: 'hr_employees.html'
    },
    {
      icon: 'briefcase',
      color: 'blue',
      label: L('Deployed', 'موزعون'),
      value: deployed,
      sub: `${L('Bench', 'احتياطي')}: ${bench}`,
      href: 'hr_employees.html'
    },
    {
      icon: 'shield',
      color: blocked ? 'red' : 'green',
      label: L('Compliance', 'الامتثال'),
      value: blocked ? `${blocked} ⚠` : '✓',
      sub: `${alerts().length} ${L('open actions', 'إجراءات مفتوحة')}`,
      href: 'hr_sa_compliance.html'
    },
    {
      icon: 'flag',
      color: 'yellow',
      label: `${L('Saudization', 'السعودة')} (${L('est.', 'تقديري')})`,
      value: `${n.pct}%`,
      sub: `${L('Target', 'المستهدف')}: ${getSettings().nitaqat.target}%`,
      href: 'hr_sa_compliance.html'
    },
    {
      icon: 'wallet',
      color: 'purple',
      label: L('Monthly payroll', 'الرواتب الشهرية'),
      value: fmtSAR(payroll),
      sub: L('Basic + housing + transport', 'أساسي + سكن + مواصلات'),
      href: 'hr_client_dashboard.html'
    },
    {
      icon: 'doc',
      color: 'green',
      label: L('Deployment billing/mo', 'فوترة التوزيع/شهر'),
      value: fmtSAR(monthly),
      sub: `${assigns.length} ${L('assignments', 'تكليفًا')}`,
      href: 'hr_client_dashboard.html'
    }
  ];
  grid.innerHTML = cards
    .map(
      c => `
    <a class="card hr-card-link" href="${c.href}">
      <div class="stat">
        <div class="stat-icon ${c.color}">${ICONS[c.icon] || ''}</div>
        <div class="stat-content">
          <div class="stat-label">${c.label}</div>
          <div class="stat-value-row"><span class="stat-value">${c.value}</span></div>
          <div class="stat-subtext">${c.sub}</div>
        </div>
      </div>
    </a>`
    )
    .join('');
}

function renderAlerts() {
  const el = document.getElementById('hr-alerts');
  if (!el) {
    return;
  }
  const items = alerts().slice(0, 8);
  el.innerHTML = items.length
    ? items
        .map(
          a => `
    <a class="hr-alert hr-alert-${a.sev}" href="${a.href}">
      <span class="status status-${a.sev}">${a.sev === 'red' ? t('common.urgent') : t('common.attention')}</span>
      <span>${a.text}</span>
    </a>`
        )
        .join('')
    : `<div class="hr-empty">${t('common.noData')}</div>`;
}

function renderExpiries() {
  const el = document.getElementById('hr-expiries');
  if (!el) {
    return;
  }
  const rows = getSeed('employees')
    .filter(e => !e.saudi && e.iqamaExp)
    .map(e => ({ e, d: daysUntil(e.iqamaExp) }))
    .filter(r => r.d <= 120)
    .sort((a, b) => a.d - b.d)
    .slice(0, 6);
  el.innerHTML = rows.length
    ? '<div class="table-responsive"><table class="table hr-table"><tbody>' +
      rows
        .map(
          ({ e, d }) => `<tr>
      <td data-label="${L('Worker', 'الموظف')}"><a href="hr_employee.html?code=${e.code}">${currentLang() === 'ar' ? e.nameAr || e.nameEn : e.nameEn}</a></td>
      <td data-label="${L('Expiry', 'الانتهاء')}">${fmtDate(e.iqamaExp)}</td>
      <td data-label="${t('common.status')}"><span class="status status-${d <= 30 ? 'red' : 'yellow'}">${d}${L('d', 'ي')}</span></td>
    </tr>`
        )
        .join('') +
      '</tbody></table></div>'
    : `<div class="hr-empty">${t('common.noData')}</div>`;
}

function renderMix() {
  const el = document.getElementById('hr-deploy');
  if (!el) {
    return;
  }
  const assigns = getSeed('assignments');
  const emps = getSeed('employees');
  const bench = emps.filter(
    e => !e.saudi && e.st === 'active' && !assigns.some(a => a.emp === e.code)
  ).length;
  const rows = CLIENTS.map((c, i) => ({
    label: currentLang() === 'ar' ? c.nameAr : c.nameEn,
    n: assigns.filter(a => a.client === c.id).length,
    color: ['var(--primary)', 'var(--blue)', 'var(--purple)'][i % 3]
  }));
  rows.push({ label: L('Bench', 'احتياطي'), n: bench, color: 'var(--yellow)' });
  const max = Math.max(1, ...rows.map(r => r.n));
  el.innerHTML = rows
    .map(
      r => `
    <div class="hr-bar-row">
      <div class="hr-bar-top"><span>${r.label}</span><strong>${r.n}</strong></div>
      <div class="hr-bar-track"><div class="hr-bar-fill" style="width:${Math.round((r.n / max) * 100)}%;background:${r.color}"></div></div>
    </div>`
    )
    .join('');
}

function renderAll() {
  renderKpis();
  renderAlerts();
  renderExpiries();
  renderMix();
  applyI18n(document.querySelector('[data-hr-dashboard]') || document);
}

export function initHrDashboard() {
  const root = document.querySelector('[data-hr-dashboard]');
  if (!root) {
    return;
  }
  renderAll();
  if (booted) {
    return;
  }
  booted = true;
  window.addEventListener(LANG_EVENT, renderAll);
}
