import { typeOf } from '../data.js';

const GRADIENTS = {
  house: ['#0f766e', '#14b8a6'],
  apartment: ['#1d4ed8', '#60a5fa'],
  land: ['#a16207', '#facc15'],
  villa: ['#7c3aed', '#c084fc'],
  shop: ['#be123c', '#fb7185'],
  office: ['#334155', '#94a3b8'],
};

export default function Cover({ listing, className = '' }) {
  if (listing.image) {
    return <img className={`cover ${className}`} src={listing.image} alt={listing.title} loading="lazy" />;
  }
  const [a, b] = GRADIENTS[listing.type] || GRADIENTS.house;
  return (
    <div className={`cover cover-placeholder ${className}`} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}>
      <span className="cover-icon">{typeOf(listing.type).icon}</span>
    </div>
  );
}
