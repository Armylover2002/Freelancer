import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { StaggerItem } from '../ui/AnimatedReveal.jsx';
import { trackEvent } from '../../hooks/useAnalytics.js';

export function ProjectCard({ project }) {
  return (
    <StaggerItem>
      <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="group relative">
        {/* animated aurora border - hidden until hover, revealed as a thin ring behind the card */}
        <div className="absolute -inset-[1.5px] rounded-2xl bg-aurora-gradient opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute -inset-[1.5px] rounded-2xl bg-aurora-gradient opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <Link
          to={`/portfolio/${project.slug}`}
          onClick={() => trackEvent('project_cta_click', { meta: { projectSlug: project.slug } })}
          className="relative block overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-soft transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-accent-500/10"
        >
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-ink-900/[0.04]">
            {project.coverImage?.url ? (
              <img
                src={project.coverImage.url}
                alt={project.coverImage.altText || project.title}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-900/20">
                <span className="text-4xl font-black">{project.title.charAt(0)}</span>
              </div>
            )}
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur">
              {project.category}
            </span>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-1.5 bg-gradient-to-t from-ink-950/70 to-transparent px-3 pb-3 pt-8 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              View Case Study <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-ink-900 transition-colors group-hover:text-accent-600">{project.title}</h3>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900/5 text-ink-900/40 transition group-hover:bg-accent-500 group-hover:text-white">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
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
      </motion.div>
    </StaggerItem>
  );
}
