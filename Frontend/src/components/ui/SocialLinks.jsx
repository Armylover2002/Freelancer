import { SOCIALS, normalizeUrl } from './socials.js';

/** Round brand-coloured buttons for every social link the admin filled in. */
export function SocialLinks({ socials, size = 'md', className = '' }) {
  const box = size === 'lg' ? 'h-10 w-10' : 'h-9 w-9';
  const icon = size === 'lg' ? 'h-5 w-5' : 'h-[18px] w-[18px]';
  const items = Object.entries(SOCIALS).filter(([key]) => socials?.[key]);
  if (!items.length) return null;
  return (
    <div className={`flex gap-2 ${className}`}>
      {items.map(([key, { label, Icon, color }]) => (
        <a
          key={key}
          href={normalizeUrl(socials[key])}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          style={{ '--brand': color }}
          className={`flex ${box} items-center justify-center rounded-full border border-ink-900/10 bg-white text-[color:var(--brand)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[color:var(--brand)] hover:text-white hover:shadow-md`}
        >
          <Icon className={icon} />
        </a>
      ))}
    </div>
  );
}
