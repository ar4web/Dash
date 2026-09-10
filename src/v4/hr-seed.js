// HR + Operations — shared demo seed (manpower-supply company, Riyadh).
// Fictional data only (sequential fake IDs). Company profile / Nitaqat / licence
// are placeholders — the owner edits them in Settings (hr_settings.html).
// In API mode (?api=1) these are replaced by /api/hr/* via hr-api.js.

export const SEED_COMPANY = {
  nameEn: 'Manpower Supply Co.',
  nameAr: 'شركة توريد العمالة',
  crNo: '1010XXXXXX',
  addressEn: 'Riyadh, Saudi Arabia',
  addressAr: 'الرياض، المملكة العربية السعودية',
  logoUrl: '',
  primary: '#1ABB9C',
  defaultLang: 'en'
};

export const SEED_NITAQAT = {
  activity: '', // set in Settings, e.g. "Construction — Alexandria, VA 22302"
  sizeClass: '', // set in Settings, e.g. "Medium (50–499)"
  targetPct: 0, // Saudization target % for the band math
  notes: ''
};

export const SEED_LICENCE = {
  scope: 'both', // service | labour | both — confirm with counsel (D11)
  licenceNo: '',
  notes: '',
  strictAjeerGuards: true // pre-2026 secondment guardrails ON until counsel relaxes
};

export const DEPARTMENTS = [
  { code: 'OPS', en: 'Operations', ar: 'التشغيل' },
  { code: 'HR', en: 'Human Resources', ar: 'الموارد البشرية' },
  { code: 'FIN', en: 'Finance', ar: 'المالية' },
  { code: 'PRO', en: 'Government Relations', ar: 'العلاقات الحكومية' },
  { code: 'REC', en: 'Recruitment', ar: 'التوظيف' }
];

export const PROFESSIONS = [
  { code: 'driver', en: 'Driver', ar: 'سائق' },
  { code: 'cleaner', en: 'Cleaner', ar: 'عامل نظافة' },
  { code: 'construction', en: 'Construction worker', ar: 'عامل إنشاءات' },
  { code: 'mason', en: 'Mason', ar: 'بناء' },
  { code: 'electrician', en: 'Electrician', ar: 'كهربائي' },
  { code: 'plumber', en: 'Plumber', ar: 'سباك' },
  { code: 'guard', en: 'Security guard', ar: 'حارس أمن' },
  { code: 'foreman', en: 'Foreman', ar: 'مشرف عمال' },
  { code: 'office', en: 'Office assistant', ar: 'مساعد إداري' },
  { code: 'specialist', en: 'Specialist', ar: 'أخصائي' }
];

