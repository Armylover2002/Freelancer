import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Download, Search } from 'lucide-react';
import { format } from 'date-fns';
import { enquiriesAdminApi } from '../../api/adminApi.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import { Skeleton, EmptyState, NoResultsState } from '../../components/ui/States.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { StatusBadge, PriorityBadge } from '../../components/ui/StatusBadge.jsx';
import { STATUS_LABELS } from '../../utils/enquiryStatus.js';

export default function Enquiries() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [archived, setArchived] = useState('false');
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'enquiries', { page, search: debouncedSearch, status, archived }],
    queryFn: () => enquiriesAdminApi.list({ page, limit: 15, search: debouncedSearch || undefined, status: status || undefined, archived }),
    placeholderData: keepPreviousData,
  });

  const items = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Enquiries</h1>
          <p className="mt-1 text-sm text-ink-900/50">Manage project leads submitted through the website.</p>
        </div>
        <a href={enquiriesAdminApi.exportCsvUrl()} target="_blank" rel="noopener noreferrer" className="btn-outline">
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/35" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, business..." className="input-field w-64 pl-9" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-48">
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={archived} onChange={(e) => { setArchived(e.target.value); setPage(1); }} className="input-field w-40">
          <option value="false">Active</option>
          <option value="true">Archived</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : !items.length ? (
        debouncedSearch || status ? <NoResultsState /> : <EmptyState title="No enquiries yet" description="Submissions from the Start Your Project form will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-ink-900/8 bg-ink-900/[0.02] text-left text-xs font-semibold uppercase tracking-wide text-ink-900/45">
                <tr>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Project Type</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/6">
                {items.map((e) => (
                  <tr key={e._id} className="cursor-pointer transition hover:bg-ink-900/[0.015]">
                    <td className="px-4 py-3">
                      <Link to={`/admin/enquiries/${e._id}`} className="block">
                        <p className="font-semibold text-ink-900">{e.contact?.name}</p>
                        <p className="text-xs text-ink-900/45">{e.contact?.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 capitalize text-ink-900/70">{e.projectType?.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-ink-900/70">{e.budgetRange}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={e.priority} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-900/50">{format(new Date(e.createdAt), 'PP')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && (
            <div className="border-t border-ink-900/8 px-4">
              <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
