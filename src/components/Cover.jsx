import { useId } from 'react';

// Illustrated property scenes (no external images needed)
const SKIES = {
  house: ['#fde68a', '#fb923c'],
  apartment: ['#bae6fd', '#6366f1'],
  land: ['#fef3c7', '#f59e0b'],
  villa: ['#fbcfe8', '#8b5cf6'],
  shop: ['#fecaca', '#e11d48'],
  office: ['#cbd5e1', '#0f172a'],
};

const Windows = ({ x, y, cols, rows, w = 12, h = 14, gx = 8, gy = 10, lit = '#fde68a', dark = '#1e293b' }) => {
  const out = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out.push(<rect key={`${r}-${c}`} x={x + c * (w + gx)} y={y + r * (h + gy)} width={w} height={h} rx="2"
        fill={(r * 7 + c * 3) % 5 === 0 ? dark : lit} opacity={(r + c) % 3 === 0 ? 0.95 : 0.75} />);
  return out;
};

const Palm = ({ x }) => (
  <g transform={`translate(${x},120)`}>
    <path d="M0 0 C3 30 2 55 4 82" stroke="#78350f" strokeWidth="5" fill="none" />
    <path d="M0 0 C-20 -6 -34 2 -40 12 M0 0 C18 -10 32 -4 40 8 M0 0 C-12 -16 -10 -28 -4 -34 M0 0 C10 -18 22 -22 30 -22 M0 0 C-24 4 -30 16 -30 24"
      stroke="#15803d" strokeWidth="6" strokeLinecap="round" fill="none" />
  </g>
);

function Building({ type }) {
  switch (type) {
    case 'apartment':
      return (<g>
        <rect x="70" y="70" width="90" height="140" fill="#475569" />
        <rect x="165" y="40" width="110" height="170" fill="#1e3a8a" />
        <rect x="280" y="90" width="70" height="120" fill="#334155" />
        <Windows x={80} y={82} cols={3} rows={5} w={18} h={14} />
        <Windows x={178} y={54} cols={4} rows={6} w={16} h={16} gx={9} gy={8} />
        <Windows x={290} y={102} cols={2} rows={4} w={20} h={14} />
      </g>);
    case 'land':
      return (<g>
        <path d="M0 175 Q100 140 200 165 T400 155 V240 H0Z" fill="#a3e635" opacity="0.7" />
        <path d="M0 195 Q120 170 230 190 T400 185 V240 H0Z" fill="#65a30d" />
        {[...Array(12)].map((_, i) => <rect key={i} x={40 + i * 28} y="178" width="4" height="26" fill="#78350f" />)}
        <rect x="40" y="186" width="312" height="3" fill="#92400e" />
        <rect x="250" y="110" width="6" height="70" fill="#57534e" />
        <rect x="215" y="100" width="76" height="38" rx="4" fill="#fff" stroke="#b45309" strokeWidth="3" />
        <text x="253" y="125" textAnchor="middle" fontSize="16" fontWeight="800" fill="#b45309" fontFamily="Cairo, sans-serif">للبيع</text>
      </g>);
    case 'villa':
      return (<g>
        <rect x="90" y="110" width="220" height="100" fill="#f8fafc" />
        <rect x="140" y="70" width="140" height="45" fill="#f1f5f9" />
        <rect x="130" y="64" width="160" height="10" fill="#a78bfa" />
        <rect x="80" y="104" width="240" height="10" fill="#7c3aed" />
        <rect x="155" y="80" width="40" height="26" fill="#93c5fd" /><rect x="225" y="80" width="40" height="26" fill="#93c5fd" />
        <rect x="110" y="130" width="50" height="40" fill="#93c5fd" /><rect x="240" y="130" width="50" height="40" fill="#93c5fd" />
        <rect x="183" y="150" width="34" height="60" fill="#7c2d12" />
        <rect x="70" y="205" width="260" height="8" fill="#38bdf8" opacity="0.8" />
        <Palm x={50} /><Palm x={350} />
      </g>);
    case 'shop':
      return (<g>
        <rect x="80" y="80" width="240" height="130" fill="#fff7ed" />
        <rect x="80" y="70" width="240" height="18" fill="#9f1239" />
        <text x="200" y="84" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="Cairo, sans-serif">محل تجاري</text>
        {[...Array(8)].map((_, i) => <path key={i} d={`M${80 + i * 30} 88 h30 v18 q-15 12 -30 0z`} fill={i % 2 ? '#fff' : '#e11d48'} />)}
        <rect x="100" y="120" width="120" height="80" fill="#bae6fd" opacity="0.85" />
        <rect x="240" y="120" width="60" height="90" fill="#7c2d12" />
        <path d="M110 190 l20 -30 l20 30 M160 190 l15 -22 l15 22" stroke="#0369a1" strokeWidth="3" fill="none" opacity="0.5" />
      </g>);
    case 'office':
      return (<g>
        <path d="M140 210 V40 L200 20 L260 40 V210Z" fill="#0ea5e9" opacity="0.9" />
        <path d="M200 20 V210 H260 V40Z" fill="#0369a1" />
        {[...Array(15)].map((_, i) => <rect key={i} x="140" y={48 + i * 11} width="120" height="2" fill="#e0f2fe" opacity="0.5" />)}
        <rect x="60" y="110" width="70" height="100" fill="#334155" /><Windows x={68} y={120} cols={3} rows={5} w={14} h={10} gx={8} gy={8} />
        <rect x="270" y="90" width="80" height="120" fill="#1e293b" /><Windows x={280} y={100} cols={3} rows={6} w={16} h={10} gx={8} gy={7} />
      </g>);
    default: // house
      return (<g>
        <rect x="120" y="115" width="160" height="95" fill="#fffbeb" />
        <path d="M105 120 L200 55 L295 120Z" fill="#b45309" />
        <rect x="245" y="65" width="20" height="35" fill="#78350f" />
        <rect x="185" y="150" width="32" height="60" fill="#7c2d12" rx="2" />
        <rect x="135" y="135" width="36" height="32" fill="#93c5fd" stroke="#fff" strokeWidth="3" />
        <rect x="230" y="135" width="36" height="32" fill="#93c5fd" stroke="#fff" strokeWidth="3" />
        <circle cx="90" cy="180" r="26" fill="#16a34a" /><circle cx="318" cy="186" r="20" fill="#22c55e" />
      </g>);
  }
}

export default function Cover({ listing, className = '' }) {
  const id = useId().replace(/:/g, '');
  if (listing.image) {
    return <div className={`cover ${className}`}><img src={listing.image} alt={listing.title} loading="lazy" /></div>;
  }
  const [top, bottom] = SKIES[listing.type] || SKIES.house;
  return (
    <div className={`cover ${className}`}>
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label={listing.title}>
        <defs>
          <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={bottom} /><stop offset="1" stopColor={top} />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill={`url(#sky${id})`} />
        <circle cx="330" cy="55" r="26" fill="#fff" opacity="0.35" />
        <g opacity="0.5" fill="#fff">
          <ellipse cx="80" cy="45" rx="34" ry="9" /><ellipse cx="105" cy="38" rx="22" ry="9" />
        </g>
        <rect y="205" width="400" height="35" fill="#1f2937" opacity="0.25" />
        <Building type={listing.type} />
      </svg>
    </div>
  );
}