// Money = monthly SAR (major units in seed; engine converts to halalas).
// q = Qiwa contract status: authenticated | sent | draft
// st = active | probation | on-leave
export const EMPLOYEES = [
  // — Saudis (internal staff) —
  {
    code: 'EMP-0001',
    nameEn: 'Abdullah Al-Otaibi',
    nameAr: 'عبدالله العتيبي',
    nat: 'Saudi',
    saudi: true,
    nid: '1000000001',
    prof: 'specialist',
    dept: 'HR',
    titleEn: 'HR Manager',
    titleAr: 'مدير الموارد البشرية',
    join: '2022-03-01',
    basic: 9000,
    housing: 2250,
    transport: 1000,
    gosi: 'G000001',
    gosiOn: '2022-03-05',
    iban: 'SA1000000000000000000001',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    phone: '+966 555 010 001',
    email: 'a.alotaibi@company.sa',
    av: 'primary'
  },
  {
    code: 'EMP-0002',
    nameEn: 'Khalid Al-Dossari',
    nameAr: 'خالد الدوسري',
    nat: 'Saudi',
    saudi: true,
    nid: '1000000002',
    prof: 'specialist',
    dept: 'OPS',
    titleEn: 'Operations Coordinator',
    titleAr: 'منسق التشغيل',
    join: '2023-01-15',
    basic: 7500,
    housing: 1875,
    transport: 800,
    gosi: 'G000002',
    gosiOn: '2023-01-20',
    iban: 'SA1000000000000000000002',
    bank: 'SNB',
    q: 'authenticated',
    st: 'active',
    phone: '+966 555 010 002',
    email: 'k.dossari@company.sa',
    av: 'blue'
  },
  {
    code: 'EMP-0003',
    nameEn: 'Noura Al-Qahtani',
    nameAr: 'نورة القحطاني',
    nat: 'Saudi',
    saudi: true,
    nid: '1000000003',
    prof: 'specialist',
    dept: 'PRO',
    titleEn: 'PRO Officer',
    titleAr: 'مسؤولة العلاقات الحكومية',
    join: '2024-09-01',
    basic: 6000,
    housing: 1500,
    transport: 700,
    gosi: 'G000003',
    gosiOn: '2024-09-05',
    iban: 'SA1000000000000000000003',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    phone: '+966 555 010 003',
    email: 'n.qahtani@company.sa',
    av: 'purple'
  },
  {
    code: 'EMP-0004',
    nameEn: 'Fahad Al-Shammari',
    nameAr: 'فهد الشمري',
    nat: 'Saudi',
    saudi: true,
    nid: '1000000004',
    prof: 'specialist',
    dept: 'FIN',
    titleEn: 'Accountant',
    titleAr: 'محاسب',
    join: '2025-02-10',
    basic: 6500,
    housing: 1625,
    transport: 700,
    gosi: 'G000004',
    gosiOn: '2025-02-12',
    iban: 'SA1000000000000000000004',
    bank: 'Riyad Bank',
    q: 'sent',
    st: 'active',
    phone: '+966 555 010 004',
    email: 'f.shammari@company.sa',
    av: 'green'
  },
  {
    code: 'EMP-0005',
    nameEn: 'Reem Al-Harbi',
    nameAr: 'ريم الحربي',
    nat: 'Saudi',
    saudi: true,
    nid: '1000000005',
    prof: 'specialist',
    dept: 'REC',
    titleEn: 'Recruiter (part-time)',
    titleAr: 'أخصائية توظيف (دوام جزئي)',
    join: '2025-06-01',
    basic: 3500,
    housing: 0,
    transport: 0,
    partTime: true,
    gosi: 'G000005',
    gosiOn: '2025-06-03',
    iban: 'SA1000000000000000000005',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    phone: '+966 555 010 005',
    email: 'r.harbi@company.sa',
    av: 'yellow'
  },
  // — Expat workforce (deployed + bench) —
  {
    code: 'EMP-0006',
    nameEn: 'Rajesh Kumar',
    nameAr: 'راجيش كومار',
    nat: 'India',
    iqama: '2000000006',
    iqamaExp: '2027-03-14',
    prof: 'driver',
    dept: 'OPS',
    titleEn: 'Driver',
    titleAr: 'سائق',
    join: '2021-06-10',
    entry: '2021-06-08',
    basic: 1800,
    housing: 500,
    transport: 300,
    iban: 'SA1000000000000000000006',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    client: 'CL-002',
    site: 'ST-003',
    phone: '+966 555 010 006',
    av: 'primary',
    annualUsed: 12
  },
  {
    code: 'EMP-0007',
    nameEn: 'Ahmed Raza',
    nameAr: 'أحمد رضا',
    nat: 'Pakistan',
    iqama: '2000000007',
    iqamaExp: '2027-01-22',
    prof: 'driver',
    dept: 'OPS',
    titleEn: 'Driver',
    titleAr: 'سائق',
    join: '2022-02-01',
    entry: '2022-01-30',
    basic: 1800,
    housing: 500,
    transport: 300,
    iban: 'SA1000000000000000000007',
    bank: 'SNB',
    q: 'authenticated',
    st: 'active',
    client: 'CL-002',
    site: 'ST-003',
    phone: '+966 555 010 007',
    av: 'blue',
    annualUsed: 5
  },
  {
    code: 'EMP-0008',
    nameEn: 'Mohammad Asif',
    nameAr: 'محمد آصف',
    nat: 'Pakistan',
    iqama: '2000000008',
    iqamaExp: '2026-09-28',
    prof: 'driver',
    dept: 'OPS',
    titleEn: 'Driver',
    titleAr: 'سائق',
    join: '2023-04-12',
    entry: '2023-04-10',
    basic: 1700,
    housing: 450,
    transport: 300,
    iban: 'SA1000000000000000000008',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    phone: '+966 555 010 008',
    av: 'yellow',
    annualUsed: 0
  },
  {
    code: 'EMP-0009',
    nameEn: 'Jose Ramos',
    nameAr: 'خوسيه راموس',
    nat: 'Philippines',
    iqama: '2000000009',
    iqamaExp: '2027-05-30',
    prof: 'cleaner',
    dept: 'OPS',
    titleEn: 'Cleaner',
    titleAr: 'عامل نظافة',
    join: '2021-11-03',
    entry: '2021-11-01',
    basic: 1400,
    housing: 400,
    transport: 250,
    iban: 'SA1000000000000000000009',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    client: 'CL-002',
    site: 'ST-003',
    phone: '+966 555 010 009',
    av: 'green',
    annualUsed: 21
  },
  {
    code: 'EMP-0010',
    nameEn: 'Karim Hassan',
    nameAr: 'كريم حسن',
    nat: 'Bangladesh',
    iqama: '2000000010',
    iqamaExp: '2027-02-11',
    prof: 'cleaner',
    dept: 'OPS',
    titleEn: 'Cleaner',
    titleAr: 'عامل نظافة',
    join: '2022-08-20',
    entry: '2022-08-18',
    basic: 1400,
    housing: 400,
    transport: 250,
    iban: 'SA1000000000000000000010',
    bank: 'SNB',
    q: 'authenticated',
    st: 'active',
    client: 'CL-002',
    site: 'ST-003',
    phone: '+966 555 010 010',
    av: 'purple',
    annualUsed: 8
  },
  {
    code: 'EMP-0011',
    nameEn: 'Abdul Malek',
    nameAr: 'عبد المالك',
    nat: 'Bangladesh',
    iqama: '2000000011',
    iqamaExp: '2026-12-05',
    prof: 'cleaner',
    dept: 'OPS',
    titleEn: 'Cleaner',
    titleAr: 'عامل نظافة',
    join: '2023-01-25',
    entry: '2023-01-23',
    basic: 1400,
    housing: 400,
    transport: 250,
    iban: 'SA1000000000000000000011',
    bank: 'Al Rajhi',
    q: 'sent',
    st: 'active',
    client: 'CL-002',
    site: 'ST-003',
    phone: '+966 555 010 011',
    av: 'red',
    annualUsed: 3
  },
  {
    code: 'EMP-0012',
    nameEn: 'Maria Santos',
    nameAr: 'ماريا سانتوس',
    nat: 'Philippines',
    iqama: '2000000012',
    iqamaExp: '2026-10-15',
    prof: 'cleaner',
    dept: 'OPS',
    titleEn: 'Cleaner',
    titleAr: 'عاملة نظافة',
    join: '2022-05-14',
    entry: '2022-05-12',
    basic: 1400,
    housing: 400,
    transport: 250,
    iban: 'SA1000000000000000000012',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'on-leave',
    phone: '+966 555 010 012',
    av: 'azure',
    annualUsed: 15
  },
  {
    code: 'EMP-0013',
    nameEn: 'Suresh Patel',
    nameAr: 'سوريش باتيل',
    nat: 'India',
    iqama: '2000000013',
    iqamaExp: '2027-04-02',
    prof: 'construction',
    dept: 'OPS',
    titleEn: 'Construction worker',
    titleAr: 'عامل إنشاءات',
    join: '2020-09-01',
    entry: '2020-08-29',
    basic: 1600,
    housing: 450,
    transport: 300,
    iban: 'SA1000000000000000000013',
    bank: 'SNB',
    q: 'authenticated',
    st: 'active',
    client: 'CL-001',
    site: 'ST-001',
    phone: '+966 555 010 013',
    av: 'primary',
    annualUsed: 20
  },
  {
    code: 'EMP-0014',
    nameEn: 'Vikram Singh',
    nameAr: 'فيكرام سينغ',
    nat: 'India',
    iqama: '2000000014',
    iqamaExp: '2027-06-19',
    prof: 'construction',
    dept: 'OPS',
    titleEn: 'Construction worker',
    titleAr: 'عامل إنشاءات',
    join: '2021-03-22',
    entry: '2021-03-20',
    basic: 1600,
    housing: 450,
    transport: 300,
    iban: '',
    bank: '',
    q: 'authenticated',
    st: 'active',
    client: 'CL-001',
    site: 'ST-001',
    phone: '+966 555 010 014',
    av: 'blue',
    annualUsed: 6
  },
  {
    code: 'EMP-0015',
    nameEn: 'Bilal Ahmed',
    nameAr: 'بلال أحمد',
    nat: 'Pakistan',
    iqama: '2000000015',
    iqamaExp: '2027-02-27',
    prof: 'construction',
    dept: 'OPS',
    titleEn: 'Construction worker',
    titleAr: 'عامل إنشاءات',
    join: '2022-07-11',
    entry: '2022-07-09',
    basic: 1600,
    housing: 450,
    transport: 300,
    iban: 'SA1000000000000000000015',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    client: 'CL-001',
    site: 'ST-002',
    phone: '+966 555 010 015',
    av: 'green',
    annualUsed: 0
  },
  {
    code: 'EMP-0016',
    nameEn: 'Deepak Yadav',
    nameAr: 'ديباك ياداف',
    nat: 'India',
    iqama: '2000000016',
    iqamaExp: '2026-11-20',
    prof: 'construction',
    dept: 'OPS',
    titleEn: 'Construction worker',
    titleAr: 'عامل إنشاءات',
    join: '2023-05-30',
    entry: '2023-05-28',
    basic: 1500,
    housing: 400,
    transport: 300,
    iban: 'SA1000000000000000000016',
    bank: 'SNB',
    q: 'authenticated',
    st: 'active',
    client: 'CL-001',
    site: 'ST-002',
    phone: '+966 555 010 016',
    av: 'purple',
    annualUsed: 10
  },
  {
    code: 'EMP-0017',
    nameEn: 'Rahim Uddin',
    nameAr: 'رحيم الدين',
    nat: 'Bangladesh',
    iqama: '2000000017',
    iqamaExp: '2027-08-08',
    prof: 'construction',
    dept: 'OPS',
    titleEn: 'Construction worker',
    titleAr: 'عامل إنشاءات',
    join: '2024-02-18',
    entry: '2024-02-16',
    basic: 1500,
    housing: 400,
    transport: 300,
    iban: 'SA1000000000000000000017',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    phone: '+966 555 010 017',
    av: 'yellow',
    annualUsed: 2
  },
  {
    code: 'EMP-0018',
    nameEn: 'Mahmoud Ali',
    nameAr: 'محمود علي',
    nat: 'Egypt',
    iqama: '2000000018',
    iqamaExp: '2027-01-09',
    prof: 'mason',
    dept: 'OPS',
    titleEn: 'Mason',
    titleAr: 'بناء',
    join: '2021-12-05',
    entry: '2021-12-03',
    basic: 2200,
    housing: 550,
    transport: 300,
    iban: 'SA1000000000000000000018',
    bank: 'Riyad Bank',
    q: 'authenticated',
    st: 'active',
    client: 'CL-001',
    site: 'ST-001',
    phone: '+966 555 010 018',
    av: 'red',
    annualUsed: 14
  },
  {
    code: 'EMP-0019',
    nameEn: 'Saeed Anwar',
    nameAr: 'سعيد أنور',
    nat: 'Pakistan',
    iqama: '2000000019',
    iqamaExp: '2027-03-25',
    prof: 'mason',
    dept: 'OPS',
    titleEn: 'Mason',
    titleAr: 'بناء',
    join: '2022-10-17',
    entry: '2022-10-15',
    basic: 2200,
    housing: 550,
    transport: 300,
    iban: 'SA1000000000000000000019',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    client: 'CL-001',
    site: 'ST-002',
    phone: '+966 555 010 019',
    av: 'azure',
    annualUsed: 7
  },
  {
    code: 'EMP-0020',
    nameEn: 'Arun Nair',
    nameAr: 'أرون ناير',
    nat: 'India',
    iqama: '2000000020',
    iqamaExp: '2027-07-12',
    prof: 'electrician',
    dept: 'OPS',
    titleEn: 'Electrician',
    titleAr: 'كهربائي',
    join: '2022-04-09',
    entry: '2022-04-07',
    basic: 2500,
    housing: 600,
    transport: 350,
    iban: 'SA1000000000000000000020',
    bank: 'SNB',
    q: 'authenticated',
    st: 'active',
    client: 'CL-001',
    site: 'ST-001',
    phone: '+966 555 010 020',
    av: 'primary',
    annualUsed: 4
  },
  {
    code: 'EMP-0021',
    nameEn: 'Imran Khan',
    nameAr: 'عمران خان',
    nat: 'Pakistan',
    iqama: '2000000021',
    iqamaExp: '2027-09-01',
    prof: 'electrician',
    dept: 'OPS',
    titleEn: 'Electrician',
    titleAr: 'كهربائي',
    join: '2026-08-01',
    entry: '2026-07-30',
    basic: 2400,
    housing: 600,
    transport: 350,
    iban: 'SA1000000000000000000021',
    bank: 'Al Rajhi',
    q: 'draft',
    st: 'probation',
    phone: '+966 555 010 021',
    av: 'blue',
    annualUsed: 0
  },
  {
    code: 'EMP-0022',
    nameEn: 'Khaled Ibrahim',
    nameAr: 'خالد إبراهيم',
    nat: 'Egypt',
    iqama: '2000000022',
    iqamaExp: '2027-05-17',
    prof: 'plumber',
    dept: 'OPS',
    titleEn: 'Plumber',
    titleAr: 'سباك',
    join: '2023-03-14',
    entry: '2023-03-12',
    basic: 2300,
    housing: 550,
    transport: 350,
    iban: 'SA1000000000000000000022',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    client: 'CL-002',
    site: 'ST-003',
    phone: '+966 555 010 022',
    av: 'green',
    annualUsed: 9
  },
  {
    code: 'EMP-0023',
    nameEn: 'Manoj Tiwari',
    nameAr: 'مانوج تيواري',
    nat: 'India',
    iqama: '2000000023',
    iqamaExp: '2027-02-03',
    prof: 'foreman',
    dept: 'OPS',
    titleEn: 'Foreman',
    titleAr: 'مشرف عمال',
    join: '2020-01-20',
    entry: '2020-01-18',
    basic: 3200,
    housing: 800,
    transport: 400,
    iban: 'SA1000000000000000000023',
    bank: 'SNB',
    q: 'authenticated',
    st: 'active',
    client: 'CL-001',
    site: 'ST-001',
    phone: '+966 555 010 023',
    av: 'purple',
    annualUsed: 18
  },
  {
    code: 'EMP-0024',
    nameEn: 'Danilo Cruz',
    nameAr: 'دانيلو كروز',
    nat: 'Philippines',
    iqama: '2000000024',
    iqamaExp: '2027-06-06',
    prof: 'office',
    dept: 'HR',
    titleEn: 'Office assistant',
    titleAr: 'مساعد إداري',
    join: '2023-09-11',
    entry: '2023-09-09',
    basic: 2000,
    housing: 500,
    transport: 300,
    iban: 'SA1000000000000000000024',
    bank: 'Al Rajhi',
    q: 'authenticated',
    st: 'active',
    phone: '+966 555 010 024',
    av: 'yellow',
    annualUsed: 5
  }
];

