import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { StaggerItem } from '../ui/AnimatedReveal.jsx';
import { getIcon } from '../../utils/iconMap.js';

export function ServiceCard({ service, detailed = false }) {
  // getIcon looks up a stable component reference from a static map - not a new component definition per render.
  const Icon = getIcon(service.icon);
  return (
    <StaggerItem>
      <Link
        to={service.slug ? `/services/${service.slug}` : '#'}
        className="group block h-full rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-accent-500/30 hover:shadow-lg"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600 transition group-hover:bg-accent-500 group-hover:text-white">
          {/* eslint-disable-next-line react-hooks/static-components -- Icon is a stable reference from a static map, not created per render */}
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-ink-900">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-900/55">{service.shortDescription}</p>

        {detailed && service.features?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-900/70">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between">
          {service.startingPrice ? (
            <span className="text-sm font-semibold text-ink-900/70">
              From ₹{service.startingPrice.toLocaleString('en-IN')}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 text-sm font-semibold text-accent-600 transition group-hover:gap-2">
            Learn More <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </StaggerItem>
  );
}
