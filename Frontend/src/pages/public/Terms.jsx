import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

export default function Terms() {
  const { data: settings } = useSiteSettings();
  const agencyName = settings?.branding?.agencyName || 'Your Agency';

  useDocumentHead({ title: 'Terms of Service', description: `Terms of service for ${agencyName}.` });

  return (
    <div className="section-y container-page">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-ink-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-ink-900/45">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-900/70">
          <p>These terms govern your use of the {agencyName} website and the submission of project enquiries through it.</p>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Use of This Website</h2>
            <p className="mt-2">
              This website is provided for informational purposes and to allow prospective clients to learn about
              our services and submit project requirements. You agree not to misuse the site, including submitting
              false information or attempting to disrupt its normal operation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Project Enquiries</h2>
            <p className="mt-2">
              Submitting the "Start Your Project" form does not create a binding contract. Pricing shown on this
              site represents starting estimates only; final scope, pricing and timelines are agreed separately
              in writing before any project work begins.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Intellectual Property</h2>
            <p className="mt-2">
              All content on this website, including text, graphics, logos and project case studies, is the
              property of {agencyName} or its clients and may not be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Limitation of Liability</h2>
            <p className="mt-2">
              This website is provided "as is" without warranties of any kind. We are not liable for any indirect
              or consequential damages arising from your use of this site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink-900">Contact</h2>
            <p className="mt-2">
              Questions about these terms can be sent via our <a href="/contact" className="font-semibold text-accent-600">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