export const CLIENTS = [
  {
    id: 'CL-001',
    nameEn: 'Al-Bina Construction',
    nameAr: 'شركة البناء للمقاولات',
    cr: '1010XXXX11',
    contactEn: 'Eng. Sami Haddad',
    phone: '+966 555 020 001',
    email: 'sami@albina.example.sa',
    city: 'Riyadh',
    nitaqat: 'High Green',
    wpsOk: true,
    billingDay: 5,
    av: 'blue'
  },
  {
    id: 'CL-002',
    nameEn: 'Facility Care Services',
    nameAr: 'شركة العناية للمرافق',
    cr: '1010XXXX22',
    contactEn: 'Ms. Dana Kanaan',
    phone: '+966 555 020 002',
    email: 'dana@facilitycare.example.sa',
    city: 'Riyadh',
    nitaqat: 'Mid Green',
    wpsOk: true,
    billingDay: 10,
    av: 'green'
  }
];

export const SITES = [
  {
    id: 'ST-001',
    client: 'CL-001',
    nameEn: 'North Ring Site',
    nameAr: 'موقع الطريق الشمالي',
    city: 'Riyadh'
  },
  {
    id: 'ST-002',
    client: 'CL-001',
    nameEn: 'Diriyah Project',
    nameAr: 'مشروع الدرعية',
    city: 'Diriyah'
  },
  {
    id: 'ST-003',
    client: 'CL-002',
    nameEn: 'KAFD Tower FM',
    nameAr: 'برج كافد — إدارة المرافق',
    city: 'Riyadh'
  }
];

