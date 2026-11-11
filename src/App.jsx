import { useEffect, useMemo, useState } from 'react';
import { SAMPLE_LISTINGS, GOVERNORATES } from './data.js';
import { loadLS, saveLS, toIQD } from './utils.js';
import { useReveal, CountUp, useScrolled } from './hooks.jsx';
import ListingCard from './components/ListingCard.jsx';
import Filters from './components/Filters.jsx';
import ListingModal from './components/ListingModal.jsx';
import AddListing from './components/AddListing.jsx';
import Support from './components/Support.jsx';
import { SITE } from './config.js';

const DEFAULT_FILTERS = { purpose: 'all', governorate: '', type: '', min: '', max: '', rooms: '0' };

const CITIES = [
  ['بغداد', 'العاصمة'], ['البصرة', 'ثغر العراق'], ['أربيل', 'عاصمة الإقليم'], ['النجف', 'المدينة المقدسة'],
  ['كربلاء', 'المدينة المقدسة'], ['السليمانية', 'مدينة الجبال'], ['نينوى', 'أم الربيعين'], ['كركوك', 'مدينة النفط'],
];

const FEATURES = [
  ['🔍', 'بحث ذكي وسريع', 'صفِّ النتائج حسب المحافظة والنوع والسعر وعدد الغرف خلال ثوانٍ.'],
  ['📞', 'تواصل مباشر', 'اتصل بالمعلن أو راسله على واتساب بضغطة زر، بدون وسطاء.'],
  ['🆓', 'نشر مجاني', 'انشر إعلانك مجاناً مع الصور خلال أقل من دقيقة.'],
  ['🛡️', 'نصائح أمان', 'إرشادات واضحة لحمايتك قبل الشراء أو الإيجار.'],
];

const STEPS = [
  ['1', 'أنشئ إعلانك', 'اضغط "أضف إعلان" واملأ بيانات عقارك وارفع صورة.'],
  ['2', 'يظهر للمشترين', 'يظهر إعلانك فوراً في نتائج البحث للمهتمين.'],
  ['3', 'استقبل الاتصالات', 'يتواصل معك المهتمون مباشرة عبر الهاتف أو واتساب.'],
];

// Stylised Iraqi skyline: domes, minarets and towers
function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 160 V120 h60 v-30 h30 v30 h40 v-55 h8 v-20 l4 -8 l4 8 v20 h8 v55 h50
        v-40 q35 -45 70 0 v40 h40 v-80 h50 v80 h30 v-25 h60 v25 h20 v-70 h6 v-30 l5 -10 l5 10 v30 h6 v70 h40
        v-35 q45 -55 90 0 v35 h50 v-60 h70 v60 h30 v-95 l30 -20 l30 20 v95 h40 v-30 h50 v30 h20 v-65 h6 v-25 l5 -10 l5 10 v25 h6 v65
        h40 v-45 q40 -50 80 0 v45 h60 v-70 h40 v70 h50 v-40 h70 v40 h60 H1440 V160Z" />
    </svg>
  );
}

