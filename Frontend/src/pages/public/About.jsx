import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Zap, ArrowUpRight, MessageSquare, PenTool, Code2, Rocket } from 'lucide-react';
import { PageHero } from '../../components/ui/PageHero.jsx';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { useTeam } from '../../hooks/usePublicData.js';
import { SectionHeading } from '../../components/ui/SectionHeading.jsx';
import { AnimatedReveal, Stagger, StaggerItem } from '../../components/ui/AnimatedReveal.jsx';
import { TeamCard } from '../../components/sections/TeamCard.jsx';
import { EmptyState, Skeleton } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

const STEPS = [
  { icon: MessageSquare, title: 'Talk', desc: 'A direct conversation to understand your goals, users and budget.' },
  { icon: PenTool, title: 'Design', desc: 'Clear wireframes and visuals you approve before we build.' },
  { icon: Code2, title: 'Build', desc: 'Clean, tested code with regular progress updates you can see.' },
  { icon: Rocket, title: 'Launch & support', desc: 'Smooth go-live, then ongoing maintenance and improvements.' },
];

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
      <PageHero
        eyebrow="About Us"
        title={`The story behind ${agencyName}`}
        description={settings?.branding?.tagline || 'We design and build software that grows your business.'}
      />

      {/* Intro + highlights */}
      <section className="container-page section-y">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimatedReveal>
            <SectionHeading align="left" eyebrow="Who We Are" title="A small studio that cares about the details" />
            <p className="mt-5 leading-relaxed text-ink-900/65">
              {agencyName} is a development studio focused on building fast, secure and good-looking websites and web
              applications. You work directly with the people who design and write your product - no layers, no
              hand-offs, no surprises.
            </p>
            <p className="mt-4 leading-relaxed text-ink-900/65">
              From the first call to post-launch support, we keep scope, pricing and timelines transparent so you
              always know where your project stands.
            </p>
            <Link to="/start-project" className="btn-accent mt-7 w-full sm:w-auto">
              Start Your Project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </AnimatedReveal>
          <Stagger className="grid grid-cols-2 gap-4">
            {[
              ['Direct', 'Talk to the builders'],
              ['Transparent', 'Clear scope & pricing'],
              ['Mobile-first', 'Great on every screen'],
              ['Supported', 'Help after launch'],
            ].map(([t, d]) => (
              <StaggerItem key={t} className="rounded-2xl border border-ink-900/8 bg-white p-5 shadow-soft sm:p-6">
                <p className="text-gradient text-xl font-extrabold sm:text-2xl">{t}</p>
                <p className="mt-1 text-sm text-ink-900/55">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Values */}
      <section className="section-y bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Our Values" title="What guides how we work" />
          <Stagger className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {VALUES.map((v) => (
              <StaggerItem key={v.title} className="rounded-2xl border border-ink-900/8 bg-surface-muted/60 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-accent-500/10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aurora-gradient text-white shadow-glow">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-bold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{v.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Working model */}
      <section className="section-y container-page">
        <SectionHeading eyebrow="Working Model" title="How we collaborate" description="Direct communication and a process that keeps you informed at every step." />
        <div className="relative mt-10 sm:mt-12">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent lg:block" />
          <Stagger className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {STEPS.map((st, i) => (
              <StaggerItem key={st.title} className="relative text-left lg:text-center">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-white shadow-soft lg:mx-auto">
                  <st.icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold">{i + 1}</span>
                </span>
                <h3 className="mt-4 font-bold text-ink-900">{st.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">{st.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Team */}
      <section className="section-y bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Meet the Team" title="The people building your product" />
          <div className="mt-10 sm:mt-12">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
              </div>
            ) : !team?.length ? (
              <EmptyState title="Team profiles coming soon" description="Add real team members from the Admin panel." />
            ) : (
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {team.map((m) => <TeamCard key={m._id} member={m} />)}
              </Stagger>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