// rate = monthly SAR charged to client per head. ajeer: null = MISSING (violation demo).
export const ASSIGNMENTS = [
  {
    id: 'ASN-2026-001',
    emp: 'EMP-0006',
    client: 'CL-002',
    site: 'ST-003',
    req: 'REQ-2026-004',
    start: '2026-01-05',
    end: '2026-12-31',
    rate: 3500,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-101',
    ajeerExp: '2026-12-31',
    status: 'active'
  },
  {
    id: 'ASN-2026-002',
    emp: 'EMP-0007',
    client: 'CL-002',
    site: 'ST-003',
    req: 'REQ-2026-004',
    start: '2026-01-05',
    end: '2026-12-31',
    rate: 3500,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-102',
    ajeerExp: '2026-12-31',
    status: 'active'
  },
  {
    id: 'ASN-2026-003',
    emp: 'EMP-0009',
    client: 'CL-002',
    site: 'ST-003',
    req: 'REQ-2026-006',
    start: '2026-02-01',
    end: '2027-01-31',
    rate: 2800,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-103',
    ajeerExp: '2027-01-31',
    status: 'active'
  },
  {
    id: 'ASN-2026-004',
    emp: 'EMP-0010',
    client: 'CL-002',
    site: 'ST-003',
    req: 'REQ-2026-006',
    start: '2026-02-01',
    end: '2027-01-31',
    rate: 2800,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-104',
    ajeerExp: '2027-01-31',
    status: 'active'
  },
  {
    id: 'ASN-2026-005',
    emp: 'EMP-0011',
    client: 'CL-002',
    site: 'ST-003',
    req: 'REQ-2026-006',
    start: '2026-03-01',
    end: '2027-02-28',
    rate: 2800,
    service: 'labour',
    consent: 'signed',
    ajeer: 'AJ-2026-105',
    ajeerExp: '2027-02-28',
    status: 'active'
  },
  {
    id: 'ASN-2026-006',
    emp: 'EMP-0013',
    client: 'CL-001',
    site: 'ST-001',
    req: 'REQ-2026-010',
    start: '2026-01-12',
    end: '2026-12-31',
    rate: 3200,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-106',
    ajeerExp: '2026-12-31',
    status: 'active'
  },
  {
    id: 'ASN-2026-007',
    emp: 'EMP-0014',
    client: 'CL-001',
    site: 'ST-001',
    req: 'REQ-2026-010',
    start: '2026-01-12',
    end: '2026-12-31',
    rate: 3200,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-107',
    ajeerExp: '2026-12-31',
    status: 'active'
  },
  {
    id: 'ASN-2026-008',
    emp: 'EMP-0015',
    client: 'CL-001',
    site: 'ST-002',
    req: 'REQ-2026-010',
    start: '2026-04-01',
    end: '2027-03-31',
    rate: 3200,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-108',
    ajeerExp: '2027-03-31',
    status: 'active'
  },
  {
    id: 'ASN-2026-009',
    emp: 'EMP-0016',
    client: 'CL-001',
    site: 'ST-002',
    req: 'REQ-2026-010',
    start: '2026-04-01',
    end: '2027-03-31',
    rate: 3200,
    service: 'labour',
    consent: 'contract',
    ajeer: null,
    ajeerExp: null,
    status: 'active'
  },
  {
    id: 'ASN-2026-010',
    emp: 'EMP-0018',
    client: 'CL-001',
    site: 'ST-001',
    req: 'REQ-2026-010',
    start: '2026-01-12',
    end: '2026-12-31',
    rate: 4200,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-110',
    ajeerExp: '2026-12-31',
    status: 'active'
  },
  {
    id: 'ASN-2026-011',
    emp: 'EMP-0019',
    client: 'CL-001',
    site: 'ST-002',
    req: 'REQ-2026-011',
    start: '2026-06-01',
    end: '2027-05-31',
    rate: 4200,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-111',
    ajeerExp: '2026-09-25',
    status: 'active'
  },
  {
    id: 'ASN-2026-012',
    emp: 'EMP-0020',
    client: 'CL-001',
    site: 'ST-001',
    req: 'REQ-2026-007',
    start: '2026-02-10',
    end: '2027-02-09',
    rate: 4800,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-112',
    ajeerExp: '2027-02-09',
    status: 'active'
  },
  {
    id: 'ASN-2026-013',
    emp: 'EMP-0022',
    client: 'CL-002',
    site: 'ST-003',
    req: 'REQ-2026-008',
    start: '2026-03-10',
    end: '2027-03-09',
    rate: 4600,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-113',
    ajeerExp: '2027-03-09',
    status: 'active'
  },
  {
    id: 'ASN-2026-014',
    emp: 'EMP-0023',
    client: 'CL-001',
    site: 'ST-001',
    req: 'REQ-2026-007',
    start: '2026-02-10',
    end: '2027-02-09',
    rate: 6000,
    service: 'labour',
    consent: 'contract',
    ajeer: 'AJ-2026-114',
    ajeerExp: '2027-02-09',
    status: 'active'
  }
];

export const REQUESTS = [
  {
    id: 'REQ-2026-010',
    client: 'CL-001',
    site: 'ST-001',
    prof: 'construction',
    qty: 10,
    filled: 5,
    rate: 3200,
    start: '2026-01-12',
    durMo: 12,
    status: 'deploying'
  },
  {
    id: 'REQ-2026-011',
    client: 'CL-001',
    site: 'ST-002',
    prof: 'mason',
    qty: 4,
    filled: 1,
    rate: 4200,
    start: '2026-06-01',
    durMo: 12,
    status: 'sourcing'
  },
  {
    id: 'REQ-2026-012',
    client: 'CL-002',
    site: 'ST-003',
    prof: 'cleaner',
    qty: 6,
    filled: 3,
    rate: 2800,
    start: '2026-02-01',
    durMo: 12,
    status: 'proposed'
  }
];

