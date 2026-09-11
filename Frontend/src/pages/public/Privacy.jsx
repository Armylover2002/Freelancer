import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import { LegalContent } from '../../components/ui/LegalContent.jsx';

export default function Privacy() {
  const { data: settings } = useSiteSettings();
  const agencyName = settings?.branding?.agencyName || 'Your Agency';
  const customPolicy = settings?.legal?.privacyPolicy?.trim();

  useDocumentHead({ title: 'Privacy Policy', description: `Privacy policy for ${agencyName}.` });

  if (customPolicy) {
    return (
      <div className="section-y container-page">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold text-ink-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-900/45">Last updated: {new Date().toLocaleDateString()}</p>
          <div className="mt-8">
            <LegalContent text={customPolicy} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-y container-page">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-ink-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-900/45">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-900/70">
          <p>
            {agencyName} ("we", "us") respects your privacy. This policy explains what information we collect
            through this website and how it is used.
          </p>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Information We Collect</h2>
            <p className="mt-2">
              When you submit our project enquiry form or contact us, we collect the details you provide -
              such as your name, business, email, phone number and project requirements. We do not collect
              passwords, payment credentials or other sensitive personal information through this website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">How We Use Your Information</h2>
            <p className="mt-2">
              We use the information you submit solely to evaluate and respond to your project enquiry,
              communicate with you about your request, and improve our services. We do not sell your personal
              information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Analytics</h2>
            <p className="mt-2">
              We collect minimal, privacy-conscious first-party analytics (such as page views and button
              clicks) to understand how visitors use this website and to improve it. This data is used in
              aggregate and is not used to personally identify you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Data Retention</h2>
            <p className="mt-2">
              We retain enquiry data for as long as necessary to respond to your request and maintain business
              records. You may request deletion of your data by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Contact</h2>
            <p className="mt-2">
              If you have questions about this policy or wish to request access to or deletion of your data,
              please reach out via our <a href="/contact" className="font-semibold text-accent-600">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
