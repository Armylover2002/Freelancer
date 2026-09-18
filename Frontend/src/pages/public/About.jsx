import { Target, Eye, Heart, Zap } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { useTeam } from '../../hooks/usePublicData.js';
import { SectionHeading } from '../../components/ui/SectionHeading.jsx';
import { AnimatedReveal, Stagger, StaggerItem } from '../../components/ui/AnimatedReveal.jsx';
import { TeamCard } from '../../components/sections/TeamCard.jsx';
import { EmptyState, Skeleton } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

const VALUES = [
  { icon: Target, title: 'Outcome-Focused', desc: 'We measure success by the results our work creates for your business.' },
  { icon: Eye, title: 'Radical Transparency', desc: 'Clear scope, clear pricing, clear timelines - always.' },
  { icon: Heart, title: 'Craft & Care', desc: 'Every interface, every line of code is built with attention to detail.' },
  { icon: Zap, title: 'Move Fast, Stay Solid', desc: 'Rapid iteration without cutting corners on quality or security.' },
];

export default function About() {
  const { data: settings } = useSiteSettings();
  const { data: team, isLoading } = useTeam();
  const agencyName = settings?.branding?.agencyName || 'Your Agency';

  useDocumentHead({
    title: 'About Us',
    description: `Learn about ${agencyName} - our story, values and the team behind our work.`,
  });

  return (
    <div>
      <section className="bg-ink-950 text-white section-y">
        <div className="container-page text-center">
          <AnimatedReveal>
            <span className="badge bg-white/10 text-white/70">About Us</span>
            <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">The story behind {agencyName}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-white/60">
              {settings?.branding?.tagline || 'We design and build software that grows your business.'}
            </p>
          </AnimatedReveal>
        </div>
      </section>

      <section className="section-y container-page">
        <SectionHeading eyebrow="Our Values" title="What guides how we work" />
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <StaggerItem key={v.title} className="rounded-2xl border border-ink-900/8 bg-white p-6 text-center shadow-soft">
              <v.icon className="mx-auto h-8 w-8 text-accent-500" />
              <h3 className="mt-4 font-bold text-ink-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-900/55">{v.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Working Model" title="How we collaborate" description="Direct communication, transparent scope and a process designed to keep you informed at every step - discovery through post-launch support." />
        </div>
      </section>

      <section className="section-y container-page">
        <SectionHeading eyebrow="Meet the Team" title="The people building your product" />
        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
            </div>
          ) : !team?.length ? (
            <EmptyState title="Team profiles coming soon" description="Add real team members from the Admin panel." />
          ) : (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => <TeamCard key={m._id} member={m} />)}
            </Stagger>
          )}
        </div>
      </section>
    </div>
  );
}