// §0.3 — seeded leave types (admin-tunable in Settings from P2; engine reads this shape).
export const LEAVE_TYPES = [
  { code: 'annual', en: 'Annual', ar: 'سنوية', base: 21, after5: 30, pay: 1 },
  {
    code: 'sick',
    en: 'Sick',
    ar: 'مرضية',
    tiers: [
      { days: 30, pay: 1 },
      { days: 60, pay: 0.75 },
      { days: 30, pay: 0 }
    ]
  },
  { code: 'maternity', en: 'Maternity', ar: 'أمومة', weeks: 10 },
  { code: 'paternity', en: 'Newborn', ar: 'مولود جديد', days: 3, pay: 1 },
  { code: 'marriage', en: 'Marriage', ar: 'زواج', days: 5, pay: 1 },
  { code: 'bereavement', en: 'Bereavement', ar: 'وفاة قريب', days: 5, siblingDays: 3, pay: 1 },
  { code: 'iddah', en: 'Iddah (widow)', ar: 'عدة', months: 4, extraDays: 10, pay: 1 },
  { code: 'hajj', en: 'Hajj', ar: 'حج', days: 15, once: true, afterYears: 2 },
  { code: 'unpaid', en: 'Unpaid', ar: 'بدون أجر', days: 10, pay: 0 }
];

// Demo holiday calendar (Gregorian + Hijri). Eid dates are approximate demo values.
export const HOLIDAYS = [
  { en: 'Founding Day', ar: 'يوم التأسيس', start: '2026-02-22', days: 1, hijri: '1447-09-04' },
  { en: 'Eid al-Fitr', ar: 'عيد الفطر', start: '2026-03-20', days: 4, hijri: '1447-10-01' },
  { en: 'Eid al-Adha', ar: 'عيد الأضحى', start: '2026-05-27', days: 4, hijri: '1447-12-10' },
  { en: 'National Day', ar: 'اليوم الوطني', start: '2026-09-23', days: 1, hijri: '1448-04-01' },
  { en: 'Founding Day', ar: 'يوم التأسيس', start: '2027-02-22', days: 1, hijri: '1448-09-04' },
  { en: 'Eid al-Fitr', ar: 'عيد الفطر', start: '2027-03-10', days: 4, hijri: '1448-10-01' },
  { en: 'Eid al-Adha', ar: 'عيد الأضحى', start: '2027-05-17', days: 4, hijri: '1448-12-10' },
  { en: 'National Day', ar: 'اليوم الوطني', start: '2027-09-23', days: 1, hijri: '1449-04-01' }
];

// GOSI pension rate versions (each side), effective dates. SANED 0.75%/side, hazards 2% employer.
export const GOSI_VERSIONS = [
  { from: '2024-07-03', pension: 0.09 },
  { from: '2025-07-03', pension: 0.095 },
  { from: '2026-07-03', pension: 0.1 },
  { from: '2027-07-03', pension: 0.105 },
  { from: '2028-07-03', pension: 0.11 }
];
export const GOSI_SANED = 0.0075;
export const GOSI_HAZARDS = 0.02;
export const GOSI_CAP = 45000; // SAR/month on basic+housing
export const GOSI_CUTOFF = '2024-07-03'; // enrolled before → old system (fixed 9%)

// Work-permit levy bands (SAR/month) — versioned demo values, editable in Settings.
export const LEVY_TABLE = {
  reduced: 700,
  standard: 800,
  noteEn: 'Reduced rate when Saudization targets are met.',
  noteAr: 'السعر المخفض عند تحقيق نسب السعودة.'
};

export const EXPENSE_CATEGORIES = [
  { code: 'fuel', en: 'Fuel', ar: 'وقود', limit: 500, receipt: true, vat: true },
  { code: 'travel', en: 'Travel', ar: 'سفر', limit: 2000, receipt: true, vat: true },
  { code: 'housing', en: 'Housing', ar: 'سكن', limit: 3000, receipt: true, vat: false },
  { code: 'medical', en: 'Medical', ar: 'طبي', limit: 1500, receipt: true, vat: true },
  {
    code: 'govt',
    en: 'Government fees',
    ar: 'رسوم حكومية',
    limit: 10000,
    receipt: true,
    vat: false
  },
  {
    code: 'supplies',
    en: 'Site supplies',
    ar: 'مستلزمات الموقع',
    limit: 1000,
    receipt: true,
    vat: true
  },
  { code: 'perdiem', en: 'Per diem', ar: 'بدل يومي', limit: 300, receipt: false, vat: false },
  { code: 'other', en: 'Other', ar: 'أخرى', limit: 500, receipt: true, vat: true }
];

// Deduction categories payroll must REJECT when employer-borne (Art. 40).
export const BLOCKED_DEDUCTIONS = ['iqama', 'levy', 'insurance', 'recruitment'];

// ── P1: expat lifecycle + tracker ─────────────────────────────────────────
// Visa blocks & agents (overseas recruitment channel).
export const AGENTS = [
  { id: 'AG-01', name: 'Delta Overseas Manpower', country: 'India' },
  { id: 'AG-02', name: 'Gulf Link Recruiters', country: 'Pakistan' }
];

export const VISA_BLOCKS = [
  {
    id: 'VB-2025-01',
    profession: 'construction',
    qty: 20,
    issued: '2025-06-10',
    expires: '2027-06-09',
    agent: 'AG-01',
    costPerVisa: 2000
  },
  {
    id: 'VB-2025-02',
    profession: 'driver',
    qty: 8,
    issued: '2025-09-01',
    expires: '2027-08-31',
    agent: 'AG-01',
    costPerVisa: 2000
  },
  {
    id: 'VB-2025-03',
    profession: 'mason',
    qty: 6,
    issued: '2025-10-05',
    expires: '2027-10-04',
    agent: 'AG-02',
    costPerVisa: 2200
  },
  {
    id: 'VB-2026-01',
    profession: 'cleaner',
    qty: 10,
    issued: '2026-02-15',
    expires: '2028-02-14',
    agent: 'AG-02',
    costPerVisa: 2200
  },
  {
    id: 'VB-2026-02',
    profession: 'electrician',
    qty: 4,
    issued: '2026-05-01',
    expires: '2028-04-30',
    agent: 'AG-02',
    costPerVisa: 2500
  },
  {
    id: 'VB-2026-03',
    profession: 'general',
    qty: 10,
    issued: '2026-04-01',
    expires: '2028-03-31',
    agent: 'AG-01',
    costPerVisa: 2000
  }
];

