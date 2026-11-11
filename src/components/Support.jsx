import { useState } from 'react';
import { SITE } from '../config.js';
import { whatsappLink } from '../utils.js';

const FAQ = [
  ['كيف أضيف إعلاناً عن عقاري؟', 'اضغط زر "+ أضف إعلان" في أعلى الصفحة، واملأ البيانات (العنوان، المحافظة، السعر، المساحة، رقم الهاتف) وأضف صورة ثم اضغط "نشر الإعلان".'],
  ['هل نشر الإعلان مجاني؟', 'نعم، نشر الإعلانات مجاني بالكامل.'],
  ['كيف أحذف أو أعدّل إعلاني؟', 'من تبويب "إعلاناتي" افتح الإعلان واضغط "حذف إعلاني". لتعديل الإعلان احذفه وأعد نشره بالبيانات الجديدة.'],
  ['كيف أتواصل مع صاحب العقار؟', 'افتح الإعلان واضغط زر "اتصال" أو "واتساب" للتواصل مباشرة مع المعلن.'],
  ['هل الموقع يضمن صحة الإعلانات؟', 'الموقع منصة للعرض فقط. ننصح دائماً بمعاينة العقار شخصياً والتأكد من سند الملكية (الطابو) قبل دفع أي مبلغ.'],
  ['وجدت إعلاناً مخالفاً أو احتيالياً، ماذا أفعل؟', 'راسلنا عبر نموذج التواصل أدناه مع عنوان الإعلان وسنتعامل معه بأسرع وقت.'],
];

const TIPS = [
  'لا تحوّل أي مبلغ (عربون) قبل معاينة العقار والتأكد من هوية المالك.',
  'اطلب نسخة من سند الطابو وتحقق منها في دائرة التسجيل العقاري.',
  'التقِ بالمعلن في مكان عام أو في موقع العقار نفسه.',
  'كن حذراً من الأسعار المنخفضة جداً مقارنة بالسوق.',
];

export default function Support() {
  const [open, setOpen] = useState(0);
  const [msg, setMsg] = useState({ name: '', subject: 'استفسار عام', text: '' });
  const [note, setNote] = useState('');
  const set = (k) => (e) => setMsg({ ...msg, [k]: e.target.value });

  const send = (e) => {
    e.preventDefault();
    const body = `الاسم: ${msg.name}\nالموضوع: ${msg.subject}\n\n${msg.text}`;
    if (SITE.whatsapp) window.open(whatsappLink(SITE.whatsapp, body), '_blank');
    else if (SITE.email) window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(body)}`;
    else return setNote('لم تُضف وسيلة تواصل بعد. يرجى المحاولة لاحقاً.');
    setNote('تم فتح تطبيق المراسلة لإرسال رسالتك ✅');
  };

  const contacts = [
    SITE.whatsapp && { icon: '💬', label: 'واتساب', value: SITE.whatsapp, href: whatsappLink(SITE.whatsapp, 'مرحباً، أحتاج مساعدة بخصوص موقع عقارات العراق') },
    SITE.phone && { icon: '📞', label: 'الهاتف', value: SITE.phone, href: `tel:${SITE.phone}` },
    SITE.email && { icon: '✉️', label: 'البريد الإلكتروني', value: SITE.email, href: `mailto:${SITE.email}` },
    SITE.facebook && { icon: '📘', label: 'فيسبوك', value: 'صفحتنا على فيسبوك', href: SITE.facebook },
    SITE.instagram && { icon: '📸', label: 'إنستغرام', value: 'حسابنا على إنستغرام', href: SITE.instagram },
  ].filter(Boolean);

  return (
    <div className="support">
      <section className="hero small">
        <div className="blob b1" /><div className="blob b2" />
        <div className="container hero-inner">
          <span className="eyebrow">💬 الدعم الفني</span>
          <h1>مركز الدعم والمساعدة</h1>
          <p>نحن هنا لمساعدتك — فريق الدعم بإشراف <b>{SITE.ownerAr} ({SITE.owner})</b></p>
        </div>
      </section>

      <div className="container support-grid">
        <section className="panel" data-reveal>
          <h2>الأسئلة الشائعة</h2>
          {FAQ.map(([q, a], i) => (
            <div key={q} className={`faq ${open === i ? 'open' : ''}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q}</span><span>{open === i ? '−' : '+'}</span>
              </button>
              <div className="faq-a"><p>{a}</p></div>
            </div>
          ))}
        </section>

        <div className="side">
          <section className="panel owner" data-reveal>
            <div className="avatar">{SITE.ownerAr.charAt(0)}</div>
            <h3>{SITE.ownerAr}</h3>
            <p className="muted">{SITE.owner} — مؤسس ومدير الموقع</p>
            <p className="muted">⏰ {SITE.hours}</p>
            {contacts.length > 0 && (
              <div className="contact-list">
                {contacts.map((c) => (
                  <a key={c.label} href={c.href} target="_blank" rel="noreferrer">
                    <span>{c.icon}</span>
                    <div><b>{c.label}</b><small dir="ltr">{c.value}</small></div>
                  </a>
                ))}
              </div>
            )}
          </section>

          <form className="panel" data-reveal onSubmit={send}>
            <h3>راسلنا</h3>
            <label>اسمك
              <input required value={msg.name} onChange={set('name')} />
            </label>
            <label>الموضوع
              <select value={msg.subject} onChange={set('subject')}>
                <option>استفسار عام</option>
                <option>مشكلة في نشر إعلان</option>
                <option>الإبلاغ عن إعلان مخالف</option>
                <option>اقتراح</option>
              </select>
            </label>
            <label>رسالتك
              <textarea required rows="4" value={msg.text} onChange={set('text')} />
            </label>
            <button className="btn gold full shine">إرسال</button>
            {note && <p className="note">{note}</p>}
          </form>
        </div>

        <section className="panel tips" data-reveal>
          <h2>🛡️ نصائح للأمان قبل الشراء أو الإيجار</h2>
          <ul>{TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
      </div>
    </div>
  );
}