export default function App() {
  const [userListings, setUserListings] = useState(() => loadLS('aqar_listings', []));
  const [favs, setFavs] = useState(() => loadLS('aqar_favs', []));
  const [theme, setTheme] = useState(() => loadLS('aqar_theme', window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [view, setViewState] = useState(() => (location.hash === '#support' ? 'support' : 'all')); // all | favs | mine | support
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState('');
  const [menu, setMenu] = useState(false);
  const scrolled = useScrolled();

  const setView = (v) => {
    setViewState(v);
    setMenu(false);
    history.replaceState(null, '', v === 'support' ? '#support' : location.pathname + location.search);
    if (v === 'favs' || v === 'mine') setTimeout(() => scrollToListings(), 50);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToListings = () => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const onHash = () => setViewState(location.hash === '#support' ? 'support' : 'all');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => saveLS('aqar_listings', userListings), [userListings]);
  useEffect(() => saveLS('aqar_favs', favs), [favs]);
  useEffect(() => { document.documentElement.dataset.theme = theme; saveLS('aqar_theme', theme); }, [theme]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    document.body.style.overflow = selected || adding ? 'hidden' : '';
  }, [selected, adding]);

  const all = useMemo(() => [...userListings, ...SAMPLE_LISTINGS], [userListings]);

  const results = useMemo(() => {
    const q = query.trim();
    const list = all.filter((l) => {
      if (view === 'favs' && !favs.includes(l.id)) return false;
      if (view === 'mine' && !l.mine) return false;
      if (filters.purpose !== 'all' && l.purpose !== filters.purpose) return false;
      if (filters.governorate && l.governorate !== filters.governorate) return false;
      if (filters.type && l.type !== filters.type) return false;
      if (Number(filters.rooms) && l.rooms < Number(filters.rooms)) return false;
      const iqd = toIQD(l.price, l.currency);
      if (filters.min && iqd < Number(filters.min)) return false;
      if (filters.max && iqd > Number(filters.max)) return false;
      if (q && ![l.title, l.area, l.governorate, l.description].join(' ').includes(q)) return false;
      return true;
    });
    const by = {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      priceAsc: (a, b) => toIQD(a.price, a.currency) - toIQD(b.price, b.currency),
      priceDesc: (a, b) => toIQD(b.price, b.currency) - toIQD(a.price, a.currency),
      size: (a, b) => b.size - a.size,
    };
    return list.sort(by[sort]);
  }, [all, filters, query, sort, view, favs]);

  useReveal([view, results.length]);

  const toggleFav = (id) => {
    setToast(favs.includes(id) ? 'أُزيل من المفضلة' : 'أُضيف إلى المفضلة ❤️');
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };
  const addListing = (l) => { setUserListings((u) => [l, ...u]); setAdding(false); setToast('تم نشر إعلانك بنجاح ✅'); };
  const deleteListing = (id) => { setUserListings((u) => u.filter((l) => l.id !== id)); setSelected(null); setToast('تم حذف الإعلان'); };
  const pickCity = (g) => { setFilters({ ...DEFAULT_FILTERS, governorate: g }); setViewState('all'); scrollToListings(); };

  const counts = {
    total: all.length,
    sale: all.filter((l) => l.purpose === 'sale').length,
    rent: all.filter((l) => l.purpose === 'rent').length,
  };

  const NavBtn = ({ v, children }) => (
    <button className={view === v ? 'active' : ''} onClick={() => setView(v)}>{children}</button>
  );

  return (
    <>
      <header className={`nav ${scrolled || view === 'support' ? 'solid' : ''}`}>
        <div className="container nav-inner">
          <a className="logo" href="#" onClick={(e) => { e.preventDefault(); setView('all'); }}>
            <span className="logo-mark">ع</span>
            <span>عقارات <em>العراق</em></span>
          </a>
          <nav className={menu ? 'open' : ''}>
            <NavBtn v="all">الرئيسية</NavBtn>
            <NavBtn v="favs">المفضلة {favs.length > 0 && <i className="pill">{favs.length}</i>}</NavBtn>
            <NavBtn v="mine">إعلاناتي</NavBtn>
            <NavBtn v="support">الدعم</NavBtn>
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" aria-label="تبديل الوضع الليلي" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="btn gold shine" onClick={() => setAdding(true)}>+ أضف إعلان</button>
            <button className="icon-btn burger" aria-label="القائمة" onClick={() => setMenu(!menu)}>{menu ? '✕' : '☰'}</button>
          </div>
        </div>
      </header>

      <div key={view === 'support' ? 'support' : 'home'} className="page">
        {view === 'support' ? <Support /> : (<>
          <section className="hero">
            <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
            <div className="container hero-inner">
              <span className="eyebrow">🏆 منصة العقارات الأولى في العراق</span>
              <h1>اعثر على <span className="grad-text">بيت أحلامك</span><br />في كل محافظات العراق</h1>
              <p>بيوت، شقق، أراضي، فلل ومحلات للبيع والإيجار — من بغداد إلى البصرة وأربيل.</p>
              <div className="search">
                <div className="search-field">
                  <span>🔎</span>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && scrollToListings()}
                    placeholder="ابحث بالمنطقة أو الحي... مثال: المنصور" />
                </div>
                <select value={filters.governorate} onChange={(e) => setFilters({ ...filters, governorate: e.target.value })}>
                  <option value="">كل المحافظات</option>
                  {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
                </select>
                <button className="btn gold" onClick={scrollToListings}>ابحث الآن</button>
              </div>
              <div className="quick">
                {[['all', 'الكل'], ['sale', 'للبيع'], ['rent', 'للإيجار']].map(([v, l]) => (
                  <button key={v} className={filters.purpose === v ? 'on' : ''} onClick={() => setFilters({ ...filters, purpose: v })}>{l}</button>
                ))}
              </div>
              <div className="stats">
                <div><CountUp to={counts.total} /><span>إعلان نشط</span></div>
                <div><CountUp to={counts.sale} /><span>للبيع</span></div>
                <div><CountUp to={counts.rent} /><span>للإيجار</span></div>
                <div><CountUp to={GOVERNORATES.length} /><span>محافظة</span></div>
              </div>
            </div>
            <Skyline />
          </section>

          <section className="container section">
            <div className="section-head" data-reveal>
              <span className="eyebrow dark">المدن</span>
              <h2>تصفح حسب المدينة</h2>
            </div>
            <div className="city-list">
              {CITIES.map(([g, sub], i) => (
                <button key={g} className="city" data-reveal style={{ '--i': i }} onClick={() => pickCity(g)}>
                  <span className="city-bg" />
                  <b>{g}</b>
                  <small>{sub}</small>
                  <span className="city-count">{all.filter((l) => l.governorate === g).length} إعلان</span>
                </button>
              ))}
            </div>
          </section>

          <main id="listings" className="container layout">
            <Filters filters={filters} setFilters={setFilters} onReset={() => { setFilters(DEFAULT_FILTERS); setQuery(''); }} />
            <section>
              <div className="toolbar">
                <div>
                  <span className="eyebrow dark">{view === 'favs' ? '❤️' : view === 'mine' ? '📋' : '✨'} العقارات</span>
                  <h2>
                    {view === 'favs' ? 'المفضلة' : view === 'mine' ? 'إعلاناتي' : 'أحدث الإعلانات'}
                    <small> ({results.length} نتيجة)</small>
                  </h2>
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">الأحدث</option>
                  <option value="priceAsc">السعر: من الأقل</option>
                  <option value="priceDesc">السعر: من الأعلى</option>
                  <option value="size">المساحة الأكبر</option>
                </select>
              </div>
              {results.length ? (
                <div className="grid">
                  {results.map((l, i) => (
                    <ListingCard key={l.id} index={i} listing={l} isFav={favs.includes(l.id)} onFav={toggleFav} onOpen={setSelected} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <div className="empty-icon">🏚️</div>
                  <p>لا توجد نتائج مطابقة</p>
                  {view === 'mine'
                    ? <button className="btn gold" onClick={() => setAdding(true)}>أضف أول إعلان لك</button>
                    : <button className="btn ghost" onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(''); setViewState('all'); }}>عرض كل الإعلانات</button>}
                </div>
              )}
            </section>
          </main>

          <section className="features">
            <div className="container">
              <div className="section-head center" data-reveal>
                <span className="eyebrow">لماذا نحن</span>
                <h2>كل ما تحتاجه للعثور على عقارك</h2>
              </div>
              <div className="feature-grid">
                {FEATURES.map(([icon, t, d], i) => (
                  <div key={t} className="feature" data-reveal style={{ '--i': i }}>
                    <div className="feature-icon">{icon}</div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="container section">
            <div className="section-head center" data-reveal>
              <span className="eyebrow dark">بخطوات بسيطة</span>
              <h2>كيف تبيع أو تؤجر عقارك؟</h2>
            </div>
            <div className="steps">
              {STEPS.map(([n, t, d], i) => (
                <div key={n} className="step" data-reveal style={{ '--i': i }}>
                  <span className="step-num">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="container">
            <div className="cta" data-reveal>
              <div>
                <h2>هل لديك عقار للبيع أو الإيجار؟</h2>
                <p>انشر إعلانك مجاناً الآن ووصّله لآلاف الباحثين في العراق.</p>
              </div>
              <button className="btn light shine" onClick={() => setAdding(true)}>انشر إعلانك مجاناً</button>
            </div>
          </section>
        </>)}
      </div>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <a className="logo" href="#" onClick={(e) => { e.preventDefault(); setView('all'); }}>
              <span className="logo-mark">ع</span><span>عقارات <em>العراق</em></span>
            </a>
            <p className="muted">منصة إعلانات عقارية مجانية تجمع البائع والمشتري في جميع محافظات العراق.</p>
          </div>
          <div>
            <h4>روابط سريعة</h4>
            <button onClick={() => setView('all')}>الرئيسية</button>
            <button onClick={() => setAdding(true)}>أضف إعلان</button>
            <button onClick={() => setView('favs')}>المفضلة</button>
            <button onClick={() => setView('support')}>الدعم والمساعدة</button>
          </div>
          <div>
            <h4>أشهر المدن</h4>
            {CITIES.slice(0, 4).map(([g]) => <button key={g} onClick={() => { setViewState('all'); setTimeout(() => pickCity(g), 50); }}>{g}</button>)}
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} {SITE.ownerAr} ({SITE.owner}). جميع الحقوق محفوظة.</p>
          <p className="muted">تحويل الأسعار تقريبي (1$ ≈ 1,310 د.ع). تحقق دائماً من سند الملكية قبل الشراء.</p>
        </div>
      </footer>

      <button className={`to-top ${scrolled ? 'show' : ''}`} aria-label="للأعلى" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>

      {selected && (
        <ListingModal listing={selected} onClose={() => setSelected(null)}
          isFav={favs.includes(selected.id)} onFav={toggleFav} onDelete={deleteListing} />
      )}
      {adding && <AddListing onClose={() => setAdding(false)} onSubmit={addListing} />}
      {toast && <div className="toast" key={toast}>{toast}</div>}
    </>
  );
}
