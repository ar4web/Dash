// HR + Operations — bilingual engine (English ⇄ Arabic).
// Pages hardcode English + data-i18n attributes; this module translates at runtime.
// Shell (sidebar/topbar) is translated by href/label lookup — no build-time coupling.
// Persisted per browser (hr:lang); default comes from Settings (language).

import { NAV } from './shell-render.js';

export const LANG_KEY = 'hr:lang';
export const LANG_EVENT = 'hr:langchange';

const STR = {
  en: {
    'navgroup.general': 'General',
    'navgroup.apps': 'Apps',
    'navgroup.e-commerce': 'E-commerce',
    'navgroup.projects': 'Projects',
    'navgroup.ui-library': 'UI library',
    'navgroup.admin': 'Admin',
    'navgroup.layouts': 'Layouts',
    'navgroup.hr-operations': 'HR & Operations',
    'navgroup.overview': 'Overview',
    'navgroup.people': 'People',
    'navgroup.operations': 'Operations',
    'navgroup.contracts': 'Contracts',
    'navgroup.time-leave': 'Time & Leave',
    'navgroup.payroll': 'Payroll',
    'navgroup.compliance-ksa': 'Compliance (KSA)',
    'navgroup.hiring': 'Hiring',
    'navgroup.growth': 'Growth',
    'navgroup.documents': 'Documents',
    'nav.calendar': 'Calendar',
    'nav.map': 'Map',
    'nav.chat': 'Chat',
    'nav.inbox': 'Inbox',
    'nav.kanban': 'Kanban',
    'nav.files': 'Files',
    'nav.notifications': 'Notifications',
    'nav.storefront': 'Storefront',
    'nav.product': 'Product',
    'nav.invoice': 'Invoice',
    'nav.pricing': 'Pricing',
    'nav.projects': 'All projects',
    'nav.project-detail': 'Project detail',
    'nav.ui': 'Elements',
    'nav.widgets': 'Widgets',
    'nav.playground': 'Playground',
    'nav.theme': 'Theme',
    'nav.typography': 'Typography',
    'nav.icons': 'Icons',
    'nav.media': 'Media',
    'nav.users': 'Contacts',
    'nav.user_management': 'User management',
    'nav.profile': 'Your profile',
    'nav.settings': 'Settings',
    'nav.faq': 'Help center',
    'nav.fixed-sidebar': 'Fixed sidebar',
    'nav.fixed-footer': 'Fixed footer',
    'nav.level2': 'Nested page',
    'nav.plain': 'Blank',
    'nav.hr-dashboard': 'HR Dashboard',
    'nav.hr-my-space': 'My space',
    'nav.hr-approvals': 'Approvals',
    'nav.hr-employees': 'Employees',
    'nav.hr-org': 'Org chart',
    'nav.hr-onboarding': 'Onboarding',
    'nav.hr-visas': 'Visas',
    'nav.hr-clients': 'Clients',
    'nav.hr-client': 'Client dashboard',
    'nav.hr-requests': 'Manpower requests',
    'nav.hr-assignments': 'Assignments',
    'nav.hr-tracker': 'Workforce tracker',
    'nav.hr-contracts': 'Contract maker',
    'nav.hr-templates': 'Templates',
    'nav.hr-attendance': 'Attendance',
    'nav.hr-timesheets': 'Timesheets',
    'nav.hr-shifts': 'Shifts',
    'nav.hr-leave': 'Leave',
    'nav.hr-holidays': 'Holidays',
    'nav.hr-payroll': 'Pay runs',
    'nav.hr-eosb': 'EOSB & settlement',
    'nav.hr-expenses': 'Expenses',
    'nav.hr-sa-compliance': 'SA Compliance',
    'nav.hr-gosi': 'GOSI',
    'nav.hr-wps': 'WPS & Mudad',
    'nav.hr-residency': 'Residency & visas',
    'nav.hr-jobs': 'Jobs',
    'nav.hr-pipeline': 'Pipeline',
    'nav.hr-candidates': 'Candidates',
    'nav.hr-interviews': 'Interviews',
    'nav.hr-offers': 'Offers',
    'nav.hr-goals': 'Goals',
    'nav.hr-reviews': 'Reviews',
    'nav.hr-feedback': 'Feedback',
    'nav.hr-trainings': 'Training',
    'nav.hr-documents': 'Vault',
    'nav.hr-announcements': 'Announcements',
    'nav.hr-reports': 'Reports',
    'nav.hr-departments': 'Departments',
    'nav.hr-roles': 'Roles',
    'nav.hr-settings': 'HR Settings',
    'nav.hr-audit': 'Audit log',
    'common.searchPh': 'Search pages or run a command…',
    'common.search': 'Search',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.actions': 'Actions',
    'common.all': 'All',
    'common.active': 'Active',
    'common.refresh': 'Refresh',
    'common.print': 'Print',
    'common.download': 'Download',
    'common.back': 'Back',
    'common.noData': 'No records found.',
    'common.status': 'Status',
    'common.code': 'Code',
    'common.name': 'Name',
    'common.date': 'Date',
    'common.note': 'Note',
    'common.total': 'Total',
    'common.csv': 'CSV',
    'common.xlsx': 'Excel',
    'common.pdfPrint': 'PDF / Print',
    'common.chooseFile': 'Choose file',
    'common.template': 'Template',
    'common.of': 'of',
    'common.days': 'days',
    'common.urgent': 'Urgent',
    'common.attention': 'Attention',
    'common.open': 'Open',
    'common.viewAll': 'View all',
    'status.active': 'Active',
    'status.probation': 'Probation',
    'status.on-leave': 'On leave',
    'status.exited': 'Exited',
    'status.inactive': 'Inactive',
    'status.bench': 'Bench',
    'status.deployed': 'Deployed',
    'status.authenticated': 'Authenticated',
    'status.sent': 'Sent',
    'status.draft': 'Draft',
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.paid': 'Paid',
    'status.expired': 'Expired',
    'status.expiring': 'Expiring',
    'status.valid': 'Valid',
    'status.missing': 'Missing',
    'status.deployable': 'Deployable',
    'status.blocked': 'Blocked',
    'role.admin': 'Admin',
    'role.hr': 'HR',
    'role.ops': 'Operations',
    'role.payroll': 'Payroll',
    'role.pro': 'PRO',
    'role.finance': 'Finance',
    'role.manager': 'Manager',
    'role.site-supervisor': 'Site supervisor',
    'role.employee': 'Employee',
    'role.client': 'Client',
    'hr.nav.dashboard': 'HR Dashboard',
    'hr.nav.employees': 'Employees',
    'hr.nav.compliance': 'SA Compliance',
    'hr.nav.settings': 'HR Settings',
    'hr.nav.mySpace': 'My space',
    'hr.nav.client': 'Client dashboard',
    'hr.dashboard.sub': 'Workforce at a glance — deployments, compliance and billing.',
    'hr.dashboard.openCompliance': 'Open compliance',
    'hr.dashboard.alerts': 'Needs attention',
    'hr.dashboard.deployTitle': 'Deployment mix',
    'hr.dashboard.expiries': 'Upcoming Iqama expiries',
    'hr.employees.sub': 'Directory of Saudi and expatriate workforce.',
    'hr.employees.total': 'Total',
    'hr.employees.saudi': 'Saudi',
    'hr.employees.expat': 'Expat',
    'hr.employees.saudRate': 'Saudization (est.)',
    'hr.employees.allGroups': 'All groups',
    'hr.employees.allStatus': 'All statuses',
    'hr.employees.worker': 'Worker',
    'hr.employees.nationality': 'Nationality',
    'hr.employees.profession': 'Profession',
    'hr.employees.deployment': 'Deployment',
    'hr.employees.iqama': 'Iqama',
    'hr.employee.file': 'Employee file',
    'hr.compliance.sub': 'Ajeer gates · residencies · Qiwa contracts · Saudization.',
    'hr.compliance.blocked': 'Blocked deployments',
    'hr.compliance.iqama30': 'Iqama ≤ 30 days',
    'hr.compliance.qiwaPending': 'Qiwa not authenticated',
    'hr.settings.sub': 'Brand, Nitaqat, licence scope, language and lists — no code needed.',
    'hr.settings.brand': 'Company brand',
    'hr.settings.nitaqat': 'Nitaqat profile',
    'hr.settings.licence': 'Licence scope',
    'hr.settings.language': 'Language',
    'hr.settings.depts': 'Departments',
    'hr.settings.export': 'Backup',
    'hr.settings.danger': 'Danger zone',
    'hr.myspace.sub': 'Your profile, pay, deployment and requests.',
    'hr.myspace.profile': 'Profile',
    'hr.myspace.pay': "This month's pay",
    'hr.myspace.deploy': 'My deployment',
    'hr.myspace.leave': 'Annual leave',
    'hr.myspace.requests': 'My requests',
    'hr.client.sub': 'Roster, billing and requests for your supplied workforce.',
    'hr.client.raise': 'Raise a request',
    'hr.client.roster': 'Deployed roster',
    'hr.client.invoices': 'Invoices',
    'common.arrival': 'Arrival',
    'common.advance': 'Advance',
    'common.convert': 'Convert to employee',
    'common.renew': 'Renew',
    'common.stage': 'Stage',
    'common.checklist': 'Checklist',
    'common.upload': 'Upload',
    'status.used': 'Used',
    'status.awaiting': 'Awaiting entry',
    'status.cancelled': 'Cancelled',
    'status.in-progress': 'In progress',
    'status.completed': 'Completed',
    'hr.nav.onboarding': 'Onboarding',
    'hr.nav.visas': 'Visas',
    'hr.nav.residency': 'Residency & renewals',
    'hr.nav.tracker': 'Workforce tracker',
    'hr.nav.documents': 'Vault',
    'hr.nav.org': 'Org chart',
    'hr.visas.blocks': 'Visa blocks',
    'hr.visas.register': 'Visa register',
    'hr.residency.board': 'Expiry board',
    'hr.residency.file': 'Renewal file',
    'hr.residency.transfers': 'Qiwa transfer cases',
    'hr.residency.newTransfer': 'New case',
    'hr.onboarding.pipeline': 'Pipeline',
    'hr.onboarding.newCase': 'New case',
    'hr.onboarding.wizard': 'Case wizard',
    'hr.tracker.board': 'Board',
    'hr.tracker.pipeline': 'In pipeline',
    'hr.documents.vault': 'Vault',
    'hr.documents.gaps': 'Coverage gaps',
    'hr.org.tree': 'Reporting tree',
    'hr.org.depts': 'Departments',
    'hr.visas.quota': 'Quota',
    'hr.visas.used': 'Used',
    'hr.visas.avail': 'Available',
    'hr.visas.expiring': 'Expiring ≤ 90d',
    'hr.residency.total': 'Expats tracked',
    'hr.residency.iqamaDue': 'Iqama due ≤ 30d',
    'hr.residency.insBad': 'Insurance issues',
    'hr.residency.fines': 'Open fines',
    'hr.residency.ready': 'Renewal-ready',
    'hr.onboarding.active': 'Active cases',
    'hr.onboarding.transfers': 'Transfer-ins',
    'hr.onboarding.spend': 'Onboarding spend',
    'hr.documents.total': 'Documents',
    'hr.documents.expiring': 'Expiring ≤ 90d',
    'hr.documents.coverage': 'Full coverage'
  },
  ar: {
    'navgroup.general': 'عام',
    'navgroup.apps': 'التطبيقات',
    'navgroup.e-commerce': 'المتجر',
    'navgroup.projects': 'المشاريع',
    'navgroup.ui-library': 'مكتبة الواجهة',
    'navgroup.admin': 'الإدارة',
    'navgroup.layouts': 'التخطيطات',
    'navgroup.hr-operations': 'الموارد البشرية والتشغيل',
    'navgroup.overview': 'نظرة عامة',
    'navgroup.people': 'الموظفون',
    'navgroup.operations': 'التشغيل',
    'navgroup.contracts': 'العقود',
    'navgroup.time-leave': 'الدوام والإجازات',
    'navgroup.payroll': 'الرواتب',
    'navgroup.compliance-ksa': 'الامتثال (السعودية)',
    'navgroup.hiring': 'التوظيف',
    'navgroup.growth': 'التطوير',
    'navgroup.documents': 'المستندات',
    'nav.calendar': 'التقويم',
    'nav.map': 'الخريطة',
    'nav.chat': 'المحادثات',
    'nav.inbox': 'الوارد',
    'nav.kanban': 'كانبان',
    'nav.files': 'الملفات',
    'nav.notifications': 'التنبيهات',
    'nav.storefront': 'المتجر',
    'nav.product': 'المنتج',
    'nav.invoice': 'الفاتورة',
    'nav.pricing': 'الأسعار',
    'nav.projects': 'كل المشاريع',
    'nav.project-detail': 'تفاصيل المشروع',
    'nav.ui': 'العناصر',
    'nav.widgets': 'الودجات',
    'nav.playground': 'التجارب',
    'nav.theme': 'السمة',
    'nav.typography': 'الخطوط',
    'nav.icons': 'الأيقونات',
    'nav.media': 'الوسائط',
    'nav.users': 'جهات الاتصال',
    'nav.user_management': 'إدارة المستخدمين',
    'nav.profile': 'ملفك',
    'nav.settings': 'الإعدادات',
    'nav.faq': 'مركز المساعدة',
    'nav.fixed-sidebar': 'شريط ثابت',
    'nav.fixed-footer': 'تذييل ثابت',
    'nav.level2': 'صفحة متداخلة',
    'nav.plain': 'فارغة',
    'nav.hr-dashboard': 'لوحة الموارد البشرية',
    'nav.hr-my-space': 'مساحتي',
    'nav.hr-approvals': 'الموافقات',
    'nav.hr-employees': 'الموظفون',
    'nav.hr-org': 'الهيكل التنظيمي',
    'nav.hr-onboarding': 'التهيئة',
    'nav.hr-visas': 'التأشيرات',
    'nav.hr-clients': 'العملاء',
    'nav.hr-client': 'لوحة العميل',
    'nav.hr-requests': 'طلبات العمالة',
    'nav.hr-assignments': 'إسناد العمالة',
    'nav.hr-tracker': 'متتبع العمالة',
    'nav.hr-contracts': 'منشئ العقود',
    'nav.hr-templates': 'القوالب',
    'nav.hr-attendance': 'الحضور',
    'nav.hr-timesheets': 'كشوف الدوام',
    'nav.hr-shifts': 'الورديات',
    'nav.hr-leave': 'الإجازات',
    'nav.hr-holidays': 'العطل',
    'nav.hr-payroll': 'مسيرات الرواتب',
    'nav.hr-eosb': 'نهاية الخدمة والتسويات',
    'nav.hr-expenses': 'المصروفات',
    'nav.hr-sa-compliance': 'الامتثال السعودي',
    'nav.hr-gosi': 'التأمينات',
    'nav.hr-wps': 'حماية الأجور (مدد)',
    'nav.hr-residency': 'الإقامات والتأشيرات',
    'nav.hr-jobs': 'الوظائف',
    'nav.hr-pipeline': 'مسار التوظيف',
    'nav.hr-candidates': 'المرشحون',
    'nav.hr-interviews': 'المقابلات',
    'nav.hr-offers': 'العروض',
    'nav.hr-goals': 'الأهداف',
    'nav.hr-reviews': 'التقييمات',
    'nav.hr-feedback': 'الملاحظات',
    'nav.hr-trainings': 'التدريب',
    'nav.hr-documents': 'المستودع',
    'nav.hr-announcements': 'الإعلانات',
    'nav.hr-reports': 'التقارير',
    'nav.hr-departments': 'الإدارات',
    'nav.hr-roles': 'الأدوار',
    'nav.hr-settings': 'إعدادات الموارد',
    'nav.hr-audit': 'سجل التدقيق',
    'common.searchPh': 'ابحث في الصفحات أو نفّذ أمرًا…',
    'common.search': 'بحث',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.view': 'عرض',
    'common.edit': 'تعديل',
    'common.actions': 'إجراءات',
    'common.all': 'الكل',
    'common.active': 'نشط',
    'common.refresh': 'تحديث',
    'common.print': 'طباعة',
    'common.download': 'تنزيل',
    'common.back': 'رجوع',
    'common.noData': 'لا توجد سجلات.',
    'common.status': 'الحالة',
    'common.code': 'الرمز',
    'common.name': 'الاسم',
    'common.date': 'التاريخ',
    'common.note': 'ملاحظة',
    'common.total': 'الإجمالي',
    'common.csv': 'CSV',
    'common.xlsx': 'إكسل',
    'common.pdfPrint': 'PDF / طباعة',
    'common.chooseFile': 'اختر ملفًا',
    'common.template': 'قالب',
    'common.of': 'من',
    'common.days': 'يوم',
    'common.urgent': 'عاجل',
    'common.attention': 'تنبيه',
    'common.open': 'فتح',
    'common.viewAll': 'عرض الكل',
    'status.active': 'نشط',
    'status.probation': 'فترة تجربة',
    'status.on-leave': 'في إجازة',
    'status.exited': 'منتهية خدمته',
    'status.inactive': 'غير نشط',
    'status.bench': 'احتياطي',
    'status.deployed': 'مُسند',
    'status.authenticated': 'موثّق',
    'status.sent': 'مُرسل',
    'status.draft': 'مسودة',
    'status.pending': 'قيد الانتظار',
    'status.approved': 'معتمد',
    'status.rejected': 'مرفوض',
    'status.paid': 'مدفوع',
    'status.expired': 'منتهي',
    'status.expiring': 'قارب على الانتهاء',
    'status.valid': 'ساري',
    'status.missing': 'مفقود',
    'status.deployable': 'جاهز للتوزيع',
    'status.blocked': 'محظور',
    'role.admin': 'مدير النظام',
    'role.hr': 'موارد بشرية',
    'role.ops': 'تشغيل',
    'role.payroll': 'رواتب',
    'role.pro': 'علاقات حكومية',
    'role.finance': 'مالية',
    'role.manager': 'مدير',
    'role.site-supervisor': 'مشرف موقع',
    'role.employee': 'موظف',
    'role.client': 'عميل',
    'hr.nav.dashboard': 'لوحة الموارد البشرية',
    'hr.nav.employees': 'الموظفون',
    'hr.nav.compliance': 'الامتثال السعودي',
    'hr.nav.settings': 'إعدادات الموارد',
    'hr.nav.mySpace': 'مساحتي',
    'hr.nav.client': 'لوحة العميل',
    'hr.dashboard.sub': 'القوى العاملة بنظرة واحدة — التوزيع والامتثال والفوترة.',
    'hr.dashboard.openCompliance': 'فتح الامتثال',
    'hr.dashboard.alerts': 'يحتاج انتباهًا',
    'hr.dashboard.deployTitle': 'مزيج التوزيع',
    'hr.dashboard.expiries': 'إقامات قاربت على الانتهاء',
    'hr.employees.sub': 'دليل القوى العاملة السعودية والأجنبية.',
    'hr.employees.total': 'الإجمالي',
    'hr.employees.saudi': 'سعودي',
    'hr.employees.expat': 'أجنبي',
    'hr.employees.saudRate': 'السعودة (تقديري)',
    'hr.employees.allGroups': 'كل الفئات',
    'hr.employees.allStatus': 'كل الحالات',
    'hr.employees.worker': 'الموظف',
    'hr.employees.nationality': 'الجنسية',
    'hr.employees.profession': 'المهنة',
    'hr.employees.deployment': 'التوزيع',
    'hr.employees.iqama': 'الإقامة',
    'hr.employee.file': 'ملف الموظف',
    'hr.compliance.sub': 'بوابات أجير · الإقامات · عقود قوى · السعودة.',
    'hr.compliance.blocked': 'توزيعات محظورة',
    'hr.compliance.iqama30': 'إقامة ≤ 30 يومًا',
    'hr.compliance.qiwaPending': 'قوى غير موثق',
    'hr.settings.sub': 'الهوية والنطاقات ونطاق الترخيص واللغة والقوائم — دون برمجة.',
    'hr.settings.brand': 'هوية الشركة',
    'hr.settings.nitaqat': 'ملف النطاقات',
    'hr.settings.licence': 'نطاق الترخيص',
    'hr.settings.language': 'اللغة',
    'hr.settings.depts': 'الإدارات',
    'hr.settings.export': 'النسخ الاحتياطي',
    'hr.settings.danger': 'منطقة الخطر',
    'hr.myspace.sub': 'ملفك وراتبك وتوزيعك وطلباتك.',
    'hr.myspace.profile': 'الملف',
    'hr.myspace.pay': 'راتب هذا الشهر',
    'hr.myspace.deploy': 'توزيعي',
    'hr.myspace.leave': 'الإجازة السنوية',
    'hr.myspace.requests': 'طلباتي',
    'hr.client.sub': 'الكشوف والفوترة والطلبات لعمالتك الموردة.',
    'hr.client.raise': 'رفع طلب',
    'hr.client.roster': 'كشف الموزعين',
    'hr.client.invoices': 'الفواتير',
    'common.arrival': 'الوصول',
    'common.advance': 'تقدّم',
    'common.convert': 'تحويل إلى موظف',
    'common.renew': 'تجديد',
    'common.stage': 'المرحلة',
    'common.checklist': 'قائمة التحقق',
    'common.upload': 'رفع',
    'status.used': 'مستخدمة',
    'status.awaiting': 'بانتظار الدخول',
    'status.cancelled': 'ملغاة',
    'status.in-progress': 'قيد التنفيذ',
    'status.completed': 'مكتملة',
    'hr.nav.onboarding': 'التهيئة',
    'hr.nav.visas': 'التأشيرات',
    'hr.nav.residency': 'الإقامات والتجديد',
    'hr.nav.tracker': 'متتبع القوى العاملة',
    'hr.nav.documents': 'المستودع',
    'hr.nav.org': 'الهيكل التنظيمي',
    'hr.visas.blocks': 'مجموعات التأشيرات',
    'hr.visas.register': 'سجل التأشيرات',
    'hr.residency.board': 'لوحة الانتهاء',
    'hr.residency.file': 'ملف التجديد',
    'hr.residency.transfers': 'قضايا نقل قوى',
    'hr.residency.newTransfer': 'قضية جديدة',
    'hr.onboarding.pipeline': 'المسار',
    'hr.onboarding.newCase': 'حالة جديدة',
    'hr.onboarding.wizard': 'معالج الحالة',
    'hr.tracker.board': 'اللوحة',
    'hr.tracker.pipeline': 'في المسار',
    'hr.documents.vault': 'المستودع',
    'hr.documents.gaps': 'فجوات التغطية',
    'hr.org.tree': 'شجرة التبعية',
    'hr.org.depts': 'الإدارات',
    'hr.visas.quota': 'الحصة',
    'hr.visas.used': 'المستخدمة',
    'hr.visas.avail': 'المتاحة',
    'hr.visas.expiring': 'تنتهي ≤ 90 يوم',
    'hr.residency.total': 'الأجانب المتتبعون',
    'hr.residency.iqamaDue': 'إقامة مستحقة ≤ 30',
    'hr.residency.insBad': 'مشاكل التأمين',
    'hr.residency.fines': 'مخالفات مفتوحة',
    'hr.residency.ready': 'جاهز للتجديد',
    'hr.onboarding.active': 'حالات نشطة',
    'hr.onboarding.transfers': 'نقل الكفالات',
    'hr.onboarding.spend': 'إنفاق التهيئة',
    'hr.documents.total': 'المستندات',
    'hr.documents.expiring': 'تنتهي ≤ 90 يوم',
    'hr.documents.coverage': 'تغطية كاملة'
  }
};

