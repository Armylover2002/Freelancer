import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useServices } from '../../hooks/usePublicData.js';
import { SectionHeading } from '../../components/ui/SectionHeading.jsx';
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
      <section className="bg-ink-950 text-white section-y">
        <div className="container-page text-center">
          <span className="badge bg-white/10 text-white/70">Services</span>
          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">What we build for you</h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/60">
            Full-stack capability across marketing sites, e-commerce and custom web applications.
          </p>
        </div>
      </section>

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

        <SectionHeading title="" className="hidden" />
        <div className="mt-14 rounded-2xl bg-ink-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-bold">Not sure what you need?</h2>
          <p className="mx-auto mt-2 max-w-lg text-white/60">
            Tell us about your project and we'll recommend the right approach and scope.
          </p>
          <Link to="/start-project" className="btn-accent mt-6">
            Start Your Project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
