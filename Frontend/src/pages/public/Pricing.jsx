import { usePricing } from '../../hooks/usePublicData.js';
import { PageHero } from '../../components/ui/PageHero.jsx';
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
      <PageHero eyebrow="Pricing" title="Transparent starting prices" description="Every project is scoped individually. These are realistic starting points to help you plan." />

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
