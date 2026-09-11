import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useProject } from '../../hooks/usePublicData.js';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { PageSpinner, ErrorState } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import NotFound from './NotFound.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, isLoading, isError, error } = useProject(slug);

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

  return (
    <div>
      <section className="bg-ink-950 text-white section-y !pb-10">
        <div className="container-page">
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>
          <AnimatedReveal>
            <span className="badge mt-6 bg-white/10 text-white/70">{project.category}</span>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">{project.title}</h1>
            {project.businessType && <p className="mt-2 text-white/50">{project.businessType}</p>}
            <p className="mt-4 max-w-2xl text-white/60">{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack?.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">{t}</span>
              ))}
            </div>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-accent mt-6 inline-flex">
                Visit Live Site <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </AnimatedReveal>
        </div>
      </section>

      {project.coverImage?.url && (
        <div className="container-page -mt-8">
          <img
            src={project.coverImage.url}
            alt={project.coverImage.altText || project.title}
            className="w-full rounded-2xl border border-ink-900/8 object-cover shadow-soft"
          />
        </div>
      )}

      <section className="section-y container-page">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {project.problem && (
              <div>
                <h2 className="text-xl font-bold text-ink-900">The Problem</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-900/65">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div>
                <h2 className="text-xl font-bold text-ink-900">The Solution</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-900/65">{project.solution}</p>
              </div>
            )}
            {project.features?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-ink-900">Key Features</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="rounded-lg bg-white px-4 py-2.5 text-sm text-ink-900/70 shadow-soft">{f}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.screenshots?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-ink-900">Screenshots</h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {project.screenshots.map((s, i) => (
                    <img key={i} src={s.url} alt={s.altText || `Screenshot ${i + 1}`} loading="lazy" className="rounded-xl border border-ink-900/8 object-cover shadow-soft" />
                  ))}
                </div>
              </div>
            )}
            {project.results && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <h2 className="text-xl font-bold text-emerald-800">Results</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-emerald-700">{project.results}</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-ink-900">Project Details</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {project.timeline && (
                  <div className="flex justify-between"><dt className="text-ink-900/50">Timeline</dt><dd className="font-medium text-ink-900">{project.timeline}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-ink-900/50">Category</dt><dd className="font-medium text-ink-900">{project.category}</dd></div>
              </dl>
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
    </div>
  );
}
