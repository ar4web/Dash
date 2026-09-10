// HR + Operations — CEO Command Center (hr_dashboard.html). Header strip +
// Zone A business health + §1 workforce dynamics + legacy stat cards, alerts,
// deployment mix and expiries (later zones subsume the legacy cards). Idempotent.

import { ICONS } from './shell-render.js';
import { t, currentLang, LANG_EVENT, applyI18n } from './i18n.js';
import { fmtSAR, fmtDate, fmtHijri } from './hr-locale.js';
import {
  daysUntil,
  nitaqatEstimate,
  ajeerCheck,
  getSettings,
  execMoney,
  headcountByStatus,
  tenureBuckets,
  separationSeries
} from './hr-statutory.js';
import { getSeed } from './hr-api.js';
import { CLIENTS } from './hr-seed.js';
import { renderEchart } from './chart-helper.js';
import { escapeHtml as esc } from './markup.js';

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
    .filter(e => e.st !== 'inactive' && e.st !== 'exited' && e.st !== 'huroob')
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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function setupSteps() {
  const s = getSettings();
  return [
    { done: !!(s.company.cr && !String(s.company.cr).includes('XXX')) },
    { done: !!(s.nitaqat.activity && s.nitaqat.target > 0) },
    { done: s.licence.confirmed === true }
  ];
}

function renderHead() {
  const el = document.getElementById('dash-head');
  if (!el) {
    return;
  }
  const today = todayIso();
  const s = getSettings();
  const n = nitaqatEstimate(getSeed('employees'), s.nitaqat.target || 0);
  const steps = setupSteps();
  const left = steps.filter(x => !x.done).length;
  const tone = s.nitaqat.target > 0 ? (n.pct >= s.nitaqat.target ? 'green' : 'yellow') : 'blue';
  el.innerHTML = `
    <div class="dash-dates">
      <strong>${esc(fmtHijri(today))}</strong>
      <span>${esc(fmtDate(today))}</span>
    </div>
    <div class="dash-chips">
      <span class="status status-${tone}">${esc(t('hr.dashboard.nitaqat'))} ${esc(String(n.pct))}%${s.nitaqat.target > 0 ? ` / ${esc(String(s.nitaqat.target))}%` : ''}</span>
      ${
        left
          ? `<a class="status status-yellow" href="hr_settings.html" style="text-decoration:none">${left} ${esc(t('hr.dashboard.setupSteps'))}</a>`
          : `<span class="status status-green">${esc(L('All set', 'تم الإعداد'))}</span>`
      }
    </div>`;
}

function marginTone(pct) {
  if (pct >= 15) {
    return 'green';
  }
  if (pct >= 5) {
    return 'yellow';
  }
  return 'red';
}

function moneyCard({ icon, color, label, value, sub, href }) {
  return `
    <a class="card hr-card-link" href="${esc(href)}">
      <div class="stat">
        <div class="stat-icon ${esc(color)}">${ICONS[icon] || ''}</div>
        <div class="stat-content">
          <div class="stat-label">${esc(label)}</div>
          <div class="stat-value-row"><span class="stat-value">${esc(value)}</span></div>
          <div class="stat-subtext">${esc(sub)}</div>
        </div>
      </div>
    </a>`;
}

function clientName(id) {
  const c = CLIENTS.find(x => x.id === id);
  if (!c) {
    return id;
  }
  return currentLang() === 'ar' ? c.nameAr || c.nameEn : c.nameEn;
}

