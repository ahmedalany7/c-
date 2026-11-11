export const formatPrice = (price, currency) => {
  const n = Number(price).toLocaleString('en-US');
  return currency === 'USD' ? `$${n}` : `${n} د.ع`;
};

// Rough conversion for comparing/sorting prices across currencies
export const USD_RATE = 1310;
export const toIQD = (price, currency) => (currency === 'USD' ? price * USD_RATE : price);

export const timeAgo = (iso) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'اليوم';
  if (days === 1) return 'أمس';
  if (days < 30) return `منذ ${days} يوم`;
  return new Date(iso).toLocaleDateString('ar-IQ');
};

export const whatsappLink = (phone, text) => {
  const intl = '964' + String(phone).replace(/\D/g, '').replace(/^0/, '');
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
};

export const loadLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const saveLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked */
  }
};
