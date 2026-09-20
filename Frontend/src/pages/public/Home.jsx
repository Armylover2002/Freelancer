import { Link } from 'react-router-dom';
import {
  ArrowUpRight, ShieldCheck, Smartphone, Gauge, Search, LifeBuoy, Sparkles,
  MessageSquare, FileText, PenTool, Code2, TestTube2, Rocket, HeartHandshake,
} from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { useServices, useTeam, useTestimonials, useFaqs, useProjects } from '../../hooks/usePublicData.js';
import { AnimatedReveal, Stagger, StaggerItem } from '../../components/ui/AnimatedReveal.jsx';
import { SectionHeading } from '../../components/ui/SectionHeading.jsx';
import { ServiceCard } from '../../components/sections/ServiceCard.jsx';
import { ProjectCard } from '../../components/sections/ProjectCard.jsx';
import { TeamCard } from '../../components/sections/TeamCard.jsx';
import { TestimonialCard } from '../../components/sections/TestimonialCard.jsx';
import { Skeleton, EmptyState } from '../../components/ui/States.jsx';
import { trackEvent } from '../../hooks/useAnalytics.js';
import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

const TRUST_POINTS = [
  { icon: Sparkles, label: 'Modern UI/UX' },
  { icon: Smartphone, label: 'Mobile Responsive' },
  { icon: Search, label: 'SEO Ready' },
  { icon: Gauge, label: 'Fast Performance' },
  { icon: ShieldCheck, label: 'Secure Development' },
  { icon: LifeBuoy, label: 'Post-launch Support' },
];

const PROCESS_STEPS = [
  { icon: MessageSquare, title: 'Discovery', desc: 'Understand your goals, audience and constraints.' },
  { icon: FileText, title: 'Requirements', desc: 'Define scope, pages, features and success criteria.' },
  { icon: FileText, title: 'Proposal', desc: 'Transparent pricing, timeline and deliverables.' },
  { icon: PenTool, title: 'UI/UX', desc: 'Wireframes and visual design aligned to your brand.' },
  { icon: Code2, title: 'Development', desc: 'Clean, modular, production-grade implementation.' },
  { icon: TestTube2, title: 'Testing', desc: 'Cross-device QA, accessibility and performance checks.' },
  { icon: Rocket, title: 'Launch', desc: 'Deployment, monitoring and a smooth go-live.' },
  { icon: HeartHandshake, title: 'Support', desc: 'Ongoing maintenance and continuous improvement.' },
];

const WHY_US = [
  { title: 'Direct Developer Communication', desc: 'You talk directly to the people building your product - no relay through account managers.' },
  { title: 'Transparent Scope', desc: 'Clear deliverables and pricing before any work begins. No hidden surprises.' },
  { title: 'Custom Development', desc: 'No bloated templates - every build is tailored to your actual requirements.' },
  { title: 'Mobile-First', desc: 'Every project is designed and tested for mobile from day one.' },
  { title: 'Dedicated Support', desc: 'We stay involved after launch with maintenance and improvements.' },
  { title: 'Built to Scale', desc: 'Architecture decisions made with your future growth in mind.' },
];

function HomeSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-64" />
      ))}
    </div>
  );
}