// Per-worker visas. status: used | awaiting | expired | cancelled.
export const VISAS = [
  {
    no: 'V-2021-011',
    block: 'VB-2025-02',
    emp: 'EMP-0006',
    type: 'work',
    issued: '2021-05-20',
    validUntil: '2023-05-19',
    entry: '2021-06-08',
    status: 'used'
  },
  {
    no: 'V-2022-004',
    block: 'VB-2025-02',
    emp: 'EMP-0007',
    type: 'work',
    issued: '2022-01-10',
    validUntil: '2024-01-09',
    entry: '2022-01-30',
    status: 'used'
  },
  {
    no: 'V-2023-021',
    block: 'VB-2025-02',
    emp: 'EMP-0008',
    type: 'work',
    issued: '2023-03-22',
    validUntil: '2025-03-21',
    entry: '2023-04-10',
    status: 'used'
  },
  {
    no: 'V-2021-034',
    block: 'VB-2026-01',
    emp: 'EMP-0009',
    type: 'work',
    issued: '2021-10-12',
    validUntil: '2023-10-11',
    entry: '2021-11-01',
    status: 'used'
  },
  {
    no: 'V-2022-028',
    block: 'VB-2026-01',
    emp: 'EMP-0010',
    type: 'work',
    issued: '2022-07-28',
    validUntil: '2024-07-27',
    entry: '2022-08-18',
    status: 'used'
  },
  {
    no: 'V-2023-002',
    block: 'VB-2026-01',
    emp: 'EMP-0011',
    type: 'work',
    issued: '2023-01-03',
    validUntil: '2025-01-02',
    entry: '2023-01-23',
    status: 'used'
  },
  {
    no: 'V-2022-015',
    block: 'VB-2026-01',
    emp: 'EMP-0012',
    type: 'work',
    issued: '2022-04-20',
    validUntil: '2024-04-19',
    entry: '2022-05-12',
    status: 'used'
  },
  {
    no: 'V-2020-040',
    block: 'VB-2025-01',
    emp: 'EMP-0013',
    type: 'work',
    issued: '2020-08-05',
    validUntil: '2022-08-04',
    entry: '2020-08-29',
    status: 'used'
  },
  {
    no: 'V-2021-018',
    block: 'VB-2025-01',
    emp: 'EMP-0014',
    type: 'work',
    issued: '2021-02-26',
    validUntil: '2023-02-25',
    entry: '2021-03-20',
    status: 'used'
  },
  {
    no: 'V-2022-025',
    block: 'VB-2025-01',
    emp: 'EMP-0015',
    type: 'work',
    issued: '2022-06-15',
    validUntil: '2024-06-14',
    entry: '2022-07-09',
    status: 'used'
  },
  {
    no: 'V-2023-016',
    block: 'VB-2025-01',
    emp: 'EMP-0016',
    type: 'work',
    issued: '2023-05-02',
    validUntil: '2025-05-01',
    entry: '2023-05-28',
    status: 'used'
  },
  {
    no: 'V-2024-006',
    block: 'VB-2025-01',
    emp: 'EMP-0017',
    type: 'work',
    issued: '2024-01-22',
    validUntil: '2026-01-21',
    entry: '2024-02-16',
    status: 'used'
  },
  {
    no: 'V-2021-045',
    block: 'VB-2025-03',
    emp: 'EMP-0018',
    type: 'work',
    issued: '2021-11-08',
    validUntil: '2023-11-07',
    entry: '2021-12-03',
    status: 'used'
  },
  {
    no: 'V-2022-033',
    block: 'VB-2025-03',
    emp: 'EMP-0019',
    type: 'work',
    issued: '2022-09-20',
    validUntil: '2024-09-19',
    entry: '2022-10-15',
    status: 'used'
  },
  {
    no: 'V-2022-009',
    block: 'VB-2026-02',
    emp: 'EMP-0020',
    type: 'work',
    issued: '2022-03-11',
    validUntil: '2024-03-10',
    entry: '2022-04-07',
    status: 'used'
  },
  {
    no: 'V-2026-101',
    block: 'VB-2026-02',
    emp: 'EMP-0021',
    type: 'work',
    issued: '2026-07-10',
    validUntil: '2028-07-09',
    entry: '2026-07-30',
    status: 'used'
  },
  {
    no: 'V-2023-009',
    block: 'VB-2026-03',
    emp: 'EMP-0022',
    type: 'work',
    issued: '2023-02-14',
    validUntil: '2025-02-13',
    entry: '2023-03-12',
    status: 'used'
  },
  {
    no: 'V-2020-002',
    block: 'VB-2026-03',
    emp: 'EMP-0023',
    type: 'work',
    issued: '2019-12-20',
    validUntil: '2021-12-19',
    entry: '2020-01-18',
    status: 'used'
  },
  {
    no: 'V-2023-030',
    block: 'VB-2026-03',
    emp: 'EMP-0024',
    type: 'work',
    issued: '2023-08-15',
    validUntil: '2025-08-14',
    entry: '2023-09-09',
    status: 'used'
  },
  {
    no: 'V-2026-501',
    block: 'VB-2025-01',
    ob: 'OB-2026-016',
    type: 'work',
    issued: '2026-08-20',
    validUntil: '2027-08-19',
    entry: '',
    status: 'awaiting'
  },
  {
    no: 'V-2026-502',
    block: 'VB-2025-02',
    ob: 'OB-2026-017',
    type: 'work',
    issued: '2026-08-28',
    validUntil: '2027-08-27',
    entry: '2026-09-08',
    status: 'awaiting'
  },
  {
    no: 'V-2026-503',
    block: 'VB-2026-01',
    ob: '',
    type: 'work',
    issued: '2026-09-01',
    validUntil: '2026-10-05',
    entry: '',
    status: 'awaiting'
  },
  {
    no: 'V-2025-099',
    block: 'VB-2026-03',
    ob: '',
    type: 'work',
    issued: '2025-06-01',
    validUntil: '2026-05-31',
    entry: '',
    status: 'expired'
  },
  {
    no: 'V-2025-088',
    block: 'VB-2025-01',
    ob: '',
    type: 'work',
    issued: '2025-08-10',
    validUntil: '2027-08-09',
    entry: '',
    status: 'cancelled'
  }
];

