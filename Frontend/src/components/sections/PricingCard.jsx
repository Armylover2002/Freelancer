import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import clsx from 'clsx';
import { StaggerItem } from '../ui/AnimatedReveal.jsx';

export function PricingCard({ plan }) {
  return (
    <StaggerItem>
      <div
        className={clsx(
          'relative flex h-full flex-col rounded-2xl border p-6 shadow-soft transition hover:-translate-y-1',
          plan.featured ? 'border-accent-500 bg-ink-900 text-white shadow-glow' : 'border-ink-900/8 bg-white'
        )}
      >
        {plan.featured && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
            Most Popular
          </span>
        )}
        <h3 className={clsx('text-lg font-bold', plan.featured ? 'text-white' : 'text-ink-900')}>{plan.name}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className={clsx('text-3xl font-extrabold', plan.featured ? 'text-white' : 'text-ink-900')}>
            ₹{plan.startingPrice.toLocaleString('en-IN')}
          </span>
          <span className={clsx('text-sm', plan.featured ? 'text-white/60' : 'text-ink-900/45')}>
            starting / {plan.billingUnit}
          </span>
        </div>
        {plan.timeline && (
          <p className={clsx('mt-1 text-xs', plan.featured ? 'text-white/50' : 'text-ink-900/40')}>
            Typical timeline: {plan.timeline}
          </p>
        )}

        <ul className="mt-5 flex-1 space-y-2.5">
          {plan.features?.map((f) => (
            <li key={f} className={clsx('flex items-start gap-2 text-sm', plan.featured ? 'text-white/80' : 'text-ink-900/70')}>
              <Check className={clsx('mt-0.5 h-4 w-4 shrink-0', plan.featured ? 'text-accent-400' : 'text-accent-500')} />
              {f}
            </li>
          ))}
          {plan.exclusions?.map((f) => (
            <li key={f} className={clsx('flex items-start gap-2 text-sm', plan.featured ? 'text-white/40' : 'text-ink-900/35')}>
              <X className="mt-0.5 h-4 w-4 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          to="/start-project"
          className={clsx('mt-6 w-full', plan.featured ? 'btn bg-white text-ink-900 hover:bg-white/90' : 'btn-outline')}
        >
          Get Started
        </Link>
        <p className={clsx('mt-3 text-center text-[11px]', plan.featured ? 'text-white/40' : 'text-ink-900/35')}>
          Final pricing depends on the exact scope agreed after discovery.
        </p>
      </div>
    </StaggerItem>
  );
}
