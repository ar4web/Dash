// HR + Operations — customization center (hr_settings.html).
// Brand · Nitaqat · Licence · Language · Departments · Professions · Reset.

import { showToast } from './toast.js';
import { t, currentLang, setLang, LANG_EVENT, applyI18n, applyBranding } from './i18n.js';
import { getSettings, saveSettings } from './hr-statutory.js';
import { download } from './import-export.js';
import { DEPARTMENTS } from './hr-seed.js';

let booted = false;

function L(en, ar) {
  return currentLang() === 'ar' ? ar : en;
}

function customLists() {
  let lists = { departments: null, professions: null };
  try {
    lists = { ...lists, ...JSON.parse(localStorage.getItem('hr:custom-lists') || '{}') };
  } catch (_e) {
    /* ignore */
  }
  return lists;
}

function saveCustomLists(lists) {
  try {
    localStorage.setItem('hr:custom-lists', JSON.stringify(lists));
  } catch (_e) {
    /* ignore */
  }
}

function getDepts() {
  const c = customLists();
  return c.departments || DEPARTMENTS;
}

function field(id, label, value, opts = {}) {
  return `<div class="form-group"><label class="form-label" for="${id}">${label}</label>
    <input class="form-control" id="${id}" value="${(value ?? '').toString().replace(/"/g, '&quot;')}" ${opts.dir ? `dir="${opts.dir}"` : ''} ${opts.type ? `type="${opts.type}"` : ''} ${opts.extra || ''}></div>`;
}

function renderBrand(s) {
  const el = document.getElementById('set-brand');
  if (!el) {
    return;
  }
  el.innerHTML =
    '<div class="hr-form-2col">' +
    field('set-cname-en', L('Company name (EN)', 'اسم الشركة (إنجليزي)'), s.company.nameEn, {
      dir: 'ltr'
    }) +
    field('set-cname-ar', L('Company name (AR)', 'اسم الشركة (عربي)'), s.company.nameAr) +
    field('set-cr', L('CR number', 'السجل التجاري'), s.company.cr, { dir: 'ltr' }) +
    field('set-addr', L('Address', 'العنوان'), s.company.address) +
    `</div>
    <div class="form-group"><label class="form-label">${L('Logo', 'الشعار')}</label>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <img id="set-logo-preview" src="${s.company.logo || ''}" alt="" style="height:40px;max-width:120px;object-fit:contain;${s.company.logo ? '' : 'display:none'}">
        <label class="btn btn-outline btn-sm" style="cursor:pointer">${t('common.chooseFile')}
          <input type="file" id="set-logo" accept="image/*" hidden></label>
        <button type="button" class="btn btn-ghost btn-sm" id="set-logo-clear">${L('Remove', 'إزالة')}</button>
      </div>
      <p style="font-size:11.5px;color:var(--text-muted);margin:6px 0 0">${L('PNG or SVG, stored locally. Empty = default Dash mark.', 'PNG أو SVG، يُحفظ محليًا. فارغ = علامة داش الافتراضية.')}</p>
    </div>`;
  el.querySelector('#set-logo')?.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) {
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      const prev = el.querySelector('#set-logo-preview');
      if (prev) {
        prev.src = r.result;
        prev.style.display = '';
      }
      el.dataset.logo = r.result;
    };
    r.readAsDataURL(f);
  });
  el.querySelector('#set-logo-clear')?.addEventListener('click', () => {
    el.dataset.logo = '';
    const prev = el.querySelector('#set-logo-preview');
    if (prev) {
      prev.style.display = 'none';
    }
  });
}

function renderNitaqat(s) {
  const el = document.getElementById('set-nitaqat');
  if (!el) {
    return;
  }
  el.innerHTML =
    '<div class="hr-form-2col">' +
    field('set-nit-activity', L('Activity category', 'فئة النشاط'), s.nitaqat.activity) +
    field('set-nit-size', L('Size band', 'فئة الحجم'), s.nitaqat.size) +
    field('set-nit-target', L('Target Saudization %', 'مستهدف السعودة %'), s.nitaqat.target, {
      type: 'number',
      dir: 'ltr',
      extra: 'min="0" max="100"'
    }) +
    '</div>';
}