export default function Home() {
  const { data: settings } = useSiteSettings();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: projectsResult, isLoading: projectsLoading } = useProjects({ featured: 'true', limit: 6 });
  const { data: team, isLoading: teamLoading } = useTeam();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const { data: faqs } = useFaqs();

  const agencyName = settings?.branding?.agencyName || 'Your Agency';
  const projects = projectsResult?.data || [];

  useDocumentHead({
    title: settings?.seoDefaults?.title || 'Web Development Studio',
    description: settings?.seoDefaults?.description || settings?.branding?.tagline,
    image: settings?.seoDefaults?.ogImage,
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-[length:22px_22px] opacity-[0.15]" />
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl animate-float" />
          <div className="absolute right-[-4rem] top-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute left-1/3 bottom-[-6rem] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl animate-float" style={{ animationDelay: '3.5s' }} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

        <div className="container-page relative py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedReveal>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-accent-400" /> {agencyName}
              </span>
            </AnimatedReveal>
            <AnimatedReveal delay={0.05}>
              <h1 className="mt-6 text-[2rem] font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
                {settings?.branding?.tagline || 'We design and build software that grows your business.'}
              </h1>
            </AnimatedReveal>
            <AnimatedReveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-xl text-base text-white/60 sm:text-lg">
                A dedicated development studio turning ideas into fast, secure, production-ready websites and web
                applications - with direct communication from discovery to launch.
              </p>
            </AnimatedReveal>
            <AnimatedReveal delay={0.15}>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/start-project"
                  onClick={() => trackEvent('enquiry_start', { meta: { from: 'hero' } })}
                  className="btn-accent w-full sm:w-auto"
                >
                  {settings?.ctaLabels?.primary || 'Start Your Project'} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link to="/portfolio" className="btn w-full border border-white/20 text-white hover:bg-white/10 sm:w-auto">
                  {settings?.ctaLabels?.secondary || 'View Our Work'}
                </Link>
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/50 sm:text-sm">
                {['Direct developer contact', 'Transparent pricing', 'Post-launch support'].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent-400" />{t}</span>
                ))}
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-ink-900/8 bg-white">
        <div className="container-page">
          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-6">
            {TRUST_POINTS.map((t) => (
              <StaggerItem key={t.label} className="flex flex-col items-center gap-2.5 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600"><t.icon className="h-5 w-5" /></span>
                <span className="text-xs font-semibold text-ink-900/70 sm:text-sm">{t.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-y container-page">
        <SectionHeading
          eyebrow="What We Do"
          title="Services built around your growth"
          description="From marketing sites to full-scale web applications - we cover the full stack of your digital presence."
        />
        <div className="mt-10 sm:mt-12">
          {servicesLoading ? (
            <HomeSkeleton />
          ) : !services?.length ? (
            <EmptyState title="Services coming soon" description="Add your services from the Admin panel to feature them here." />
          ) : (
            <>
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.slice(0, 6).map((s) => (
                  <ServiceCard key={s._id} service={s} />
                ))}
              </Stagger>
              {services.length > 6 && (
                <div className="mt-10 text-center">
                  <Link to="/services" className="btn-ghost">
                    View All Services <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="section-y bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Selected Work" title="Real projects, real results" />
          <div className="mt-10 sm:mt-12">
            {projectsLoading ? (
              <HomeSkeleton />
            ) : !projects.length ? (
              <EmptyState title="No projects published yet" description="Publish real projects from the Admin panel to showcase your work here." />
            ) : (
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <ProjectCard key={p._id} project={p} />
                ))}
              </Stagger>
            )}
          </div>
          {projects.length > 0 && (
            <div className="mt-10 text-center">
              <Link to="/portfolio" className="btn-outline">
                View Full Portfolio <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="section-y container-page">
        <SectionHeading eyebrow="Why Choose Us" title="A studio that works like a partner, not a vendor" />
        <Stagger className="mt-10 grid sm:mt-12 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((item) => (
            <StaggerItem key={item.title} className="group rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-accent-500/30 hover:shadow-xl hover:shadow-accent-500/10 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600 transition group-hover:bg-aurora-gradient group-hover:text-white"><CheckCircle2 className="h-5 w-5" /></span>
              <h3 className="mt-4 font-bold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{item.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* PROCESS */}
      <section className="section-y bg-ink-950 text-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Process"
            title="From idea to launch, step by step"
            className="[&_h2]:text-white [&_p]:text-white/55"
          />
          <Stagger className="mt-10 grid sm:mt-12 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <StaggerItem key={step.title} className="relative rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-accent-400/40 hover:bg-white/[0.08] sm:p-6">
                <span className="absolute right-4 top-4 text-3xl font-black text-white/10">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/20 text-accent-300"><step.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-bold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      {!teamLoading && team?.length > 0 && (
        <section className="section-y container-page">
          <SectionHeading eyebrow="Our Team" title="The people behind your product" />
          <Stagger className="mt-10 grid sm:mt-12 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((m) => (
              <TeamCard key={m._id} member={m} />
            ))}
          </Stagger>
        </section>
      )}

      {/* TESTIMONIALS */}
      {!testimonialsLoading && testimonials?.length > 0 && (
        <section className="section-y bg-white">
          <div className="container-page">
            <SectionHeading eyebrow="Client Feedback" title="What our clients say" />
            <Stagger className="mt-10 grid sm:mt-12 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <TestimonialCard key={t._id} testimonial={t} />
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* FAQ PREVIEW */}
      {faqs?.length > 0 && (
        <section className="section-y container-page">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="mx-auto mt-10 max-w-2xl space-y-3">
            {faqs.slice(0, 5).map((f) => (
              <FaqAccordionItem key={f._id} faq={f} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/faq" className="btn-ghost">
              View all FAQs <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="section-y relative overflow-hidden bg-gradient-to-br from-accent-600 via-fuchsia-600 to-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-[length:22px_22px] opacity-[0.15]" />
        <div className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="container-page relative text-center">
          <AnimatedReveal>
            <h2 className="text-2xl font-extrabold sm:text-4xl">Ready to build something great?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Tell us about your project - we'll get back to you within 24-48 business hours with next steps.
            </p>
            <Link
              to="/start-project"
              onClick={() => trackEvent('enquiry_start', { meta: { from: 'final_cta' } })}
              className="btn mt-8 w-full bg-white text-ink-900 shadow-lg hover:bg-white/90 sm:w-auto"
            >
              {settings?.ctaLabels?.primary || 'Start Your Project'} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </AnimatedReveal>
        </div>
      </section>
    </div>
  );
}

function FaqAccordionItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`overflow-hidden rounded-xl border bg-white transition ${open ? "border-accent-500/30 shadow-soft" : "border-ink-900/8"}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-ink-900">{faq.question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-accent-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-ink-900/55">{faq.answer}</p>}
    </div>
  );
}
