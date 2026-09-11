import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Mail, Phone } from 'lucide-react';
import { clientsAdminApi } from '../../api/adminApi.js';
import { extractErrorMessage } from '../../api/axiosClient.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { DataTable } from '../../components/admin/DataTable.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import { Modal } from '../../components/ui/Modal.jsx';
import { Textarea, Select } from '../../components/ui/Field.jsx';

export default function Clients() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null);
  const [note, setNote] = useState('');
  const debounced = useDebouncedValue(search, 400);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'clients', { page, search: debounced }],
    queryFn: () => clientsAdminApi.list({ page, limit: 15, search: debounced || undefined }),
    placeholderData: keepPreviousData,
  });

  const noteMutation = useMutation({
    mutationFn: ({ id, text }) => clientsAdminApi.addNote(id, { text }),
    onSuccess: () => {
      toast.success('Note added');
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => clientsAdminApi.updateStatus(id, { status }),
    onSuccess: () => {
      toast.success('Updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const columns = [
    { key: 'name', header: 'Client', render: (c) => (
      <div>
        <p className="font-semibold text-ink-900">{c.name}</p>
        <p className="text-xs text-ink-900/45">{c.business}</p>
      </div>
    )},
    { key: 'contact', header: 'Contact', render: (c) => (
      <div className="space-y-0.5 text-xs">
        <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</p>
        {c.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</p>}
      </div>
    )},
    { key: 'status', header: 'Status', render: (c) => (
      <span className={`badge ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
    )},
    { key: 'createdAt', header: 'Client Since', render: (c) => format(new Date(c.createdAt), 'PP') },
  ];

  return (
    <div>
      <AdminToolbar title="Clients" subtitle="Converted enquiries and active client relationships." search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} />

      <DataTable
        columns={columns}
        rows={data?.data || []}
        isLoading={isLoading}
        emptyTitle="No clients yet"
        emptyDescription="Clients are created automatically when an enquiry is marked WON."
        onEdit={(row) => setActive(row)}
        meta={data?.meta}
        onPageChange={setPage}
      />

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.name}>
        {active && (
          <div className="space-y-4">
            <div>
              <label className="label">Status</label>
              <Select value={active.status} onChange={(e) => { statusMutation.mutate({ id: active._id, status: e.target.value }); setActive({ ...active, status: e.target.value }); }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            <div>
              <label className="label">Add Note</label>
              <div className="flex gap-2">
                <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                <button
                  className="btn-accent self-end"
                  disabled={!note.trim()}
                  onClick={() => noteMutation.mutate({ id: active._id, text: note.trim() })}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {active.notes?.length ? [...active.notes].reverse().map((n, i) => (
                <div key={i} className="rounded-lg bg-ink-900/[0.03] p-3 text-sm text-ink-900/70">{n.text}</div>
              )) : <p className="text-sm text-ink-900/40">No notes yet.</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
