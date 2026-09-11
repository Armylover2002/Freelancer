import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const agencyName = settings?.branding?.agencyName || 'Your Agency';

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/8 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink-900" onClick={() => setOpen(false)}>
          {settings?.branding?.logoUrl ? (
            <img src={settings.branding.logoUrl} alt={agencyName} className="h-8 w-auto" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-sm font-black text-white">
              {agencyName.charAt(0)}
            </span>
          )}
          <span className="hidden sm:inline">{agencyName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ink-900 text-white' : 'text-ink-900/70 hover:bg-ink-900/5 hover:text-ink-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/start-project" className="btn-accent">
            {settings?.ctaLabels?.primary || 'Start Your Project'}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-ink-900 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink-900/8 bg-white lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-ink-900 text-white' : 'text-ink-900/70 hover:bg-ink-900/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/start-project" onClick={() => setOpen(false)} className="btn-accent mt-2 w-full">
                {settings?.ctaLabels?.primary || 'Start Your Project'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