function renderZoneA() {
  if (!document.getElementById('money-cards')) {
    return;
  }
  const s = getSettings();
  const money = execMoney({
    employees: getSeed('employees'),
    assignments: getSeed('assignments'),
    invoices: getSeed('invoices'),
    targetPct: s.nitaqat.target || 0,
    todayIso: todayIso()
  });
  const tone = marginTone(money.crewMarginPct);
  document.getElementById('money-cards').innerHTML =
    moneyCard({
      icon: 'wallet',
      color: 'green',
      label: t('hr.dashboard.revenue'),
      value: fmtSAR(money.revenue),
      sub: `${money.crewHeads} ${t('hr.dashboard.heads')}`,
      href: 'hr_client_dashboard.html'
    }) +
    moneyCard({
      icon: 'briefcase',
      color: 'blue',
      label: t('hr.dashboard.crewCost'),
      value: fmtSAR(money.crewCost),
      sub: `${L('Pay + levy + GOSI', 'الأجر + المقابل + التأمينات')}`,
      href: 'hr_payroll.html'
    }) +
    moneyCard({
      icon: 'flag',
      color: tone,
      label: t('hr.dashboard.crewMargin'),
      value: fmtSAR(money.crewMargin),
      sub: `${money.crewMarginPct}%`,
      href: 'hr_client_dashboard.html'
    }) +
    moneyCard({
      icon: 'doc',
      color: money.receivables > 0 ? 'yellow' : 'green',
      label: t('hr.dashboard.receivables'),
      value: fmtSAR(money.receivables),
      sub: L('Unpaid invoices', 'فواتير غير مسددة'),
      href: 'hr_invoices.html'
    });

  const meta = document.getElementById('zone-money-meta');
  if (meta) {
    meta.innerHTML = `<span class="status status-${tone}">${money.crewMarginPct}%</span>`;
  }

  // Runway chart: contracted revenue bars + flat current-cost line.
  const months = money.runway.map(r => r.month.slice(2).split('-').reverse().join('/'));
  renderEchart(
    document.getElementById('chart-runway'),
    tk => ({
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: tk.textMuted, fontSize: 11 } },
      grid: { left: 8, right: 8, top: 12, bottom: 52, containLabel: true },
      xAxis: { type: 'category', data: months, axisLabel: { color: tk.textMuted, fontSize: 10 } },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: tk.borderLight, type: [4, 3] } } },
      series: [
        {
          name: L('Revenue', 'الإيراد'),
          type: 'bar',
          data: money.runway.map(r => r.revenue),
          itemStyle: { color: tk.primary, borderRadius: [4, 4, 0, 0] }
        },
        {
          name: L('Cost', 'التكلفة'),
          type: 'line',
          data: money.runway.map(r => r.cost),
          lineStyle: { color: tk.red, type: 'dashed', width: 2 },
          itemStyle: { color: tk.red },
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    }),
    L(
      `Contracted revenue ${fmtSAR(money.runway[0].revenue)} now, ${fmtSAR(money.runway[5].revenue)} in ${money.runway[5].month}; current cost ${fmtSAR(money.cost)} per month.`,
      `الإيراد المتعاقد عليه ${fmtSAR(money.runway[0].revenue)} حاليًا و${fmtSAR(money.runway[5].revenue)} في ${money.runway[5].month}؛ التكلفة الحالية ${fmtSAR(money.cost)} شهريًا.`
    ),
    { rtl: 'time' }
  );

  const tc = document.getElementById('top-clients');
  if (tc) {
    tc.innerHTML =
      '<div class="table-responsive"><table class="table hr-table"><tbody>' +
      money.perClient
        .map(
          c => `<tr>
      <td><strong>${esc(clientName(c.id))}</strong><br><small style="color:var(--text-muted)">${c.heads} ${esc(t('hr.dashboard.heads'))}</small></td>
      <td dir="ltr" style="text-align:end">${esc(fmtSAR(c.revenue))}</td>
      <td dir="ltr" style="text-align:end"><span class="status status-${c.margin >= 0 ? 'green' : 'red'}">${esc(fmtSAR(c.margin))}</span></td>
    </tr>`
        )
        .join('') +
      '</tbody></table></div>';
  }

  const net = document.getElementById('money-net');
  if (net) {
    net.innerHTML = `
      <div class="hr-bar-row">
        <div class="hr-bar-top"><span>${esc(t('hr.dashboard.overhead'))}</span><strong>${esc(fmtSAR(money.overhead))}</strong></div>
        <div class="stat-subtext">${money.overheadHeads} ${esc(t('hr.dashboard.heads'))}</div>
      </div>
      <div class="hr-bar-row">
        <div class="hr-bar-top"><span>${esc(t('hr.dashboard.net'))}</span><strong style="color:var(--${money.margin >= 0 ? 'green' : 'red'})">${esc(fmtSAR(money.margin))}</strong></div>
      </div>
      ${
        money.crewMarginPct < 5
          ? `<a class="hr-alert hr-alert-red" href="hr_client_dashboard.html"><span class="status status-red">${esc(t('common.urgent'))}</span><span>${esc(t('hr.dashboard.thinMargin'))}</span></a>`
          : ''
      }`;
  }

  const formula = document.getElementById('money-formula');
  if (formula) {
    formula.textContent =
      `${t('hr.dashboard.formulaCrew')} (${money.crewHeads}). ` +
      `${t('hr.dashboard.formulaNet')} (${money.overheadHeads}). ` +
      (!money.bandOk ? t('hr.dashboard.levyStd') : '');
  }
}

