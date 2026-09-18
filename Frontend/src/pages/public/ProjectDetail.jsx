import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Clock, ExternalLink,
  Layers, Lightbulb, Smartphone, Sparkles, Tag, TrendingUp, X, ZoomIn,
} from 'lucide-react';
import { useProject } from '../../hooks/usePublicData.js';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { PageSpinner, ErrorState } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import NotFound from './NotFound.jsx';

function DetailRow({ icon: Icon, label, value, href }) {
  if (!value) return null;
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-900/5 text-ink-900/50">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-ink-900/45">{label}</span>
        <span className="block truncate font-medium text-ink-900">{value}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl px-1 py-1.5 transition hover:bg-ink-900/[0.03]"
      >
        {content}
        <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-900/30" />
      </a>
    );
  }

  return <div className="flex items-center gap-3 px-1 py-1.5">{content}</div>;
}

function StepCard({ number, icon: Icon, title, text, last }) {
  return (
    <div className="relative flex gap-5">
      <div className="flex flex-col items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aurora-gradient text-sm font-extrabold text-white shadow-glow">
          {number}
        </span>
        {!last && <span className="mt-2 w-px flex-1 bg-gradient-to-b from-ink-900/15 to-transparent" />}
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2 text-ink-900/40">
          <Icon className="h-4 w-4" />
          <h2 className="text-base font-bold text-ink-900">{title}</h2>
        </div>
        <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-ink-900/65">{text}</p>
      </div>
    </div>
  );
}

function Lightbox({ screenshots, index, onClose, onNav }) {
  if (index === null) return null;
  const shot = screenshots[index];

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
        {screenshots.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onNav(-1); }}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNav(1); }}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        <motion.img
          key={shot.url}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          src={shot.url}
          alt={shot.altText || `Screenshot ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        />
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, isLoading, isError, error } = useProject(slug);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useDocumentHead({
    title: project ? `${project.seo?.title || project.title} - Case Study` : undefined,
    description: project?.seo?.description || project?.summary,
    image: project?.coverImage?.url,
  });

  if (isLoading) return <PageSpinner label="Loading case study..." />;
  if (isError) {
    if (error?.response?.status === 404) return <NotFound />;
    return <ErrorState title="Couldn't load this project" description="Please try again shortly." />;
  }
  if (!project) return <NotFound />;

  const screenshots = project.screenshots || [];
  const navigate = (delta) => setLightboxIndex((i) => (i + delta + screenshots.length) % screenshots.length);

  return (
    <div>
      {/* HERO - copy on the left, uncropped cover shot floating as a card on the right */}
      <section className="relative overflow-hidden bg-ink-950 pb-14 pt-8 text-white sm:pb-20 sm:pt-10">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />

        <div className="container-page relative">
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <AnimatedReveal>
              <span className="badge bg-white/10 text-white/70">{project.category}</span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">{project.title}</h1>
              {project.businessType && <p className="mt-2 text-white/50">{project.businessType}</p>}
              <p className="mt-4 max-w-xl text-white/60">{project.summary}</p>

              {project.techStack?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">{t}</span>
                  ))}
                </div>
              )}

              {(project.liveUrl || project.playStoreUrl) && (
                <div className="mt-7 flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-accent inline-flex">
                      Visit Live Site <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {project.playStoreUrl && (
                    <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex border-white/20 text-white hover:border-white/40 hover:bg-white/5">
                      Get it on Play Store <Smartphone className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </AnimatedReveal>

            {project.coverImage?.url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-white/5 blur-md" />
                <div className="flex max-h-[380px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
                  <img
                    src={project.coverImage.url}
                    alt={project.coverImage.altText || project.title}
                    className="max-h-[380px] w-full object-contain"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {(project.problem || project.solution) && (
              <div className="mb-2">
                {project.problem && (
                  <StepCard number="01" icon={Lightbulb} title="The Problem" text={project.problem} last={!project.solution} />
                )}
                {project.solution && (
                  <StepCard number="02" icon={Sparkles} title="The Solution" text={project.solution} last />
                )}
              </div>
            )}

            {project.features?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-ink-900">Key Features</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 rounded-xl border border-ink-900/8 bg-white px-4 py-3 text-sm text-ink-900/75 shadow-soft transition hover:border-accent-500/30 hover:shadow-md">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-accent-600">
                        <Sparkles className="h-3 w-3" />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {screenshots.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-ink-900">Screenshots</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {screenshots.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="group relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-ink-900/8 bg-ink-900/[0.03] shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:h-36"
                    >
                      <img
                        src={s.url}
                        alt={s.altText || `Screenshot ${i + 1}`}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all duration-300 group-hover:bg-ink-950/30 group-hover:opacity-100">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-lg">
                          <ZoomIn className="h-4 w-4" />
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {project.results && (
              <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
                <TrendingUp className="absolute -right-3 -top-3 h-24 w-24 text-emerald-500/10" />
                <div className="relative flex items-center gap-2 text-emerald-800">
                  <TrendingUp className="h-5 w-5" />
                  <h2 className="text-xl font-bold">Results</h2>
                </div>
                <p className="relative mt-2 whitespace-pre-line text-sm leading-relaxed text-emerald-700">{project.results}</p>
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <h3 className="px-1 font-bold text-ink-900">Project Details</h3>
              <div className="mt-3 divide-y divide-ink-900/6">
                <DetailRow icon={Tag} label="Category" value={project.category} />
                {project.businessType && <DetailRow icon={Layers} label="Business Type" value={project.businessType} />}
                {project.timeline && <DetailRow icon={Clock} label="Timeline" value={project.timeline} />}
                {project.liveUrl && <DetailRow icon={ExternalLink} label="Live Site" value={project.liveUrl.replace(/^https?:\/\//, '')} href={project.liveUrl} />}
                {project.playStoreUrl && <DetailRow icon={Smartphone} label="Play Store" value="View on Google Play" href={project.playStoreUrl} />}
              </div>
            </div>
            <div className="card bg-ink-900 p-6 text-white">
              <h3 className="font-bold">Want something similar?</h3>
              <p className="mt-2 text-sm text-white/60">Tell us about your project and we'll get back to you soon.</p>
              <Link to="/start-project" className="btn-accent mt-4 w-full">
                Start Your Project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <Lightbox screenshots={screenshots} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={navigate} />
    </div>
  );
}
