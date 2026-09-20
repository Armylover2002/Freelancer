import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Sparkles, Code2, Mail } from 'lucide-react';
import { useTeamMember, useTeam } from '../../hooks/usePublicData.js';
import { TeamCard } from '../../components/sections/TeamCard.jsx';
import { Stagger } from '../../components/ui/AnimatedReveal.jsx';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { PageSpinner, ErrorState } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import { SocialLinks } from '../../components/ui/SocialLinks.jsx';
import NotFound from './NotFound.jsx';


export default function TeamMemberDetail() {
  const { slug } = useParams();
  const { data: member, isLoading, isError, error } = useTeamMember(slug);
  const { data: team } = useTeam();

  useDocumentHead({
    title: member ? `${member.name} - ${member.role}` : undefined,
    description: member?.bio || member?.specialty,
  });

  if (isLoading) return <PageSpinner label="Loading profile..." />;
  if (isError) {
    if (error?.response?.status === 404) return <NotFound />;
    return <ErrorState title="Couldn't load this profile" description="Please try again shortly." />;
  }
  if (!member) return <NotFound />;

  const others = (team || []).filter((m) => m.slug !== member.slug).slice(0, 3);
  const facts = [
    { icon: Briefcase, label: 'Experience', value: member.experienceText },
    { icon: Sparkles, label: 'Specialty', value: member.specialty },
    { icon: Code2, label: 'Technologies', value: member.technologies?.length ? `${member.technologies.length} skills` : '' },
  ].filter((f) => f.value);

  return (
    <div className="bg-ink-900/[0.02]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="container-page relative py-10 sm:py-14">
          <Link to="/about" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Team
          </Link>
          <AnimatedReveal>
            <div className="mt-8 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
              <div className="rounded-full bg-gradient-to-br from-accent-400 to-fuchsia-500 p-1 shadow-2xl">
                <div className="h-36 w-36 overflow-hidden rounded-full bg-ink-900 sm:h-44 sm:w-44">
                  {member.photo?.url ? (
                    <img src={member.photo.url} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl font-bold text-white/50">{member.name.charAt(0)}</div>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-300">Meet the team</span>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{member.name}</h1>
                <p className="mt-2 text-xl font-medium text-accent-300">{member.role}</p>
                {member.specialty && <p className="mt-2 max-w-2xl text-white/60">{member.specialty}</p>}
                <SocialLinks socials={member.socials} size="lg" className="mt-5 justify-center md:justify-start" />
              </div>
            </div>
          </AnimatedReveal>

          {facts.length > 0 && (
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500/20 text-accent-300"><Icon className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{label}</p>
                    <p className="truncate text-sm font-semibold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="container-page py-12 sm:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {member.bio && (
              <div className="rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900"><span className="h-6 w-1.5 rounded-full bg-accent-500" />About</h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-900/70">{member.bio}</p>
              </div>
            )}
            {member.technologies?.length > 0 && (
              <div className="rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900"><span className="h-6 w-1.5 rounded-full bg-accent-500" />Skills &amp; Technologies</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.technologies.map((t) => (
                    <span key={t} className="rounded-full border border-accent-500/20 bg-accent-500/10 px-3.5 py-1.5 text-sm font-medium text-accent-700 transition hover:bg-accent-500 hover:text-white">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-2xl bg-gradient-to-br from-accent-600 to-fuchsia-600 p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold">Work with {member.name.split(' ')[0]}</h3>
              <p className="mt-2 text-sm text-white/80">Have a project in mind? Tell us about it and we&apos;ll get back to you shortly.</p>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-accent-700 transition hover:bg-white/90">
                <Mail className="h-4 w-4" /> Start a project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {Object.values(member.socials || {}).some(Boolean) && (
              <div className="rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft">
                <h3 className="font-bold text-ink-900">Connect</h3>
                <SocialLinks socials={member.socials} size="lg" className="mt-3 flex-wrap" />
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* OTHER MEMBERS */}
      {others.length > 0 && (
        <section className="container-page pb-16 sm:pb-20">
          <h2 className="text-2xl font-bold text-ink-900">Meet the rest of the team</h2>
          <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((m) => <TeamCard key={m._id} member={m} />)}
          </Stagger>
        </section>
      )}
    </div>
  );
}
