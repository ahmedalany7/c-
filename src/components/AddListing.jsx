import { useState } from 'react';
import { GOVERNORATES, TYPES } from '../data.js';

const EMPTY = {
  title: '', purpose: 'sale', type: 'house', governorate: 'بغداد', area: '',
  price: '', currency: 'IQD', size: '', rooms: '', baths: '', phone: '', description: '', image: '',
};

// Downscale uploaded photos so they fit in localStorage
const resizeImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      const scale = Math.min(1, 900 / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

export default function AddListing({ onClose, onSubmit }) {
  const [f, setF] = useState(EMPTY);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setF({ ...f, image: await resizeImage(file) }); } catch { setError('تعذر قراءة الصورة'); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!/^07\d{9}$/.test(f.phone.trim())) return setError('رقم الهاتف يجب أن يكون عراقياً بصيغة 07XXXXXXXXX');
    if (Number(f.price) <= 0 || Number(f.size) <= 0) return setError('أدخل سعراً ومساحة صحيحين');
    onSubmit({
      ...f,
      id: 'u' + Date.now(),
      price: Number(f.price), size: Number(f.size),
      rooms: Number(f.rooms) || 0, baths: Number(f.baths) || 0,
      phone: f.phone.trim(), createdAt: new Date().toISOString(), mine: true,
    });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal form" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="close" onClick={onClose} aria-label="إغلاق">✕</button>
        <h2>إضافة إعلان عقاري</h2>
        <div className="grid2">
          <label className="span2">عنوان الإعلان *
            <input required value={f.title} onChange={set('title')} placeholder="مثال: بيت طابقين في الأعظمية" />
          </label>
          <label>نوع العرض
            <select value={f.purpose} onChange={set('purpose')}>
              <option value="sale">للبيع</option>
              <option value="rent">للإيجار</option>
            </select>
          </label>
          <label>نوع العقار
            <select value={f.type} onChange={set('type')}>
              {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <label>المحافظة
            <select value={f.governorate} onChange={set('governorate')}>
              {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
          <label>المنطقة / الحي *
            <input required value={f.area} onChange={set('area')} placeholder="مثال: زيونة" />
          </label>
          <label>السعر *
            <input required type="number" min="1" value={f.price} onChange={set('price')} />
          </label>
          <label>العملة
            <select value={f.currency} onChange={set('currency')}>
              <option value="IQD">دينار عراقي</option>
              <option value="USD">دولار أمريكي</option>
            </select>
          </label>
          <label>المساحة (م²) *
            <input required type="number" min="1" value={f.size} onChange={set('size')} />
          </label>
          <label>رقم الهاتف *
            <input required inputMode="tel" value={f.phone} onChange={set('phone')} placeholder="07XXXXXXXXX" dir="ltr" />
          </label>
          <label>عدد الغرف
            <input type="number" min="0" value={f.rooms} onChange={set('rooms')} />
          </label>
          <label>عدد الحمامات
            <input type="number" min="0" value={f.baths} onChange={set('baths')} />
          </label>
          <label className="span2">الوصف
            <textarea rows="4" value={f.description} onChange={set('description')} placeholder="تفاصيل العقار، نوع السند، الخدمات القريبة..." />
          </label>
          <label className="span2">صورة العقار
            <input type="file" accept="image/*" onChange={onImage} />
          </label>
          {f.image && <img className="preview span2" src={f.image} alt="معاينة" />}
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn gold full shine" type="submit">نشر الإعلان</button>
      </form>
    </div>
  );
}
