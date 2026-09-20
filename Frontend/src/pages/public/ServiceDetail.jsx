import { Link, useParams } from 'react-router-dom';
import { PageHero } from '../../components/ui/PageHero.jsx';
import { ArrowUpRight, Check } from 'lucide-react';
import { useService } from '../../hooks/usePublicData.js';
import { PageSpinner, ErrorState } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
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

  return (
    <div>
      <PageHero
        align="left"
        eyebrow="Service"
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
        title={service.title}
        description={service.shortDescription}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/start-project" className="btn-accent w-full sm:w-auto">Get a quote <ArrowUpRight className="h-4 w-4" /></Link>
          {service.startingPrice ? (
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80">
              From ₹{service.startingPrice.toLocaleString('en-IN')}
            </span>
          ) : null}
        </div>
      </PageHero>

      <section className="container-page py-12 sm:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {service.description && (
              <div className="rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900"><span className="h-6 w-1.5 rounded-full bg-accent-500" />Overview</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-900/65">{service.description}</p>
              </div>
            )}
            {service.features?.length > 0 && (
              <div className="rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900"><span className="h-6 w-1.5 rounded-full bg-accent-500" />What&apos;s Included</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 rounded-xl bg-accent-500/[0.05] px-4 py-3 text-sm text-ink-900/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
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
            <div className="rounded-2xl bg-gradient-to-br from-accent-600 to-fuchsia-600 p-6 text-white shadow-lg">
              <h3 className="font-bold">Interested in this service?</h3>
              <p className="mt-2 text-sm text-white/80">Tell us about your project and we'll get back to you soon.</p>
              <Link to="/start-project" className="btn mt-5 w-full bg-white text-ink-900 hover:bg-white/90">
                Start Your Project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
