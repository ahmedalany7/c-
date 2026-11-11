import { useEffect } from 'react';
import Cover from './Cover.jsx';
import { typeOf } from '../data.js';
import { formatPrice, timeAgo, whatsappLink } from '../utils.js';

export default function ListingModal({ listing, onClose, isFav, onFav, onDelete }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const t = typeOf(listing.type);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="إغلاق">✕</button>
        <Cover listing={listing} className="modal-cover" />
        <div className="modal-body">
          <div className="modal-head">
            <div>
              <span className={`badge inline ${listing.purpose}`}>{listing.purpose === 'sale' ? 'للبيع' : 'للإيجار'}</span>
              <h2>{listing.title}</h2>
              <p className="loc">📍 {listing.governorate} - {listing.area} · {timeAgo(listing.createdAt)}</p>
            </div>
            <div className="price big">
              {formatPrice(listing.price, listing.currency)}
              {listing.purpose === 'rent' && <small> / شهرياً</small>}
            </div>
          </div>
          <div className="spec-grid">
            <div><b>{t.icon}</b><span>{t.label}</span></div>
            <div><b>{listing.size}</b><span>م²</span></div>
            <div><b>{listing.rooms || '-'}</b><span>غرف</span></div>
            <div><b>{listing.baths || '-'}</b><span>حمامات</span></div>
          </div>
          <h4>الوصف</h4>
          <p className="desc">{listing.description}</p>
          <div className="actions">
            <a className="btn primary" href={`tel:${listing.phone}`}>📞 اتصال {listing.phone}</a>
            <a className="btn whatsapp" target="_blank" rel="noreferrer"
               href={whatsappLink(listing.phone, `مرحباً، أستفسر عن إعلان: ${listing.title}`)}>واتساب</a>
            <button className="btn ghost" onClick={() => onFav(listing.id)}>{isFav ? '♥ في المفضلة' : '♡ أضف للمفضلة'}</button>
            {listing.mine && (
              <button className="btn danger" onClick={() => { if (confirm('حذف هذا الإعلان؟')) onDelete(listing.id); }}>حذف إعلاني</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
