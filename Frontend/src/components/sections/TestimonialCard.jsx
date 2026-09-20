import { Quote, Star } from 'lucide-react';
import { StaggerItem } from '../ui/AnimatedReveal.jsx';

export function TestimonialCard({ testimonial }) {
  const subtitle = [testimonial.role, testimonial.company].filter(Boolean).join(', ');
  return (
    <StaggerItem className="h-full">
      <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-500/10 sm:p-7">
        <Quote className="absolute right-5 top-5 h-12 w-12 text-accent-500/10" />
        <div className="flex items-center gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-900/15'}`} />
          ))}
        </div>
        <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-900/75">&ldquo;{testimonial.quote}&rdquo;</blockquote>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-900/6 pt-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent-500 to-fuchsia-500 text-sm font-bold text-white ring-2 ring-white">
            {testimonial.photo?.url ? (
              <img src={testimonial.photo.url} alt={testimonial.clientName} className="h-full w-full object-cover" />
            ) : (
              testimonial.clientName.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{testimonial.clientName}</p>
            {subtitle && <p className="truncate text-xs text-ink-900/50">{subtitle}</p>}
          </div>
        </figcaption>
      </figure>
    </StaggerItem>
  );
}
