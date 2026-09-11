import { usePricing } from '../../hooks/usePublicData.js';
import { Stagger } from '../../components/ui/AnimatedReveal.jsx';
import { PricingCard } from '../../components/sections/PricingCard.jsx';
import { EmptyState, Skeleton } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

export default function Pricing() {
  const { data: plans, isLoading, isError } = usePricing();

  useDocumentHead({
    title: 'Pricing - Transparent Starting Prices',
    description: 'Realistic starting prices for websites, e-commerce and custom web applications.',
  });

  return (
    <div>
      <section className="bg-ink-950 text-white section-y">
        <div className="container-page text-center">
          <span className="badge bg-white/10 text-white/70">Pricing</span>
          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">Transparent starting prices</h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/60">
            Every project is scoped individually. These are realistic starting points to help you plan.
          </p>
        </div>
      </section>

      <section className="section-y container-page">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)}
          </div>
        ) : isError ? (
          <EmptyState title="Couldn't load pricing" description="Please refresh the page or try again shortly." />
        ) : !plans?.length ? (
          <EmptyState title="Pricing plans coming soon" description="Add your pricing plans from the Admin panel." />
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => <PricingCard key={p._id} plan={p} />)}
          </Stagger>
        )}
        <p className="mt-10 text-center text-sm text-ink-900/45">
          Need something custom? <a href="/start-project" className="font-semibold text-accent-600">Tell us about your project</a> and we'll send a tailored quote.
        </p>
      </section>
    </div>
  );
}
