import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { useService } from '../../hooks/usePublicData.js';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { PageSpinner, ErrorState } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import { getIcon } from '../../utils/iconMap.js';
import NotFound from './NotFound.jsx';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: service, isLoading, isError, error } = useService(slug);

  useDocumentHead({
    title: service ? `${service.seo?.title || service.title}` : undefined,
    description: service?.seo?.description || service?.shortDescription,
  });

  if (isLoading) return <PageSpinner label="Loading service..." />;
  if (isError) {
    if (error?.response?.status === 404) return <NotFound />;
    return <ErrorState title="Couldn't load this service" description="Please try again shortly." />;
  }
  if (!service) return <NotFound />;

  // getIcon looks up a stable component reference from a static map - not a new component definition per render.
  const Icon = getIcon(service.icon);

  return (
    <div>
      <section className="bg-ink-950 text-white section-y !pb-10">
        <div className="container-page">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
          <AnimatedReveal>
            <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              {/* eslint-disable-next-line react-hooks/static-components -- Icon is a stable reference from a static map, not created per render */}
              <Icon className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">{service.title}</h1>
            <p className="mt-4 max-w-2xl text-white/60">{service.shortDescription}</p>
            {service.startingPrice ? (
              <p className="mt-4 text-sm font-semibold text-white/80">
                Starting from ₹{service.startingPrice.toLocaleString('en-IN')}
              </p>
            ) : null}
          </AnimatedReveal>
        </div>
      </section>

      <section className="section-y container-page">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {service.description && (
              <div>
                <h2 className="text-xl font-bold text-ink-900">Overview</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-900/65">{service.description}</p>
              </div>
            )}
            {service.features?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-ink-900">What's Included</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 rounded-lg bg-white px-4 py-2.5 text-sm text-ink-900/70 shadow-soft">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-ink-900">Service Details</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {service.timeline && (
                  <div className="flex justify-between"><dt className="text-ink-900/50">Timeline</dt><dd className="font-medium text-ink-900">{service.timeline}</dd></div>
                )}
                {service.startingPrice ? (
                  <div className="flex justify-between"><dt className="text-ink-900/50">Starting Price</dt><dd className="font-medium text-ink-900">₹{service.startingPrice.toLocaleString('en-IN')}</dd></div>
                ) : null}
              </dl>
            </div>
            <div className="card bg-ink-900 p-6 text-white">
              <h3 className="font-bold">Interested in this service?</h3>
              <p className="mt-2 text-sm text-white/60">Tell us about your project and we'll get back to you soon.</p>
              <Link to="/start-project" className="btn-accent mt-4 w-full">
                Start Your Project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
