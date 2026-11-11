import Cover from './Cover.jsx';
import { typeOf } from '../data.js';
import { formatPrice, timeAgo } from '../utils.js';

export default function ListingCard({ listing, isFav, onFav, onOpen }) {
  const t = typeOf(listing.type);
  return (
    <article className="card" onClick={() => onOpen(listing)}>
      <div className="card-media">
        <Cover listing={listing} />
        <span className={`badge ${listing.purpose}`}>{listing.purpose === 'sale' ? 'للبيع' : 'للإيجار'}</span>
        {listing.featured && <span className="badge featured">مميز ⭐</span>}
        <button
          className={`fav ${isFav ? 'on' : ''}`}
          aria-label="أضف للمفضلة"
          onClick={(e) => { e.stopPropagation(); onFav(listing.id); }}
        >
          {isFav ? '♥' : '♡'}
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
        <div className="card-foot">{timeAgo(listing.createdAt)}</div>
      </div>
    </article>
  );
}
