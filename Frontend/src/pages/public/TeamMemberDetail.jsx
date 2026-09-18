import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { useTeamMember } from '../../hooks/usePublicData.js';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { PageSpinner, ErrorState } from '../../components/ui/States.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../../components/ui/SocialIcons.jsx';
import NotFound from './NotFound.jsx';

const SOCIAL_ICONS = { linkedin: LinkedinIcon, github: GithubIcon, twitter: TwitterIcon, website: Globe };

export default function TeamMemberDetail() {
  const { slug } = useParams();
  const { data: member, isLoading, isError, error } = useTeamMember(slug);

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

  return (
    <div>
      <section className="bg-ink-950 text-white section-y !pb-10">
        <div className="container-page">
          <Link to="/about" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Team
          </Link>
          <AnimatedReveal>
            <div className="mt-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-white/10">
                {member.photo?.url ? (
                  <img src={member.photo.url} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl font-bold text-white/40">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold sm:text-4xl">{member.name}</h1>
                <p className="mt-1 text-lg font-medium text-accent-300">{member.role}</p>
                {member.specialty && <p className="mt-1 text-white/50">{member.specialty}</p>}
                {member.experienceText && <p className="mt-1 text-sm text-white/40">{member.experienceText}</p>}

                <div className="mt-4 flex justify-center gap-2 sm:justify-start">
                  {Object.entries(SOCIAL_ICONS).map(([key, Icon]) =>
                    member.socials?.[key] ? (
                      <a
                        key={key}
                        href={member.socials[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-white/10 p-2 text-white/60 transition hover:bg-white hover:text-ink-900"
                        aria-label={key}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      <section className="section-y container-page">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {member.bio && (
              <div>
                <h2 className="text-xl font-bold text-ink-900">About</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-900/65">{member.bio}</p>
              </div>
            )}
            {member.technologies?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-ink-900">Technologies</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.technologies.map((t) => (
                    <span key={t} className="rounded-full bg-ink-900/5 px-3 py-1.5 text-sm font-medium text-ink-900/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
