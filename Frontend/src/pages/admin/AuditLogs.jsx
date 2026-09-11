import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { auditLogsApi } from '../../api/adminApi.js';
import { DataTable } from '../../components/admin/DataTable.jsx';
import { Select } from '../../components/ui/Field.jsx';

const MODULES = ['auth', 'enquiries', 'projects', 'services', 'pricingPlans', 'teamMembers', 'testimonials', 'faqs', 'media', 'settings', 'adminUsers'];

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const [module, setModule] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', { page, module }],
    queryFn: () => auditLogsApi.list({ page, limit: 25, module: module || undefined }),
    placeholderData: keepPreviousData,
  });

  const columns = [
    { key: 'createdAt', header: 'Time', render: (l) => format(new Date(l.createdAt), 'PPp') },
    { key: 'actorName', header: 'Actor', render: (l) => l.actorName || 'System' },
    { key: 'action', header: 'Action', render: (l) => <span className="badge bg-ink-900/5 text-ink-900/60 capitalize">{l.action.replace(/_/g, ' ')}</span> },
    { key: 'module', header: 'Module', render: (l) => <span className="capitalize">{l.module}</span> },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-ink-900/50">Security and content change trail across the admin panel.</p>
        </div>
        <Select value={module} onChange={(e) => { setModule(e.target.value); setPage(1); }} className="w-48">
          <option value="">All Modules</option>
          {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
        </Select>
      </div>

      <DataTable columns={columns} rows={data?.data || []} isLoading={isLoading} emptyTitle="No audit activity yet" meta={data?.meta} onPageChange={setPage} />
    </div>
  );
}
