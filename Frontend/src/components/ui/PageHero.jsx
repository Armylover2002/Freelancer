import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AnimatedReveal } from './AnimatedReveal.jsx';

/**
 * Shared hero for every inner page: dark gradient backdrop, breadcrumb, eyebrow badge,
 * fluid heading and optional description/actions. Keeps all nested pages visually consistent.
 */
export function PageHero({ eyebrow, title, description, crumbs = [], children, align = 'center' }) {
  const center = align === 'center';
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-[length:22px_22px] opacity-[0.12]" />
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container-page relative py-14 sm:py-20 lg:py-24">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className={`mb-6 flex flex-wrap items-center gap-1 text-xs text-white/50 sm:text-sm ${center ? 'justify-center' : ''}`}>
            <Link to="/" className="hover:text-white">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" />
                {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span className="text-white/80">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <AnimatedReveal className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
          {eyebrow && (
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent-300 backdrop-blur">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
          {description && <p className={`mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg ${center ? 'mx-auto' : ''}`}>{description}</p>}
          {children && <div className="mt-8">{children}</div>}
        </AnimatedReveal>
      </div>
    </section>
  );
}
