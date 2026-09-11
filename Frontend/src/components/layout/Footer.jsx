import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons.jsx';

const QUICK_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
  { to: '/track-request', label: 'Track Your Request' },
];

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

const SOCIAL_META = {
  linkedin: {
    Icon: LinkedinIcon,
    className: 'bg-[#0A66C2] text-white hover:bg-[#004182]',
  },
  twitter: {
    Icon: TwitterIcon,
    className: 'bg-black text-white ring-1 ring-inset ring-white/15 hover:bg-neutral-800',
  },
  instagram: {
    Icon: InstagramIcon,
    className:
      'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:brightness-110',
  },
  github: {
    Icon: GithubIcon,
    className: 'bg-white text-[#181717] hover:bg-neutral-200',
  },
};

export function Footer() {
  const { data: settings } = useSiteSettings();
  const agencyName = settings?.branding?.agencyName || 'Your Agency';
  const socials = settings?.socials || {};

  return (
    <footer className="border-t border-ink-900/8 bg-ink-950 text-white/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-white">{agencyName}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            {settings?.branding?.tagline || 'We design and build software that grows your business.'}
          </p>
          <div className="mt-4 flex gap-3">
            {Object.entries(SOCIAL_META).map(([key, { Icon, className }]) =>
              socials[key] ? (
                <a
                  key={key}
                  href={socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full p-2 transition ${className}`}
                  aria-label={key}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : null
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Legal</p>
          <ul className="mt-4 space-y-2 text-sm">
            {LEGAL_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {settings?.contact?.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${settings.contact.email}`} className="hover:text-white break-all">
                  {settings.contact.email}
                </a>
              </li>
            )}
            {settings?.contact?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${settings.contact.phone}`} className="hover:text-white">
                  {settings.contact.phone}
                </a>
              </li>
            )}
            {settings?.contact?.address && (
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{settings.contact.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="container-page text-center text-xs text-white/40">
          © {new Date().getFullYear()} {agencyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
