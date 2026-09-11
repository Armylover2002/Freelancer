import { AnimatedReveal } from './AnimatedReveal.jsx';

export function SectionHeading({ eyebrow, title, description, align = 'center', className = '' }) {
  return (
    <AnimatedReveal className={`mx-auto max-w-2xl ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-600">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink-900/60">{description}</p>}
    </AnimatedReveal>
  );
}
