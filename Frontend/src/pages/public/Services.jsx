import { Link } from 'react-router-dom';
import { PageHero } from '../../components/ui/PageHero.jsx';
import { ArrowUpRight } from 'lucide-react';
import { useServices } from '../../hooks/usePublicData.js';
import { Stagger } from '../../components/ui/AnimatedReveal.jsx';
import { ServiceCard } from '../../components/sections/ServiceCard.jsx';
import { EmptyState, Skeleton } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

export default function Services() {
  const { data: services, isLoading, isError } = useServices();

  useDocumentHead({
    title: 'Services - Web Development, E-Commerce & Web Apps',
    description: 'Full-stack capability across marketing sites, e-commerce and custom web applications.',
  });

  return (
    <div>
      <PageHero eyebrow="Services" title="What we build for you" description="Full-stack capability across marketing sites, e-commerce and custom web applications." />

      <section className="section-y container-page">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
          </div>
        ) : isError ? (
          <EmptyState title="Couldn't load services" description="Please refresh the page or try again shortly." />
        ) : !services?.length ? (
          <EmptyState title="No services published yet" description="Add your services from the Admin panel." />
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s._id} service={s} detailed />)}
          </Stagger>
        )}

        <div className="relative mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-accent-700 p-8 text-center text-white sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <h2 className="relative text-2xl font-extrabold sm:text-3xl">Not sure what you need?</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-white/70">
            Tell us about your project and we'll recommend the right approach and scope.
          </p>
          <Link to="/start-project" className="btn-accent relative mt-7 w-full sm:w-auto">
            Start Your Project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