function renderS1() {
  if (!document.getElementById('chart-headcount')) {
    return;
  }
  const emps = getSeed('employees');
  const hc = headcountByStatus(emps);
  const meta = document.getElementById('zone-workforce-meta');
  if (meta) {
    meta.textContent = `${emps.length} ${t('hr.dashboard.heads')}`;
  }

  // Huroob alert card (red, links the case file + compliance).
  const hc2 = document.getElementById('huroob-card');
  if (hc2) {
    const flagged = emps.filter(e => e.st === 'huroob');
    hc2.innerHTML = flagged.length
      ? `<a class="hr-alert hr-alert-red" href="hr_employee.html?code=${encodeURIComponent(flagged[0].code)}" style="margin-bottom:12px">
          <span class="status status-red">${flagged.length} × ${esc(t('status.huroob'))}</span>
          <span><strong>${esc(t('hr.dashboard.huroobTitle'))}</strong> — ${flagged.map(e => esc(currentLang() === 'ar' ? e.nameAr || e.nameEn : e.nameEn)).join(currentLang() === 'ar' ? '، ' : ', ')} · ${esc(flagged[0].reportedAt || '')}</span>
        </a>`
      : '';
  }

  // Headcount ring (huroob tracked separately in the card above).
  const ring = [
    { k: 'active', v: hc.active, c: t => t.green },
    { k: 'on-leave', v: hc['on-leave'], c: t => t.yellow },
    { k: 'probation', v: hc.probation, c: t => t.blue },
    { k: 'exited', v: hc.exited, c: t => t.textMuted }
  ];
  const counted = ring.reduce((s, r) => s + r.v, 0);
  renderEchart(
    document.getElementById('chart-headcount'),
    tk => ({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, textStyle: { color: tk.textMuted, fontSize: 11 } },
      series: [
        {
          type: 'pie',
          radius: ['55%', '78%'],
          center: ['50%', '44%'],
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 13, fontWeight: 600 } },
          data: ring.map(r => ({
            name: t(`status.${r.k}`),
            value: r.v,
            itemStyle: { color: r.c(tk) }
          }))
        }
      ]
    }),
    L(
      `Headcount ${counted}: ${hc.active} active, ${hc['on-leave']} on leave, ${hc.probation} in probation, ${hc.exited} exited. ${hc.huroob} huroob case tracked separately.`,
      `القوى العاملة ${counted}: ${hc.active} نشط، ${hc['on-leave']} في إجازة، ${hc.probation} تحت التجربة، ${hc.exited} منتهية خدماتهم. ${hc.huroob} بلاغ هروب يُتابع بشكل منفصل.`
    )
  );

  // Tenure bars (horizontal → mirrored in RTL).
  const tb = tenureBuckets(emps, todayIso());
  const bands = [
    { k: 'tBand1', v: tb.lt1 },
    { k: 'tBand2', v: tb.y1_3 },
    { k: 'tBand3', v: tb.y3_5 },
    { k: 'tBand4', v: tb.gte5 }
  ];
  renderEchart(
    document.getElementById('chart-tenure'),
    tk => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: tk.borderLight, type: [4, 3] } } },
      yAxis: {
        type: 'category',
        data: bands.map(b => t(`hr.dashboard.${b.k}`)),
        axisLabel: { color: tk.textMuted, fontSize: 11 }
      },
      series: [
        {
          type: 'bar',
          data: bands.map(b => b.v),
          itemStyle: { color: tk.blue, borderRadius: [0, 4, 4, 0] },
          label: { show: true, position: 'right', color: tk.textMuted, fontSize: 11 }
        }
      ]
    }),
    L(
      `Tenure: ${bands.map(b => `${t(`hr.dashboard.${b.k}`)} ${b.v}`).join(', ')}.`,
      `مدد الخدمة: ${bands.map(b => `${t(`hr.dashboard.${b.k}`)} ${b.v}`).join('، ')}.`
    ),
    { rtl: 'hbar' }
  );

  // Separation: hired / boarded / exited per month, last 6.
  const sep = separationSeries(emps, getSeed('onboarding'), todayIso());
  const { labels, hired, boarded, exited } = sep;
  renderEchart(
    document.getElementById('chart-separation'),
    tk => ({
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: tk.textMuted, fontSize: 11 } },
      grid: { left: 8, right: 8, top: 12, bottom: 52, containLabel: true },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { color: tk.textMuted, fontSize: 10 }
      },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: tk.borderLight, type: [4, 3] } } },
      series: [
        {
          name: t('hr.dashboard.hired'),
          type: 'bar',
          data: hired,
          itemStyle: { color: tk.green, borderRadius: [4, 4, 0, 0] }
        },
        {
          name: t('hr.dashboard.boarded'),
          type: 'bar',
          data: boarded,
          itemStyle: { color: tk.blue, borderRadius: [4, 4, 0, 0] }
        },
        {
          name: t('hr.dashboard.exitedW'),
          type: 'bar',
          data: exited,
          itemStyle: { color: tk.red, borderRadius: [4, 4, 0, 0] }
        }
      ]
    }),
    L(
      `Last 6 months: hired ${hired.reduce((a, b) => a + b, 0)}, boarded ${boarded.reduce((a, b) => a + b, 0)}, exited ${exited.reduce((a, b) => a + b, 0)}.`,
      `آخر ٦ أشهر: المعينون ${hired.reduce((a, b) => a + b, 0)}، الملتحقون ${boarded.reduce((a, b) => a + b, 0)}، الخارجون ${exited.reduce((a, b) => a + b, 0)}.`
    ),
    { rtl: 'time' }
  );
}

function renderAll() {
  renderHead();
  renderZoneA();
  renderS1();
  renderKpis();
  renderAlerts();
  renderExpiries();
  renderMix();
  bindZoneMemory();
  applyI18n(document.querySelector('[data-hr-dashboard]') || document);
}

function bindZoneMemory() {
  document.querySelectorAll('details.zone[data-zone]').forEach(d => {
    const key = `hr:ui:zone:${d.dataset.zone}`;
    try {
      if (localStorage.getItem(key) === '0') {
        d.removeAttribute('open');
      }
    } catch (_e) {
      /* private mode */
    }
    if (d.dataset.zoneBound) {
      return;
    }
    d.dataset.zoneBound = '1';
    d.addEventListener('toggle', () => {
      try {
        localStorage.setItem(key, d.open ? '1' : '0');
      } catch (_e) {
        /* private mode */
      }
    });
  });
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
