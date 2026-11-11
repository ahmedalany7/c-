import Cover from './Cover.jsx';
import { typeOf } from '../data.js';
import { formatPrice, timeAgo } from '../utils.js';

export default function ListingCard({ listing, isFav, onFav, onOpen, index = 0 }) {
  const t = typeOf(listing.type);
  return (
    <article className="card" data-reveal style={{ '--i': index % 6 }} onClick={() => onOpen(listing)}>
      <div className="card-media">
        <Cover listing={listing} />
        <span className={`badge ${listing.purpose}`}>{listing.purpose === 'sale' ? 'للبيع' : 'للإيجار'}</span>
        {listing.featured && <span className="badge featured">مميز ⭐</span>}
        <button
          className={`fav ${isFav ? 'on' : ''}`}
          aria-label="أضف للمفضلة"
          onClick={(e) => { e.stopPropagation(); onFav(listing.id); }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" /></svg>
        </button>
      </div>
      <div className="card-body">
        <div className="price">
          {formatPrice(listing.price, listing.currency)}
          {listing.purpose === 'rent' && <small> / شهرياً</small>}
        </div>
        <h3>{listing.title}</h3>
        <p className="loc">📍 {listing.governorate} - {listing.area}</p>
        <div className="specs">
          <span>{t.icon} {t.label}</span>
          <span>📐 {listing.size} م²</span>
          {listing.rooms > 0 && <span>🛏 {listing.rooms}</span>}
          {listing.baths > 0 && <span>🛁 {listing.baths}</span>}
        </div>
        <div className="card-foot"><span>{timeAgo(listing.createdAt)}</span><span className="more">التفاصيل ←</span></div>
      </div>
    </article>
  );
}
