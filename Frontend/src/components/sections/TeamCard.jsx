import { Globe } from 'lucide-react';
import { StaggerItem } from '../ui/AnimatedReveal.jsx';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons.jsx';

const SOCIAL_ICONS = { linkedin: LinkedinIcon, github: GithubIcon, twitter: TwitterIcon, website: Globe };

export function TeamCard({ member }) {
  return (
    <StaggerItem>
      <div className="group rounded-2xl border border-ink-900/8 bg-white p-5 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-ink-900/5">
          {member.photo?.url ? (
            <img src={member.photo.url} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-bold text-ink-900/25">
              {member.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="mt-4 font-bold text-ink-900">{member.name}</h3>
        <p className="text-sm font-medium text-accent-600">{member.role}</p>
        {member.specialty && <p className="mt-1 text-xs text-ink-900/45">{member.specialty}</p>}

        {member.technologies?.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {member.technologies.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-ink-900/5 px-2 py-0.5 text-[11px] font-medium text-ink-900/55">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-center gap-2">
          {Object.entries(SOCIAL_ICONS).map(([key, Icon]) =>
            member.socials?.[key] ? (
              <a
                key={key}
                href={member.socials[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-ink-900/5 p-2 text-ink-900/50 transition hover:bg-ink-900 hover:text-white"
                aria-label={key}
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ) : null
          )}
        </div>
      </div>
    </StaggerItem>
  );
}