// Onboarding pipeline (§4.7). type: overseas | transfer. stages: {n: dateISO}.
export const ONBOARDING = [
  {
    id: 'OB-2026-012',
    type: 'overseas',
    emp: 'EMP-0021',
    nameEn: 'Imran Khan',
    nameAr: 'عمران خان',
    nat: 'Pakistan',
    prof: 'electrician',
    agent: 'AG-02',
    visa: 'V-2026-101',
    stage: 10,
    stages: {
      1: '2026-06-02',
      2: '2026-07-10',
      3: '2026-07-30',
      4: '2026-08-03',
      5: '2026-08-12',
      6: '2026-08-14',
      7: '2026-08-18',
      8: '2026-08-18',
      9: '2026-09-01',
      10: '2026-09-01'
    },
    costs: [
      { label: 'Visa + agent fee', amount: 5700 },
      { label: 'Ticket + entry', amount: 1400 },
      { label: 'Medical + Iqama year 1', amount: 2150 }
    ]
  },
  {
    id: 'OB-2026-016',
    type: 'overseas',
    emp: '',
    nameEn: 'Sunil Thapa',
    nameAr: 'سونيل ثابا',
    nat: 'Nepal',
    prof: 'construction',
    agent: 'AG-01',
    visa: 'V-2026-501',
    stage: 2,
    stages: { 1: '2026-07-25', 2: '2026-08-20' },
    costs: [
      { label: 'Visa + agent fee', amount: 5200 },
      { label: 'Home-country medical', amount: 350 }
    ]
  },
  {
    id: 'OB-2026-017',
    type: 'overseas',
    emp: '',
    nameEn: 'Arjun Mehta',
    nameAr: 'أرجون ميهتا',
    nat: 'India',
    prof: 'driver',
    agent: 'AG-02',
    visa: 'V-2026-502',
    stage: 3,
    stages: { 1: '2026-07-30', 2: '2026-08-28', 3: '2026-09-08' },
    costs: [
      { label: 'Visa + agent fee', amount: 5400 },
      { label: 'Ticket + entry', amount: 1250 }
    ]
  },
  {
    id: 'OB-2026-018',
    type: 'transfer',
    emp: '',
    nameEn: 'Faisal Nadeem',
    nameAr: 'فيصل نديم',
    nat: 'Pakistan',
    prof: 'electrician',
    agent: '',
    visa: '',
    transfer: 'QX-2026-021',
    stage: 6,
    stages: { 1: '2026-08-01' },
    costs: [{ label: 'Qiwa transfer fee', amount: 4000 }]
  }
];

// Qiwa transfer cases (local-hire expats skip onboarding stages 2–5).
export const TRANSFERS = [
  {
    id: 'QX-2026-021',
    ob: 'OB-2026-018',
    nameEn: 'Faisal Nadeem',
    from: 'Al-Noor Contracting',
    fee: 4000,
    requested: '2026-08-20',
    noticeEnd: '2026-09-20',
    released: true,
    status: 'in-progress'
  },
  {
    id: 'QX-2026-015',
    ob: '',
    nameEn: 'Daniyal Sheikh',
    from: 'Riyadh Build Co.',
    fee: 2000,
    requested: '2026-05-10',
    noticeEnd: '2026-06-10',
    released: true,
    completed: '2026-06-30',
    status: 'completed'
  }
];

// Residency documents per expat (passport + medical insurance + traffic fines).
export const RESIDENCY_DOCS = [
  {
    emp: 'EMP-0006',
    passport: 'N100006',
    passportExp: '2029-04-11',
    ins: 'Bupa',
    insExp: '2027-03-14',
    fines: 0
  },
  {
    emp: 'EMP-0007',
    passport: 'P200007',
    passportExp: '2028-11-02',
    ins: 'Tawuniya',
    insExp: '2027-01-22',
    fines: 600
  },
  {
    emp: 'EMP-0008',
    passport: 'P300008',
    passportExp: '2029-01-19',
    ins: 'Bupa',
    insExp: '2026-09-28',
    fines: 0
  },
  {
    emp: 'EMP-0009',
    passport: 'F400009',
    passportExp: '2028-06-30',
    ins: 'Bupa',
    insExp: '2027-05-30',
    fines: 0
  },
  {
    emp: 'EMP-0010',
    passport: 'B500010',
    passportExp: '2029-09-14',
    ins: 'Tawuniya',
    insExp: '2027-02-11',
    fines: 0
  },
  {
    emp: 'EMP-0011',
    passport: 'B600011',
    passportExp: '2027-02-10',
    ins: 'Bupa',
    insExp: '2026-12-05',
    fines: 0
  },
  {
    emp: 'EMP-0012',
    passport: 'F700012',
    passportExp: '2028-03-22',
    ins: 'Bupa',
    insExp: '2026-10-15',
    fines: 0
  },
  {
    emp: 'EMP-0013',
    passport: 'N800013',
    passportExp: '2030-01-05',
    ins: 'Tawuniya',
    insExp: '2027-04-02',
    fines: 0
  },
  {
    emp: 'EMP-0014',
    passport: 'N900014',
    passportExp: '2029-07-17',
    ins: 'Bupa',
    insExp: '2027-06-19',
    fines: 0
  },
  {
    emp: 'EMP-0015',
    passport: 'P110015',
    passportExp: '2028-12-09',
    ins: 'Bupa',
    insExp: '2027-02-27',
    fines: 0
  },
  {
    emp: 'EMP-0016',
    passport: 'N120016',
    passportExp: '2029-05-25',
    ins: 'Tawuniya',
    insExp: '2026-11-20',
    fines: 0
  },
  {
    emp: 'EMP-0017',
    passport: 'B130017',
    passportExp: '2028-08-08',
    ins: 'Bupa',
    insExp: '2026-08-30',
    fines: 0
  },
  {
    emp: 'EMP-0018',
    passport: 'E140018',
    passportExp: '2029-02-28',
    ins: 'MedGulf',
    insExp: '2027-01-09',
    fines: 0
  },
  {
    emp: 'EMP-0019',
    passport: 'P150019',
    passportExp: '2028-10-11',
    ins: 'Bupa',
    insExp: '2027-03-25',
    fines: 0
  },
  {
    emp: 'EMP-0020',
    passport: 'N160020',
    passportExp: '2029-06-19',
    ins: 'Tawuniya',
    insExp: '2027-07-12',
    fines: 0
  },
  {
    emp: 'EMP-0021',
    passport: 'P170021',
    passportExp: '2030-05-01',
    ins: '',
    insExp: '',
    fines: 0
  },
  {
    emp: 'EMP-0022',
    passport: 'E180022',
    passportExp: '2028-04-27',
    ins: 'Bupa',
    insExp: '2027-05-17',
    fines: 0
  },
  {
    emp: 'EMP-0023',
    passport: 'N190023',
    passportExp: '2029-11-30',
    ins: 'Tawuniya',
    insExp: '2027-02-03',
    fines: 0
  },
  {
    emp: 'EMP-0024',
    passport: 'F200024',
    passportExp: '2028-07-15',
    ins: 'Bupa',
    insExp: '2027-06-06',
    fines: 0
  }
];

// Document vault. expires: '' = no expiry. Seeded rows are metadata records.
export const DOC_TYPES = [
  { code: 'contract', en: 'Employment contract', ar: 'عقد العمل' },
  { code: 'iqama', en: 'Iqama copy', ar: 'صورة الإقامة' },
  { code: 'passport', en: 'Passport copy', ar: 'صورة الجواز' },
  { code: 'visa', en: 'Visa copy', ar: 'صورة التأشيرة' },
  { code: 'insurance', en: 'Insurance card', ar: 'بطاقة التأمين' },
  { code: 'medical', en: 'Medical / fitness', ar: 'الكشف الطبي' },
  { code: 'qiwa', en: 'Qiwa record', ar: 'سجل قوى' },
  { code: 'iban', en: 'IBAN letter', ar: 'خطاب الآيبان' },
  { code: 'photo', en: 'Personal photo', ar: 'الصورة الشخصية' },
  { code: 'client-cr', en: 'Client CR', ar: 'سجل العميل' },
  { code: 'other', en: 'Other', ar: 'أخرى' }
];

