import { Link } from 'react-router-dom';
import { PageHero } from '../../components/ui/PageHero.jsx';
import { Mail, Phone, MessageCircle, MapPin, ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { trackEvent } from '../../hooks/useAnalytics.js';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

export default function Contact() {
  const { data: settings, isLoading } = useSiteSettings();
  const contact = settings?.contact || {};

  useDocumentHead({
    title: 'Contact Us',
    description: 'Reach out directly or submit your project requirements for a structured response.',
  });

  const CHANNELS = [
    contact.email && { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { icon: Phone, label: 'Phone', value: contact.phone, href: `tel:${contact.phone}` },
    contact.whatsapp && { icon: MessageCircle, label: 'WhatsApp', value: contact.whatsapp, href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` },
    contact.address && { icon: MapPin, label: 'Location', value: contact.address },
  ].filter(Boolean);

  return (
    <div>
      <PageHero eyebrow="Contact" title="Let's talk about your project" description="Reach out directly, or submit your requirements through our project form for a faster, structured response." />

      <section className="section-y container-page">
        <div className="grid gap-10 lg:grid-cols-2">
          <AnimatedReveal>
            <div className="card p-8">
              <h2 className="text-xl font-bold text-ink-900">Get in touch</h2>
              {isLoading ? (
                <p className="mt-4 text-sm text-ink-900/40">Loading contact details...</p>
              ) : !CHANNELS.length ? (
                <p className="mt-4 text-sm text-ink-900/40">Contact details will appear here once configured in Admin settings.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {CHANNELS.map((c) => (
                    <div key={c.label} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600">
                        <c.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-900/40">{c.label}</p>
                        {c.href ? (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('contact_click', { meta: { channel: c.label } })}
                            className="font-medium text-ink-900 hover:text-accent-600"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <p className="font-medium text-ink-900">{c.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {contact.businessHours && (
                <p className="mt-6 border-t border-ink-900/8 pt-4 text-sm text-ink-900/50">
                  Business hours: {contact.businessHours}
                </p>
              )}
            </div>
          </AnimatedReveal>

          <AnimatedReveal delay={0.1}>
            <div className="card flex h-full flex-col justify-center bg-gradient-to-br from-ink-900 to-ink-950 p-8 text-white">
              <h2 className="text-xl font-bold">Have a project in mind?</h2>
              <p className="mt-3 text-white/60">
                Our structured project form takes about 5 minutes and helps us understand your requirements clearly -
                leading to a faster, more accurate proposal.
              </p>
              <Link
                to="/start-project"
                onClick={() => trackEvent('enquiry_start', { meta: { from: 'contact_page' } })}
                className="btn-accent mt-6 w-full sm:w-auto"
              >
                Start Your Project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedReveal>
        </div>
      </section>
    </div>
  );
}
