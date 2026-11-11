export const GOVERNORATES = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'السليمانية', 'دهوك', 'كركوك', 'النجف',
  'كربلاء', 'بابل', 'الأنبار', 'ديالى', 'واسط', 'صلاح الدين', 'ذي قار', 'ميسان',
  'المثنى', 'القادسية', 'حلبجة',
];

export const TYPES = [
  { id: 'house', label: 'بيت', icon: '🏠' },
  { id: 'apartment', label: 'شقة', icon: '🏢' },
  { id: 'land', label: 'أرض', icon: '🌍' },
  { id: 'villa', label: 'فيلا', icon: '🏡' },
  { id: 'shop', label: 'محل تجاري', icon: '🏬' },
  { id: 'office', label: 'مكتب', icon: '💼' },
];

export const typeOf = (id) => TYPES.find((t) => t.id === id) || TYPES[0];

const daysAgo = (d) => new Date(Date.now() - d * 86400000).toISOString();

export const SAMPLE_LISTINGS = [
  { id: 's1', title: 'بيت طابقين في المنصور', purpose: 'sale', type: 'house', governorate: 'بغداد', area: 'المنصور', price: 650000, currency: 'USD', size: 300, rooms: 5, baths: 3, phone: '07701234567', description: 'بيت حديث البناء، طابقين، واجهة حجر، كراج لسيارتين، قريب من الخدمات والمدارس. سند طابو صرف.', createdAt: daysAgo(1), featured: true },
  { id: 's2', title: 'شقة مفروشة في الجادرية', purpose: 'rent', type: 'apartment', governorate: 'بغداد', area: 'الجادرية', price: 1200, currency: 'USD', size: 140, rooms: 3, baths: 2, phone: '07801234567', description: 'شقة مفروشة بالكامل، الطابق الرابع، مصعد، مولدة 24 ساعة، حراسة. إيجار شهري.', createdAt: daysAgo(2) },
  { id: 's3', title: 'أرض سكنية في حي الجامعة', purpose: 'sale', type: 'land', governorate: 'البصرة', area: 'حي الجامعة', price: 250000000, currency: 'IQD', size: 200, rooms: 0, baths: 0, phone: '07711234567', description: 'قطعة أرض سكنية على شارعين، مساحة 200 متر، سند طابو، مناسبة للبناء الفوري.', createdAt: daysAgo(3) },
  { id: 's4', title: 'فيلا فاخرة في إمباير', purpose: 'sale', type: 'villa', governorate: 'أربيل', area: 'إمباير وورلد', price: 480000, currency: 'USD', size: 400, rooms: 6, baths: 5, phone: '07501234567', description: 'فيلا فاخرة مع حديقة ومسبح، تشطيب سوبر ديلوكس، مجمع سكني مغلق بخدمات كاملة.', createdAt: daysAgo(4), featured: true },
  { id: 's5', title: 'محل تجاري على شارع رئيسي', purpose: 'rent', type: 'shop', governorate: 'النجف', area: 'شارع الكوفة', price: 1500000, currency: 'IQD', size: 60, rooms: 0, baths: 1, phone: '07821234567', description: 'محل تجاري بموقع حيوي، واجهة زجاجية، مناسب لجميع الأنشطة التجارية.', createdAt: daysAgo(5) },
  { id: 's6', title: 'شقة في مجمع سكني حديث', purpose: 'sale', type: 'apartment', governorate: 'السليمانية', area: 'سرجنار', price: 95000, currency: 'USD', size: 160, rooms: 3, baths: 2, phone: '07701112233', description: 'شقة بإطلالة جبلية، مجمع حديث مع موقف سيارات وحديقة أطفال، تقسيط متاح.', createdAt: daysAgo(6) },
  { id: 's7', title: 'بيت للإيجار قرب العتبة', purpose: 'rent', type: 'house', governorate: 'كربلاء', area: 'حي الحسين', price: 900000, currency: 'IQD', size: 200, rooms: 4, baths: 2, phone: '07731234567', description: 'بيت طابق واحد، 4 غرف نوم، صالة واسعة، مطبخ حديث، قريب من مركز المدينة.', createdAt: daysAgo(7) },
  { id: 's8', title: 'مكتب إداري في الكرادة', purpose: 'rent', type: 'office', governorate: 'بغداد', area: 'الكرادة', price: 800, currency: 'USD', size: 120, rooms: 4, baths: 1, phone: '07901234567', description: 'مكتب إداري مجهز، 4 غرف، استقبال، مناسب للشركات والعيادات.', createdAt: daysAgo(8) },
  { id: 's9', title: 'بيت في حي الزهور', purpose: 'sale', type: 'house', governorate: 'نينوى', area: 'الزهور', price: 180000, currency: 'USD', size: 250, rooms: 4, baths: 2, phone: '07741234567', description: 'بيت مرمم بالكامل، حديقة أمامية، منطقة هادئة وآمنة قريبة من الجامعة.', createdAt: daysAgo(10) },
];
