import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  Search, CheckCircle2, Clock, Mail, Phone, Globe, MessageSquare, Loader2, FileText, Paperclip, ExternalLink,
} from 'lucide-react';
import { publicApi } from '../../api/publicApi.js';
import { extractErrorMessage } from '../../api/axiosClient.js';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { Input, FormField } from '../../components/ui/Field.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { EmptyState } from '../../components/ui/States.jsx';
import { STATUS_LABELS, STATUS_CUSTOMER_MESSAGES, ENQUIRY_STATUS_ORDER } from '../../utils/enquiryStatus.js';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import { format } from 'date-fns';

function InfoRow({ icon: Icon, label, value, href }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-900/35" />
      <div>
        <p className="text-[11px] text-ink-900/40">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent-600 break-all">{value}</a>
        ) : (
          <p className="text-sm font-medium text-ink-900 break-all">{value}</p>
        )}
      </div>
    </div>
  );
}

function Timeline({ history, currentStatus }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-ink-900">Status Timeline</h3>
      <ol className="mt-3 space-y-3">
        {ENQUIRY_STATUS_ORDER.filter((s) => s !== 'LOST' || currentStatus === 'LOST').map((status) => {
          const entry = history.find((h) => h.status === status);
          const reached = Boolean(entry);
          const isCurrent = status === currentStatus;
          return (
            <li key={status} className="flex gap-3">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${reached ? 'bg-aurora-gradient text-white' : 'bg-ink-900/8 text-ink-900/30'}`}>
                {reached ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-2.5 w-2.5" />}
              </span>
              <div className={isCurrent ? '' : reached ? 'opacity-80' : 'opacity-40'}>
                <p className="text-sm font-semibold text-ink-900">{STATUS_LABELS[status]}</p>
                {entry?.date && <p className="text-xs text-ink-900/40">{format(new Date(entry.date), 'PPp')}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function EnquiryResultCard({ enquiry }) {
  const allFiles = [...(enquiry.design?.brandAssets || [])];

  return (
    <AnimatedReveal className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-ink-900/40">Submitted {format(new Date(enquiry.submittedAt), 'PPp')}</p>
          <p className="text-lg font-bold capitalize text-ink-900">{enquiry.projectType?.replace(/_/g, ' ')}</p>
        </div>
        <StatusBadge status={enquiry.status} />
      </div>
      <p className="mt-3 rounded-lg bg-accent-500/5 px-4 py-3 text-sm text-ink-900/75">
        {STATUS_CUSTOMER_MESSAGES[enquiry.status]}
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <Timeline history={enquiry.statusHistory || []} currentStatus={enquiry.status} />

        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink-900">
            <FileText className="h-4 w-4 text-ink-900/40" /> What You Submitted
          </h3>

          <div className="mt-3 grid gap-x-4 sm:grid-cols-2">
            <InfoRow icon={Mail} label="Email" value={enquiry.contact.email} href={`mailto:${enquiry.contact.email}`} />
            <InfoRow icon={Phone} label="Phone" value={enquiry.contact.phone} href={`tel:${enquiry.contact.phone}`} />
            <InfoRow icon={Globe} label="Business" value={enquiry.contact.business} />
            <InfoRow icon={Globe} label="Country" value={enquiry.contact.country} />
            <InfoRow icon={MessageSquare} label="Preferred Contact" value={enquiry.contact.preferredContactMethod} />
            <InfoRow icon={Globe} label="Existing URL" value={enquiry.business?.existingUrl} href={enquiry.business?.existingUrl} />
          </div>

          <dl className="mt-3 grid gap-3 border-t border-ink-900/8 pt-3 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] text-ink-900/40">Budget Range</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink-900">{enquiry.budgetRange}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-900/40">Timeline</dt>
              <dd className="mt-0.5 text-sm font-medium capitalize text-ink-900">{enquiry.timeline?.replace(/_/g, ' ')}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-900/40">Design Style</dt>
              <dd className="mt-0.5 text-sm font-medium capitalize text-ink-900">{enquiry.design?.style}</dd>
            </div>
            {enquiry.heardFrom && (
              <div>
                <dt className="text-[11px] text-ink-900/40">Heard About Us Via</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink-900">{enquiry.heardFrom}</dd>
              </div>
            )}
          </dl>

          {enquiry.business?.description && (
            <div className="mt-3 border-t border-ink-900/8 pt-3">
              <p className="text-[11px] text-ink-900/40">Business Description</p>
              <p className="mt-1 text-sm text-ink-900/70">{enquiry.business.description}</p>
            </div>
          )}
          {enquiry.business?.targetCustomers && (
            <div className="mt-3">
              <p className="text-[11px] text-ink-900/40">Target Customers</p>
              <p className="mt-1 text-sm text-ink-900/70">{enquiry.business.targetCustomers}</p>
            </div>
          )}
          {enquiry.business?.painPoint && (
            <div className="mt-3">
              <p className="text-[11px] text-ink-900/40">Pain Point</p>
              <p className="mt-1 text-sm text-ink-900/70">{enquiry.business.painPoint}</p>
            </div>
          )}

          {enquiry.pages?.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] text-ink-900/40">Pages Requested</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {enquiry.pages.map((p) => <span key={p} className="badge bg-ink-900/5 text-ink-900/60">{p}</span>)}
              </div>
            </div>
          )}
          {enquiry.features?.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] text-ink-900/40">Features Requested</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {enquiry.features.map((f) => <span key={f} className="badge bg-ink-900/5 text-ink-900/60">{f}</span>)}
              </div>
            </div>
          )}
          {enquiry.design?.referenceUrls?.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] text-ink-900/40">Reference URLs</p>
              <div className="mt-1.5 space-y-1">
                {enquiry.design.referenceUrls.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-accent-600">
                    <ExternalLink className="h-3.5 w-3.5" /> {u}
                  </a>
                ))}
              </div>
            </div>
          )}
          {allFiles.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] text-ink-900/40">Attachments</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {allFiles.map((f, i) => (
                  <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-ink-900/5 px-3 py-1.5 text-xs font-medium text-ink-900/70 hover:bg-ink-900/10">
                    <Paperclip className="h-3 w-3" /> {f.originalName || 'File'}
                  </a>
                ))}
              </div>
            </div>
          )}
          {enquiry.brief && (
            <div className="mt-3 border-t border-ink-900/8 pt-3">
              <p className="text-[11px] text-ink-900/40">Your Brief</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-900/70">{enquiry.brief}</p>
            </div>
          )}
        </div>
      </div>
    </AnimatedReveal>
  );
}

export default function TrackEnquiry() {
  useDocumentHead({
    title: 'Track Your Request',
    description: 'Check the status of a project request you submitted.',
    noIndex: true,
  });

  const [params] = useSearchParams();
  const [email, setEmail] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: params.get('email') || '' },
  });

  const { data: results, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['public', 'track-enquiries', email],
    queryFn: () => publicApi.trackEnquiries(email),
    enabled: Boolean(email),
    retry: false,
  });

  const onSubmit = (values) => {
    const trimmed = values.email.trim();
    if (trimmed === email) refetch();
    else setEmail(trimmed);
  };

  return (
    <div className="bg-gradient-to-b from-accent-500/[0.08] via-transparent to-transparent">
    <div className="container-page py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Track Your Request</h1>
          <p className="mt-3 text-ink-900/55">
            Enter the email you used when submitting your project request to see its current status.
          </p>
        </AnimatedReveal>

        <form onSubmit={handleSubmit(onSubmit)} className="card mx-auto mt-8 max-w-md space-y-4 p-6 sm:p-8">
          <FormField label="Email used when submitting" required error={errors.email?.message}>
            <Input type="email" {...register('email', { required: 'Enter your email' })} placeholder="you@example.com" />
          </FormField>
          <button type="submit" disabled={isFetching} className="btn-accent w-full">
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {isFetching ? 'Looking up...' : 'Check Status'}
          </button>
        </form>

        {isError && (
          <AnimatedReveal className="mx-auto mt-6 max-w-md rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {extractErrorMessage(error)}
          </AnimatedReveal>
        )}

        {results && results.length === 0 && (
          <div className="mx-auto mt-8 max-w-md">
            <EmptyState
              title="No requests found"
              description="We couldn't find any project request submitted with that email. Double-check the address, or submit a new request."
              action={<Link to="/start-project" className="btn-outline mt-2">Start a Project</Link>}
            />
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-8 space-y-6">
            {results.length > 1 && (
              <p className="text-center text-sm text-ink-900/45">Found {results.length} requests submitted with this email.</p>
            )}
            {results.map((enquiry) => <EnquiryResultCard key={enquiry.id} enquiry={enquiry} />)}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