function renderLicence(s) {
  const el = document.getElementById('set-licence');
  if (!el) {
    return;
  }
  const scope = s.licence.scope;
  const opt = (v, en, ar) =>
    `<option value="${v}"${scope === v ? ' selected' : ''}>${L(en, ar)}</option>`;
  el.innerHTML = `<div class="hr-form-2col">
    <div class="form-group"><label class="form-label" for="set-lic-scope">${L('Licence scope', 'نطاق الترخيص')}</label>
      <select class="form-control" id="set-lic-scope">
        ${opt('service', 'Service contracting only', 'التعاقد على الخدمات فقط')}
        ${opt('labour', 'Labour supply only', 'توريد العمالة فقط')}
        ${opt('both', 'Both (service + labour)', 'كلاهما (خدمات + عمالة)')}
      </select></div>
    <div class="form-group"><label class="form-label">${L('Strict Ajeer default', 'التشدد الافتراضي لأجير')}</label>
      <label style="display:flex;gap:8px;align-items:center;font-size:13px"><input type="checkbox" id="set-lic-strict" ${s.licence.strictAjeer ? 'checked' : ''}> ${L('Block deployment when Ajeer permit is missing', 'منع التوزيع عند غياب تصريح أجير')}</label></div>
    </div>`;
}

function renderLang(s) {
  const el = document.getElementById('set-lang');
  if (!el) {
    return;
  }
  el.innerHTML = `<div class="form-group" style="margin:0"><label class="form-label" for="set-deflang">${L('Default language', 'اللغة الافتراضية')}</label>
    <select class="form-control" id="set-deflang">
      <option value="en"${s.language === 'en' ? ' selected' : ''}>English</option>
      <option value="ar"${s.language === 'ar' ? ' selected' : ''}>العربية</option>
    </select>
    <p style="font-size:11.5px;color:var(--text-muted);margin:6px 0 0">${L('Applies to new browsers; your toggle choice wins on this device.', 'يطبق على المتصفحات الجديدة؛ اختيارك من الزر يغلب على هذا الجهاز.')}</p></div>`;
}

function renderDepts() {
  const el = document.getElementById('set-depts');
  if (!el) {
    return;
  }
  const depts = getDepts();
  el.innerHTML = `
    <div style="margin-bottom:10px">${depts.map(d => `<span class="hr-dept-chip">${d.code} · ${currentLang() === 'ar' ? d.ar : d.en}<button type="button" data-del-dept="${d.code}" aria-label="Remove">×</button></span>`).join('')}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input class="form-control" id="set-dept-code" placeholder="CODE" style="max-width:110px" dir="ltr">
      <input class="form-control" id="set-dept-en" placeholder="Name (EN)" style="flex:1;min-width:120px">
      <input class="form-control" id="set-dept-ar" placeholder="الاسم (عربي)" style="flex:1;min-width:120px">
      <button type="button" class="btn btn-outline btn-sm" id="set-dept-add">${L('Add', 'إضافة')}</button>
    </div>`;
  el.querySelector('#set-dept-add')?.addEventListener('click', () => {
    const code = el.querySelector('#set-dept-code').value.trim().toUpperCase();
    const en = el.querySelector('#set-dept-en').value.trim();
    const ar = el.querySelector('#set-dept-ar').value.trim();
    if (!code || !en) {
      showToast(L('Code and English name are required', 'الرمز والاسم الإنجليزي مطلوبان'), {
        variant: 'warning'
      });
      return;
    }
    const lists = customLists();
    const arr = (lists.departments || DEPARTMENTS).slice();
    if (arr.some(d => d.code === code)) {
      showToast(L('Department exists', 'الإدارة موجودة'), { variant: 'warning' });
      return;
    }
    arr.push({ code, en, ar: ar || en });
    lists.departments = arr;
    saveCustomLists(lists);
    renderDepts();
    showToast(L('Department added', 'تمت إضافة الإدارة'), { variant: 'success' });
  });
  el.querySelectorAll('[data-del-dept]').forEach(b =>
    b.addEventListener('click', () => {
      const lists = customLists();
      const arr = (lists.departments || DEPARTMENTS).filter(d => d.code !== b.dataset.delDept);
      lists.departments = arr;
      saveCustomLists(lists);
      renderDepts();
    })
  );
}

