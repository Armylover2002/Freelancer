import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StaggerItem } from '../ui/AnimatedReveal.jsx';
import { SocialLinks } from '../ui/SocialLinks.jsx';

export function TeamCard({ member }) {
  return (
    <StaggerItem className="h-full">
      <div className="group flex h-full flex-col rounded-2xl border border-ink-900/8 bg-white p-6 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:border-accent-500/30 hover:shadow-xl hover:shadow-accent-500/10">
        <Link to={member.slug ? `/team/${member.slug}` : '#'} className="block flex-1">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-accent-400 to-fuchsia-500 p-[3px] transition group-hover:scale-105">
            <div className="h-full w-full overflow-hidden rounded-full bg-white">
              {member.photo?.url ? (
                <img src={member.photo.url} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center bg-ink-900/5 text-3xl font-bold text-accent-600">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink-900 transition-colors group-hover:text-accent-600">{member.name}</h3>
          <p className="text-sm font-semibold text-accent-600">{member.role}</p>
          {member.specialty && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-900/50">{member.specialty}</p>}

          {member.technologies?.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {member.technologies.slice(0, 3).map((t) => (
                <span key={t} className="max-w-[9rem] truncate rounded-full bg-accent-500/8 px-2.5 py-0.5 text-[11px] font-medium text-accent-700">{t}</span>
              ))}
              {member.technologies.length > 3 && (
                <span className="rounded-full bg-ink-900/5 px-2.5 py-0.5 text-[11px] font-medium text-ink-900/50">+{member.technologies.length - 3}</span>
              )}
            </div>
          )}
        </Link>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink-900/6 pt-4">
          <SocialLinks socials={member.socials} />
          <Link to={member.slug ? `/team/${member.slug}` : '#'} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-accent-600 hover:gap-1.5">
            Profile <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </StaggerItem>
  );
}
