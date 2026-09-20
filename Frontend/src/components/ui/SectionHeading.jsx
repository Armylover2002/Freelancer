import { AnimatedReveal } from './AnimatedReveal.jsx';

export function SectionHeading({ eyebrow, title, description, align = 'center', className = '' }) {
  const center = align === 'center';
  return (
    <AnimatedReveal className={`max-w-2xl ${center ? 'mx-auto text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-600">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">{title}</h2>
      <span className={`mt-4 block h-1 w-12 rounded-full bg-aurora-gradient ${center ? 'mx-auto' : ''}`} />
      {description && <p className="mt-4 text-base leading-relaxed text-ink-900/60 sm:text-lg">{description}</p>}
    </AnimatedReveal>
  );
}