function storedLang() {
  try {
    return localStorage.getItem(LANG_KEY) || '';
  } catch (_e) {
    return '';
  }
}

function settingsDefaultLang() {
  try {
    const s = JSON.parse(localStorage.getItem('hr:settings:v1') || '{}');
    if (s.language) {
      return s.language;
    }
    return s.company && s.company.defaultLang ? s.company.defaultLang : '';
  } catch (_e) {
    return '';
  }
}

export function currentLang() {
  const l = storedLang() || settingsDefaultLang() || 'en';
  return l === 'ar' ? 'ar' : 'en';
}

export function t(key) {
  const lang = currentLang();
  return (STR[lang] && STR[lang][key]) || STR.en[key] || key;
}

export function applyI18n(root = document) {
  const lang = currentLang();
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const v = STR[lang][el.getAttribute('data-i18n')] || STR.en[el.getAttribute('data-i18n')];
    if (v) {
      el.textContent = v;
    }
  });
  root.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = STR[lang][el.getAttribute('data-i18n-ph')] || STR.en[el.getAttribute('data-i18n-ph')];
    if (v) {
      el.setAttribute('placeholder', v);
    }
  });
}

function slugifyLabel(label) {
  return (label || '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Translate build-time-injected shell (sidebar + topbar) by stable href/label lookup.
export function applyShellI18n() {
  const groups = document.querySelectorAll('.sidebar .nav-group');
  groups.forEach((g, gi) => {
    const def = NAV[gi];
    if (!def) {
      return;
    }
    const label = g.querySelector('.nav-label');
    if (label) {
      label.textContent = t(`navgroup.${slugifyLabel(def.label)}`);
    }
    def.items.forEach(item => {
      if (item.children) {
        return;
      }
      const a = g.querySelector(`a[href="${item.href}"] .nav-text`);
      if (a) {
        a.textContent = t(`nav.${item.key}`);
      }
    });
  });
  const search = document.querySelector('.topbar .search-box input');
  if (search) {
    search.setAttribute('placeholder', t('common.searchPh'));
  }
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.textContent = currentLang() === 'ar' ? 'EN' : 'عربي';
  }
}

/** Apply owner brand (name + logo) to the sidebar. Only when saved in Settings. */
export function applyBranding() {
  let raw;
  try {
    raw = JSON.parse(localStorage.getItem('hr:settings:v1') || 'null');
  } catch (_e) {
    return;
  }
  if (!raw || !raw.company || !raw.company.nameEn) {
    return;
  }
  const lang = currentLang();
  const name = lang === 'ar' ? raw.company.nameAr || raw.company.nameEn : raw.company.nameEn;
  const brandName = document.querySelector('.sidebar-brand .brand-name');
  if (brandName) {
    brandName.textContent = name;
  }
  const icon = document.querySelector('.sidebar-brand .brand-icon');
  if (icon) {
    if (raw.company.logo) {
      icon.innerHTML = '';
      const img = document.createElement('img');
      img.src = raw.company.logo;
      img.alt = name;
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:inherit';
      icon.appendChild(img);
    } else if (!icon.querySelector('img')) {
      icon.textContent = (name || 'H').trim().charAt(0);
    }
  }
}

export function setLang(lang) {
  const next = lang === 'ar' ? 'ar' : 'en';
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch (_e) {
    /* private mode */
  }
  document.documentElement.setAttribute('lang', next);
  document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
  applyI18n(document);
  applyShellI18n();
  applyBranding();
  window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang: next } }));
}

let inited = false;

export function initI18n() {
  if (inited) {
    return;
  }
  inited = true;
  const lang = currentLang();
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  // Inject language toggle into topbar (replaces external docs link for internal tool).
  const docs = document.querySelector('.topbar .tb-docs');
  if (docs && !document.getElementById('lang-toggle')) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'lang-toggle';
    btn.className = 'tb-btn tb-lang';
    btn.title = 'Language / اللغة';
    btn.setAttribute('aria-label', 'Switch language');
    docs.replaceWith(btn);
    btn.addEventListener('click', () => setLang(currentLang() === 'ar' ? 'en' : 'ar'));
  }
  applyI18n(document);
  applyShellI18n();
  applyBranding();
}
