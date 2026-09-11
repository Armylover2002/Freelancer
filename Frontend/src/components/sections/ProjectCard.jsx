import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { StaggerItem } from '../ui/AnimatedReveal.jsx';
import { trackEvent } from '../../hooks/useAnalytics.js';

export function ProjectCard({ project }) {
  return (
    <StaggerItem>
      <Link
        to={`/portfolio/${project.slug}`}
        onClick={() => trackEvent('project_cta_click', { meta: { projectSlug: project.slug } })}
        className="group block overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-900/5">
          {project.coverImage?.url ? (
            <img
              src={project.coverImage.url}
              alt={project.coverImage.altText || project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-900/20">
              <span className="text-4xl font-black">{project.title.charAt(0)}</span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-900 backdrop-blur">
            {project.category}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-ink-900">{project.title}</h3>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-900/30 transition group-hover:text-accent-500" />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-ink-900/55">{project.summary}</p>
          {project.techStack?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <span key={tech} className="rounded-full bg-ink-900/5 px-2 py-0.5 text-[11px] font-medium text-ink-900/60">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </StaggerItem>
  );
}
