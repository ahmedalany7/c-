import { GOVERNORATES, TYPES } from '../data.js';

export default function Filters({ filters, setFilters, onReset }) {
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  return (
    <aside className="filters">
      <h3>تصفية النتائج</h3>
      <label>نوع العرض
        <div className="seg">
          {[['all', 'الكل'], ['sale', 'بيع'], ['rent', 'إيجار']].map(([v, l]) => (
            <button key={v} className={filters.purpose === v ? 'active' : ''} onClick={() => setFilters({ ...filters, purpose: v })}>{l}</button>
          ))}
        </div>
      </label>
      <label>المحافظة
        <select value={filters.governorate} onChange={set('governorate')}>
          <option value="">جميع المحافظات</option>
          {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </label>
      <label>نوع العقار
        <select value={filters.type} onChange={set('type')}>
          <option value="">جميع الأنواع</option>
          {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </label>
      <label>السعر (دينار عراقي)
        <div className="row2">
          <input type="number" min="0" placeholder="من" value={filters.min} onChange={set('min')} />
          <input type="number" min="0" placeholder="إلى" value={filters.max} onChange={set('max')} />
        </div>
      </label>
      <label>عدد الغرف (على الأقل)
        <select value={filters.rooms} onChange={set('rooms')}>
          <option value="0">أي عدد</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
        </select>
      </label>
      <button className="btn ghost full" onClick={onReset}>إعادة تعيين</button>
    </aside>
  );
}
