import { Quote, Star } from 'lucide-react';
import { StaggerItem } from '../ui/AnimatedReveal.jsx';

export function TestimonialCard({ testimonial }) {
  return (
    <StaggerItem>
      <div className="h-full rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft">
        <Quote className="h-6 w-6 text-accent-500/40" />
        <p className="mt-4 text-sm leading-relaxed text-ink-900/70">&ldquo;{testimonial.quote}&rdquo;</p>
        <div className="mt-4 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-900/15'}`}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-900/5 text-sm font-bold text-ink-900/50">
            {testimonial.photo?.url ? (
              <img src={testimonial.photo.url} alt={testimonial.clientName} className="h-full w-full object-cover" />
            ) : (
              testimonial.clientName.charAt(0)
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">{testimonial.clientName}</p>
            <p className="text-xs text-ink-900/45">
              {[testimonial.role, testimonial.company].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}
