import { Check, X, ExternalLink } from 'lucide-react';

// Internal / noisy fields that mean nothing to an admin reading a record.
const HIDDEN_KEYS = new Set(['_id', '__v', 'id', 'publicId', 'createdAt', 'updatedAt', 'password', 'passwordHash']);
const TITLE_KEYS = ['title', 'name', 'clientName', 'question', 'planName', 'business', 'originalName', 'email'];
const SUBTITLE_KEYS = ['category', 'role', 'company', 'tagline', 'slug', 'business', 'email'];
const IMAGE_KEYS = ['coverImage', 'photo', 'image', 'avatar', 'logo', 'url'];
const LONG_TEXT_LIMIT = 90;

const labelOf = (key) =>
  key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase()).trim();
const isEmpty = (v) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length) ||
  (typeof v === 'object' && !Array.isArray(v) && !Object.entries(v).some(([k, x]) => !HIDDEN_KEYS.has(k) && !isEmpty(x)));
const isUrl = (v) => typeof v === 'string' && /^https?:\/\//i.test(v);
const isImageUrl = (v) => isUrl(v) && (/\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(v) || /cloudinary\.com/i.test(v));
const isDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v);
const imageOf = (v) => (v && typeof v === 'object' && isImageUrl(v.url) ? v.url : isImageUrl(v) ? v : null);

function Chips({ items }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((v, i) => (
        <span key={i} className="rounded-full bg-accent-500/10 px-2.5 py-1 text-xs font-medium text-accent-700">{String(v)}</span>
      ))}
    </div>
  );
}

function Value({ value }) {
  const img = imageOf(value);
  if (img) return <img src={img} alt="" className="max-h-48 rounded-xl border border-ink-900/10 object-cover" />;
  if (isDate(value)) return <>{new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' })}</>;
  if (isUrl(value)) {
    return (
      <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all text-accent-600 hover:underline">
        {value.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    );
  }
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v !== 'object')) return <Chips items={value} />;
    return (
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="rounded-xl border border-ink-900/8 bg-ink-900/[0.02] p-3"><Value value={v} /></div>
        ))}
      </div>
    );
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([k, v]) => !HIDDEN_KEYS.has(k) && !isEmpty(v));
    return (
      <dl className="space-y-1.5">
        {entries.map(([k, v]) => (
          <div key={k} className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-900/40">{labelOf(k)}</dt>
            <dd className="min-w-0 break-words text-ink-900/85"><Value value={v} /></dd>
          </div>
        ))}
      </dl>
    );
  }
  if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
  return <span className="whitespace-pre-wrap break-words">{String(value)}</span>;
}

const isWide = (v) =>
  (typeof v === 'string' && !isUrl(v) && v.length > LONG_TEXT_LIMIT) ||
  (Array.isArray(v) && v.some((x) => typeof x === 'object')) ||
  (v && typeof v === 'object' && !Array.isArray(v) && !imageOf(v));

export function RecordDetails({ record }) {
  const titleKey = TITLE_KEYS.find((k) => typeof record[k] === 'string' && record[k]);
  const subtitleKey = SUBTITLE_KEYS.find((k) => k !== titleKey && typeof record[k] === 'string' && record[k]);
  const imageKey = IMAGE_KEYS.find((k) => imageOf(record[k]));
  const heroImage = imageKey ? imageOf(record[imageKey]) : null;
  const title = titleKey ? record[titleKey] : 'Details';
  const skip = new Set([titleKey, subtitleKey, imageKey]);

  const fields = Object.entries(record).filter(([k, v]) => !HIDDEN_KEYS.has(k) && !skip.has(k) && !isEmpty(v));
  const flags = fields.filter(([, v]) => typeof v === 'boolean');
  const statuses = fields.filter(([k, v]) => k === 'status' && typeof v === 'string');
  const rest = fields.filter(([k, v]) => typeof v !== 'boolean' && k !== 'status');
  const compact = rest.filter(([, v]) => !isWide(v));
  const wide = rest.filter(([, v]) => isWide(v));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-accent-500/10 to-ink-900/[0.03] p-4">
        {heroImage ? (
          <img src={heroImage} alt="" className="h-20 w-20 shrink-0 rounded-2xl border border-white object-cover shadow" />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-2xl font-bold text-white shadow">
            {String(title).trim().charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h4 className="break-words text-lg font-bold text-ink-900">{title}</h4>
          {subtitleKey && <p className="break-words text-sm text-ink-900/55">{record[subtitleKey]}</p>}
          {(statuses.length > 0 || flags.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {statuses.map(([k, v]) => (
                <span key={k} className="rounded-full bg-ink-900/8 px-2.5 py-1 text-xs font-semibold capitalize text-ink-900/70">{v}</span>
              ))}
              {flags.map(([k, v]) => (
                <span key={k} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${v ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {v ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {labelOf(k)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {compact.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {compact.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-ink-900/8 bg-white p-3.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-900/40">{labelOf(k)}</p>
              <div className="text-sm font-medium text-ink-900"><Value value={v} /></div>
            </div>
          ))}
        </div>
      )}

      {wide.map(([k, v]) => (
        <div key={k} className="rounded-xl border border-ink-900/8 bg-white p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-900/40">{labelOf(k)}</p>
          <div className="text-sm leading-relaxed text-ink-900/80"><Value value={v} /></div>
        </div>
      ))}
    </div>
  );
}
