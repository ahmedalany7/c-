import { useEffect, useMemo, useState } from 'react';
import { SAMPLE_LISTINGS, GOVERNORATES } from './data.js';
import { loadLS, saveLS, toIQD } from './utils.js';
import ListingCard from './components/ListingCard.jsx';
import Filters from './components/Filters.jsx';
import ListingModal from './components/ListingModal.jsx';
import AddListing from './components/AddListing.jsx';
import Support from './components/Support.jsx';
import { SITE } from './config.js';

const DEFAULT_FILTERS = { purpose: 'all', governorate: '', type: '', min: '', max: '', rooms: '0' };

export default function App() {
  const [userListings, setUserListings] = useState(() => loadLS('aqar_listings', []));
  const [favs, setFavs] = useState(() => loadLS('aqar_favs', []));
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [view, setViewState] = useState(() => (location.hash === '#support' ? 'support' : 'all')); // all | favs | mine | support
  const setView = (v) => {
    setViewState(v);
    history.replaceState(null, '', v === 'support' ? '#support' : location.pathname + location.search);
    window.scrollTo({ top: 0 });
  };
  useEffect(() => {
    const onHash = () => setViewState(location.hash === '#support' ? 'support' : 'all');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => saveLS('aqar_listings', userListings), [userListings]);
  useEffect(() => saveLS('aqar_favs', favs), [favs]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const all = useMemo(() => [...userListings, ...SAMPLE_LISTINGS], [userListings]);

  const results = useMemo(() => {
    const q = query.trim();
    let list = all.filter((l) => {
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

  const toggleFav = (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const addListing = (l) => {
    setUserListings((u) => [l, ...u]);
    setAdding(false);
    setToast('تم نشر إعلانك بنجاح ✅');
  };

  const deleteListing = (id) => {
    setUserListings((u) => u.filter((l) => l.id !== id));
    setSelected(null);
    setToast('تم حذف الإعلان');
  };

  const pickCity = (g) => {
    setFilters({ ...DEFAULT_FILTERS, governorate: g });
    setView('all');
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const counts = {
    total: all.length,
    sale: all.filter((l) => l.purpose === 'sale').length,
    rent: all.filter((l) => l.purpose === 'rent').length,
  };

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a className="logo" href="#" onClick={(e) => { e.preventDefault(); setView('all'); }}>🏘️ عقارات <span>العراق</span></a>
          <nav>
            <button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>الإعلانات</button>
            <button className={view === 'favs' ? 'active' : ''} onClick={() => setView('favs')}>المفضلة ({favs.length})</button>
            <button className={view === 'mine' ? 'active' : ''} onClick={() => setView('mine')}>إعلاناتي</button>
            <button className={view === 'support' ? 'active' : ''} onClick={() => setView('support')}>الدعم</button>
          </nav>
          <button className="btn primary" onClick={() => setAdding(true)}>+ أضف إعلان</button>
        </div>
      </header>

      {view === 'support' ? <Support /> : (<>
      <section className="hero">
        <div className="container">
          <h1>ابحث عن عقارك في العراق</h1>
          <p>بيوت، شقق، أراضي ومحلات للبيع والإيجار في جميع المحافظات</p>
          <div className="search">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالمنطقة أو الحي أو الوصف... مثال: المنصور" />
            <select value={filters.governorate} onChange={(e) => setFilters({ ...filters, governorate: e.target.value })}>
              <option value="">كل المحافظات</option>
              {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
            </select>
            <button className="btn primary" onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}>بحث</button>
          </div>
          <div className="stats">
            <div><b>{counts.total}</b><span>إعلان</span></div>
            <div><b>{counts.sale}</b><span>للبيع</span></div>
            <div><b>{counts.rent}</b><span>للإيجار</span></div>
            <div><b>{GOVERNORATES.length}</b><span>محافظة</span></div>
          </div>
        </div>
      </section>

      <section className="container cities">
        <h2>تصفح حسب المدينة</h2>
        <div className="city-list">
          {['بغداد', 'البصرة', 'أربيل', 'النجف', 'كربلاء', 'السليمانية', 'نينوى', 'كركوك'].map((g) => (
            <button key={g} className="city" onClick={() => pickCity(g)}>
              <b>{g}</b>
              <span>{all.filter((l) => l.governorate === g).length} إعلان</span>
            </button>
          ))}
        </div>
      </section>

      <main id="listings" className="container layout">
        <Filters filters={filters} setFilters={setFilters} onReset={() => { setFilters(DEFAULT_FILTERS); setQuery(''); }} />
        <section>
          <div className="toolbar">
            <h2>
              {view === 'favs' ? 'المفضلة' : view === 'mine' ? 'إعلاناتي' : 'أحدث الإعلانات'}
              <small> ({results.length} نتيجة)</small>
            </h2>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">الأحدث</option>
              <option value="priceAsc">السعر: من الأقل</option>
              <option value="priceDesc">السعر: من الأعلى</option>
              <option value="size">المساحة الأكبر</option>
            </select>
          </div>
          {results.length ? (
            <div className="grid">
              {results.map((l) => (
                <ListingCard key={l.id} listing={l} isFav={favs.includes(l.id)} onFav={toggleFav} onOpen={setSelected} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>🔍 لا توجد نتائج مطابقة</p>
              {view === 'mine' && <button className="btn primary" onClick={() => setAdding(true)}>أضف أول إعلان لك</button>}
            </div>
          )}
        </section>
      </main>
      </>)}

      <footer className="footer">
        <div className="container">
          <p>🏘️ عقارات العراق — منصة إعلانات عقارية مجانية</p>
          <p className="footer-links">
            <a href="#support" onClick={(e) => { e.preventDefault(); setView('support'); }}>الدعم والمساعدة</a>
          </p>
          <p className="muted">© {new Date().getFullYear()} {SITE.ownerAr} ({SITE.owner}). جميع الحقوق محفوظة.</p>
          <p className="muted">ملاحظة: تحويل الأسعار تقريبي (1$ ≈ 1,310 د.ع). تحقق دائماً من سند الملكية قبل الشراء.</p>
        </div>
      </footer>

      {selected && (
        <ListingModal listing={selected} onClose={() => setSelected(null)}
          isFav={favs.includes(selected.id)} onFav={toggleFav} onDelete={deleteListing} />
      )}
      {adding && <AddListing onClose={() => setAdding(false)} onSubmit={addListing} />}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
