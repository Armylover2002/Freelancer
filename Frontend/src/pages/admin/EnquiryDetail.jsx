import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Mail, Phone, Globe, MessageSquare, Send, Archive, ArchiveRestore,
  Paperclip, ExternalLink,
} from 'lucide-react';
import { enquiriesAdminApi, adminUsersApi } from '../../api/adminApi.js';
import { extractErrorMessage } from '../../api/axiosClient.js';
import { PageSpinner, ErrorState } from '../../components/ui/States.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { ENQUIRY_STATUS_ORDER, STATUS_LABELS } from '../../utils/enquiryStatus.js';
import { Textarea, Select } from '../../components/ui/Field.jsx';
import { TagInput } from '../../components/admin/TagInput.jsx';
import { useAuth } from '../../hooks/useAuth.js';

function InfoRow({ icon: Icon, label, value, href }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-900/35" />
      <div>
        <p className="text-xs text-ink-900/40">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-600">{value}</a>
        ) : (
          <p className="font-medium text-ink-900">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function EnquiryDetail() {
  const { id } = useParams();
  const { admin } = useAuth();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');

  const { data: enquiry, isLoading, isError } = useQuery({
    queryKey: ['admin', 'enquiry', id],
    queryFn: () => enquiriesAdminApi.getById(id),
  });

  const { data: adminUsers } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminUsersApi.list,
    enabled: admin?.role === 'owner',
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'enquiry', id] });

  const statusMutation = useMutation({
    mutationFn: (payload) => enquiriesAdminApi.updateStatus(id, payload),
    onSuccess: () => { toast.success('Status updated'); invalidate(); },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const noteMutation = useMutation({
    mutationFn: (payload) => enquiriesAdminApi.addNote(id, payload),
    onSuccess: () => { toast.success('Note added'); setNote(''); invalidate(); },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => enquiriesAdminApi.update(id, payload),
    onSuccess: () => { toast.success('Saved'); invalidate(); },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  if (isLoading) return <PageSpinner label="Loading enquiry..." />;
  if (isError || !enquiry) return <ErrorState title="Enquiry not found" />;

  return (
    <div>
      <Link to="/admin/enquiries" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900/50 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to Enquiries
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{enquiry.contact.name}</h1>
          <p className="mt-1 text-sm text-ink-900/50">Submitted {format(new Date(enquiry.createdAt), 'PPp')}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={enquiry.status} />
          <button
            onClick={() => updateMutation.mutate({ archived: !enquiry.archived })}
            className="btn-outline !px-3 !py-2 text-xs"
          >
            {enquiry.archived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
            {enquiry.archived ? 'Unarchive' : 'Archive'}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Status pipeline */}
          <div className="card p-5">
            <h2 className="font-bold text-ink-900">Lead Pipeline</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {ENQUIRY_STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ status: s })}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    enquiry.status === s ? 'bg-ink-900 text-white' : 'bg-ink-900/5 text-ink-900/60 hover:bg-ink-900/10'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Contact & business */}
          <div className="card p-5">
            <h2 className="font-bold text-ink-900">Contact & Business</h2>
            <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
              <InfoRow icon={Mail} label="Email" value={enquiry.contact.email} href={`mailto:${enquiry.contact.email}`} />
              <InfoRow icon={Phone} label="Phone" value={enquiry.contact.phone} href={`tel:${enquiry.contact.phone}`} />
              <InfoRow icon={Globe} label="Business" value={enquiry.contact.business} />
              <InfoRow icon={Globe} label="Country" value={enquiry.contact.country} />
              <InfoRow icon={Globe} label="Existing URL" value={enquiry.business?.existingUrl} href={enquiry.business?.existingUrl} />
              <InfoRow icon={MessageSquare} label="Preferred Contact" value={enquiry.contact.preferredContactMethod} />
            </div>
            {enquiry.business?.description && (
              <div className="mt-3 border-t border-ink-900/8 pt-3">
                <p className="text-xs text-ink-900/40">Business Description</p>
                <p className="mt-1 text-sm text-ink-900/75">{enquiry.business.description}</p>
              </div>
            )}
            {enquiry.business?.painPoint && (
              <div className="mt-3">
                <p className="text-xs text-ink-900/40">Pain Point</p>
                <p className="mt-1 text-sm text-ink-900/75">{enquiry.business.painPoint}</p>
              </div>
            )}
          </div>

          {/* Project details */}
          <div className="card p-5">
            <h2 className="font-bold text-ink-900">Project Requirements</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-ink-900/40">Project Type</p>
                <p className="mt-1 text-sm font-medium capitalize text-ink-900">{enquiry.projectType?.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-ink-900/40">Design Style</p>
                <p className="mt-1 text-sm font-medium capitalize text-ink-900">{enquiry.design?.style}</p>
              </div>
              <div>
                <p className="text-xs text-ink-900/40">Budget Range</p>
                <p className="mt-1 text-sm font-medium text-ink-900">{enquiry.budgetRange}</p>
              </div>
              <div>
                <p className="text-xs text-ink-900/40">Timeline</p>
                <p className="mt-1 text-sm font-medium capitalize text-ink-900">{enquiry.timeline?.replace(/_/g, ' ')}</p>
              </div>
            </div>
            {enquiry.pages?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-ink-900/40">Pages Needed</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {enquiry.pages.map((p) => <span key={p} className="badge bg-ink-900/5 text-ink-900/60">{p}</span>)}
                </div>
              </div>
            )}
            {enquiry.features?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-ink-900/40">Features</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {enquiry.features.map((f) => <span key={f} className="badge bg-ink-900/5 text-ink-900/60">{f}</span>)}
                </div>
              </div>
            )}
            {enquiry.design?.referenceUrls?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-ink-900/40">Reference URLs</p>
                <div className="mt-1.5 space-y-1">
                  {enquiry.design.referenceUrls.map((u) => (
                    <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-accent-600">
                      <ExternalLink className="h-3.5 w-3.5" /> {u}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {(enquiry.design?.brandAssets?.length > 0 || enquiry.files?.length > 0) && (
              <div className="mt-4">
                <p className="text-xs text-ink-900/40">Attachments</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {[...(enquiry.design?.brandAssets || []), ...(enquiry.files || [])].map((f, i) => (
                    <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-ink-900/5 px-3 py-1.5 text-xs font-medium text-ink-900/70 hover:bg-ink-900/10">
                      <Paperclip className="h-3 w-3" /> {f.originalName || 'File'}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {enquiry.brief && (
              <div className="mt-4 border-t border-ink-900/8 pt-4">
                <p className="text-xs text-ink-900/40">Additional Brief</p>
                <p className="mt-1 whitespace-pre-line text-sm text-ink-900/75">{enquiry.brief}</p>
              </div>
            )}
          </div>

          {/* Notes & activity */}
          <div className="card p-5">
            <h2 className="font-bold text-ink-900">Notes & Activity</h2>
            <div className="mt-3 flex gap-2">
              <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note about this lead..." />
              <button
                onClick={() => note.trim() && noteMutation.mutate({ text: note.trim() })}
                disabled={noteMutation.isPending || !note.trim()}
                className="btn-accent self-end"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {[...(enquiry.notes || [])].reverse().map((n, i) => (
                <div key={i} className="rounded-lg bg-ink-900/[0.03] p-3 text-sm">
                  <p className="text-ink-900/80">{n.text}</p>
                  <p className="mt-1 text-xs text-ink-900/35">{n.authorName || 'Admin'} · {format(new Date(n.createdAt), 'PPp')}</p>
                </div>
              ))}
              <div className="border-t border-ink-900/8 pt-3">
                {[...(enquiry.activity || [])].reverse().slice(0, 10).map((a, i) => (
                  <p key={i} className="py-1 text-xs text-ink-900/40">
                    {format(new Date(a.createdAt), 'PPp')} - {a.actorName || 'System'}: {a.type.replace(/_/g, ' ')}
                    {a.toStatus && ` -> ${STATUS_LABELS[a.toStatus]}`}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: lead management */}
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-bold text-ink-900">Lead Management</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="label">Priority</label>
                <Select value={enquiry.priority} onChange={(e) => updateMutation.mutate({ priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>

              {admin?.role === 'owner' && (
                <div>
                  <label className="label">Assignee</label>
                  <Select
                    value={enquiry.assignee?._id || ''}
                    onChange={(e) => updateMutation.mutate({ assignee: e.target.value || null })}
                  >
                    <option value="">Unassigned</option>
                    {adminUsers?.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </Select>
                </div>
              )}

              <div>
                <label className="label">Follow-up Date</label>
                <input
                  type="date"
                  className="input-field"
                  defaultValue={enquiry.followUpDate ? enquiry.followUpDate.slice(0, 10) : ''}
                  onChange={(e) => updateMutation.mutate({ followUpDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>

              <div>
                <label className="label">Estimated Value (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  defaultValue={enquiry.estimatedValue ?? ''}
                  onBlur={(e) => updateMutation.mutate({ estimatedValue: e.target.value ? Number(e.target.value) : null })}
                />
              </div>

              <div>
                <label className="label">Tags</label>
                <TagInput value={enquiry.tags || []} onChange={(tags) => updateMutation.mutate({ tags })} placeholder="Add tag..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