export const DOCUMENTS = [
  {
    id: 'DOC-001',
    type: 'contract',
    emp: 'EMP-0006',
    title: 'Employment contract — Rajesh Kumar',
    uploaded: '2026-01-06',
    expires: '',
    size: '186 KB'
  },
  {
    id: 'DOC-002',
    type: 'iqama',
    emp: 'EMP-0006',
    title: 'Iqama copy — Rajesh Kumar',
    uploaded: '2026-03-15',
    expires: '2027-03-14',
    size: '240 KB'
  },
  {
    id: 'DOC-003',
    type: 'passport',
    emp: 'EMP-0006',
    title: 'Passport copy — Rajesh Kumar',
    uploaded: '2026-01-06',
    expires: '2029-04-11',
    size: '310 KB'
  },
  {
    id: 'DOC-004',
    type: 'insurance',
    emp: 'EMP-0006',
    title: 'Insurance card — Bupa',
    uploaded: '2026-03-15',
    expires: '2027-03-14',
    size: '150 KB'
  },
  {
    id: 'DOC-005',
    type: 'iban',
    emp: 'EMP-0006',
    title: 'IBAN letter — Al Rajhi',
    uploaded: '2026-01-12',
    expires: '',
    size: '120 KB'
  },
  {
    id: 'DOC-006',
    type: 'contract',
    emp: 'EMP-0013',
    title: 'Employment contract — Suresh Patel',
    uploaded: '2026-01-13',
    expires: '',
    size: '190 KB'
  },
  {
    id: 'DOC-007',
    type: 'iqama',
    emp: 'EMP-0008',
    title: 'Iqama copy — Mohammad Asif',
    uploaded: '2025-09-29',
    expires: '2026-09-28',
    size: '238 KB'
  },
  {
    id: 'DOC-008',
    type: 'iqama',
    emp: 'EMP-0012',
    title: 'Iqama copy — Maria Santos',
    uploaded: '2025-10-16',
    expires: '2026-10-15',
    size: '242 KB'
  },
  {
    id: 'DOC-009',
    type: 'iqama',
    emp: 'EMP-0016',
    title: 'Iqama copy — Deepak Yadav',
    uploaded: '2025-11-21',
    expires: '2026-11-20',
    size: '235 KB'
  },
  {
    id: 'DOC-010',
    type: 'passport',
    emp: 'EMP-0011',
    title: 'Passport copy — Abdul Malek',
    uploaded: '2023-01-26',
    expires: '2027-02-10',
    size: '305 KB'
  },
  {
    id: 'DOC-011',
    type: 'insurance',
    emp: 'EMP-0017',
    title: 'Insurance card — Bupa (expired)',
    uploaded: '2025-08-31',
    expires: '2026-08-30',
    size: '148 KB'
  },
  {
    id: 'DOC-012',
    type: 'visa',
    emp: '',
    title: 'Work visa V-2026-501 — Sunil Thapa',
    uploaded: '2026-08-20',
    expires: '2027-08-19',
    size: '175 KB'
  },
  {
    id: 'DOC-013',
    type: 'medical',
    emp: 'EMP-0021',
    title: 'Fitness certificate — Imran Khan',
    uploaded: '2026-08-05',
    expires: '',
    size: '210 KB'
  },
  {
    id: 'DOC-014',
    type: 'qiwa',
    emp: 'EMP-0001',
    title: 'Qiwa contract print — Abdullah Al-Otaibi',
    uploaded: '2024-03-02',
    expires: '',
    size: '160 KB'
  },
  {
    id: 'DOC-015',
    type: 'iban',
    emp: 'EMP-0013',
    title: 'IBAN letter — SNB',
    uploaded: '2026-01-14',
    expires: '',
    size: '118 KB'
  },
  {
    id: 'DOC-016',
    type: 'client-cr',
    client: 'CL-001',
    title: 'Commercial registration — Al-Bina',
    uploaded: '2026-01-12',
    expires: '2026-11-30',
    size: '280 KB'
  },
  {
    id: 'DOC-017',
    type: 'client-cr',
    client: 'CL-002',
    title: 'Commercial registration — Facility Care',
    uploaded: '2026-02-01',
    expires: '2027-05-01',
    size: '275 KB'
  },
  {
    id: 'DOC-018',
    type: 'photo',
    emp: 'EMP-0021',
    title: 'Personal photo — Imran Khan',
    uploaded: '2026-08-01',
    expires: '',
    size: '95 KB'
  },
  {
    id: 'DOC-019',
    type: 'qiwa',
    emp: 'EMP-0011',
    title: 'Qiwa transfer request — Abdul Malek',
    uploaded: '2026-08-25',
    expires: '',
    size: '140 KB'
  }
];

// Reporting lines (org chart). mgr: null = root.
export const ORG_LINKS = [
  { emp: 'EMP-0001', mgr: null },
  { emp: 'EMP-0002', mgr: 'EMP-0001' },
  { emp: 'EMP-0003', mgr: 'EMP-0001' },
  { emp: 'EMP-0004', mgr: 'EMP-0001' },
  { emp: 'EMP-0005', mgr: 'EMP-0001' },
  { emp: 'EMP-0024', mgr: 'EMP-0001' },
  { emp: 'EMP-0006', mgr: 'EMP-0002' },
  { emp: 'EMP-0007', mgr: 'EMP-0002' },
  { emp: 'EMP-0008', mgr: 'EMP-0002' },
  { emp: 'EMP-0009', mgr: 'EMP-0002' },
  { emp: 'EMP-0010', mgr: 'EMP-0002' },
  { emp: 'EMP-0011', mgr: 'EMP-0002' },
  { emp: 'EMP-0012', mgr: 'EMP-0002' },
  { emp: 'EMP-0013', mgr: 'EMP-0002' },
  { emp: 'EMP-0014', mgr: 'EMP-0002' },
  { emp: 'EMP-0015', mgr: 'EMP-0002' },
  { emp: 'EMP-0016', mgr: 'EMP-0002' },
  { emp: 'EMP-0017', mgr: 'EMP-0002' },
  { emp: 'EMP-0018', mgr: 'EMP-0002' },
  { emp: 'EMP-0019', mgr: 'EMP-0002' },
  { emp: 'EMP-0020', mgr: 'EMP-0002' },
  { emp: 'EMP-0021', mgr: 'EMP-0002' },
  { emp: 'EMP-0022', mgr: 'EMP-0002' },
  { emp: 'EMP-0023', mgr: 'EMP-0002' }
];