function renderExport() {
  const el = document.getElementById('set-export');
  if (!el) {
    return;
  }
  el.innerHTML = `
    <p style="font-size:12.5px;color:var(--text-muted);margin:0 0 10px">${L('Download the full HR configuration as JSON, or restore it on another device.', 'نزّل إعدادات الموارد كاملة بصيغة JSON، أو استعدها على جهاز آخر.')}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button type="button" class="btn btn-outline btn-sm" id="set-backup">${L('Download backup', 'تنزيل النسخة')}</button>
      <label class="btn btn-outline btn-sm" style="cursor:pointer">${L('Restore backup', 'استعادة النسخة')}
        <input type="file" id="set-restore" accept="application/json" hidden></label>
    </div>`;
  el.querySelector('#set-backup')?.addEventListener('click', () => {
    const data = {};
    ['hr:settings:v1', 'hr:lang', 'hr:custom-lists', 'hr:my-code', 'hr:client-id'].forEach(k => {
      try {
        data[k] = localStorage.getItem(k);
      } catch (_e) {
        /* ignore */
      }
    });
    download(
      `hr-settings-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(data, null, 2),
      'application/json'
    );
    showToast(L('Backup downloaded', 'تم تنزيل النسخة'), { variant: 'success' });
  });
  el.querySelector('#set-restore')?.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) {
      return;
    }
    f.text().then(txt => {
      try {
        const data = JSON.parse(txt);
        Object.keys(data || {}).forEach(k => {
          if (k.startsWith('hr:') && data[k] !== null) {
            try {
              localStorage.setItem(k, data[k]);
            } catch (_err) {
              /* ignore */
            }
          }
        });
        renderAll();
        showToast(L('Backup restored', 'تمت الاستعادة'), { variant: 'success' });
      } catch (_err) {
        showToast(L('Invalid backup file', 'ملف نسخة غير صالح'), { variant: 'error' });
      }
    });
  });
}

function renderDanger() {
  const el = document.getElementById('set-danger');
  if (!el) {
    return;
  }
  el.innerHTML = `
    <p style="font-size:12.5px;color:var(--text-muted);margin:0 0 10px">${L('Clears imported rows and your local customizations on this device. Seed demo data is unaffected.', 'يمسح الصفوف المستوردة وتخصيصاتك المحلية على هذا الجهاز. البيانات التجريبية لا تتأثر.')}</p>
    <button type="button" class="btn btn-outline btn-sm" id="set-reset" style="color:var(--red);border-color:var(--red)">${L('Reset local HR data', 'تصفير بيانات الموارد المحلية')}</button>`;
  el.querySelector('#set-reset')?.addEventListener('click', () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('hr:'))
      .forEach(k => {
        try {
          localStorage.removeItem(k);
        } catch (_e) {
          /* ignore */
        }
      });
    renderAll();
    showToast(L('Local data cleared', 'تم مسح البيانات المحلية'), { variant: 'success' });
  });
}

function collectAndSave() {
  const val = id => document.getElementById(id)?.value ?? '';
  const next = {
    company: {
      nameEn: val('set-cname-en').trim(),
      nameAr: val('set-cname-ar').trim(),
      cr: val('set-cr').trim(),
      address: val('set-addr').trim(),
      logo: document.getElementById('set-brand')?.dataset.logo ?? getSettings().company.logo
    },
    nitaqat: {
      activity: val('set-nit-activity').trim(),
      size: val('set-nit-size').trim(),
      target: Number(val('set-nit-target')) || 0
    },
    licence: {
      scope: val('set-lic-scope') || 'both',
      strictAjeer: document.getElementById('set-lic-strict')?.checked !== false
    },
    language: val('set-deflang') || 'en'
  };
  if (!next.company.nameEn) {
    showToast(L('Company name (EN) is required', 'اسم الشركة بالإنجليزية مطلوب'), {
      variant: 'warning'
    });
    return;
  }
  saveSettings(next);
  setLang(next.language);
  applyBranding();
  renderAll();
  showToast(L('Settings saved', 'تم حفظ الإعدادات'), { variant: 'success' });
}

function renderAll() {
  const s = getSettings();
  renderBrand(s);
  renderNitaqat(s);
  renderLicence(s);
  renderLang(s);
  renderDepts();
  renderExport();
  renderDanger();
  applyI18n(document.querySelector('[data-hr-settings]') || document);
}

export function initHrSettings() {
  const root = document.querySelector('[data-hr-settings]');
  if (!root) {
    return;
  }
  renderAll();
  if (booted) {
    return;
  }
  booted = true;
  document.getElementById('set-save')?.addEventListener('click', collectAndSave);
  document.getElementById('set-save-top')?.addEventListener('click', collectAndSave);
  window.addEventListener(LANG_EVENT, renderAll);
}
