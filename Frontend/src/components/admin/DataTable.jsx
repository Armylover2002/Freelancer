import { useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Skeleton, EmptyState } from '../ui/States.jsx';
import { Pagination } from '../ui/Pagination.jsx';

export function DataTable({
  columns,
  rows,
  isLoading,
  emptyTitle = 'No records yet',
  emptyDescription,
  onEdit,
  onDelete,
  meta,
  onPageChange,
  rowKey = '_id',
  viewTitle = 'Details',
}) {
  const [viewRow, setViewRow] = useState(null);
  const showActions = true; // View is always available so admins can inspect every field they entered
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
      </div>
    );
  }

  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-900/8 bg-ink-900/[0.02] text-left text-xs font-semibold uppercase tracking-wide text-ink-900/45">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3">{col.header}</th>
              ))}
              {showActions && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/6">
            {rows.map((row) => (
              <tr key={row[rowKey]} className="transition hover:bg-ink-900/[0.015]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-middle text-ink-900/80">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => setViewRow(row)} className="rounded-lg p-2 text-ink-900/50 hover:bg-ink-900/5 hover:text-accent-600" aria-label="View" title="View details">
                        <Eye className="h-4 w-4" />
                      </button>
                      {onEdit && (
                        <button onClick={() => onEdit(row)} className="rounded-lg p-2 text-ink-900/50 hover:bg-ink-900/5 hover:text-accent-600" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)} className="rounded-lg p-2 text-ink-900/50 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {meta && onPageChange && (
        <div className="border-t border-ink-900/8 px-4">
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={onPageChange} />
        </div>
      )}
      <Modal open={Boolean(viewRow)} onClose={() => setViewRow(null)} title={viewTitle} maxWidth="max-w-2xl">
        {viewRow && <RecordDetails record={viewRow} />}
      </Modal>
    </div>
  );
}

const HIDDEN_KEYS = new Set(['_id', '__v', 'id']);

const labelOf = (key) => key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase());
const isImageUrl = (v) => typeof v === 'string' && /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$|res\.cloudinary\.com/i.test(v);
const isDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v);

function Value({ value }) {
  if (value === null || value === undefined || value === '') return <span className="text-ink-900/35">-</span>;
  if (typeof value === 'boolean') return <span className={`badge ${value ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{value ? 'Yes' : 'No'}</span>;
  if (isDate(value)) return <>{new Date(value).toLocaleString()}</>;
  if (isImageUrl(value)) return <img src={value} alt="" className="max-h-40 rounded-lg border border-ink-900/10" />;
  if (Array.isArray(value)) {
    if (!value.length) return <span className="text-ink-900/35">-</span>;
    if (value.every((v) => typeof v !== 'object')) {
      return <div className="flex flex-wrap gap-1.5">{value.map((v, i) => <span key={i} className="badge bg-ink-900/5 text-ink-900/70">{String(v)}</span>)}</div>;
    }
    return <div className="space-y-2">{value.map((v, i) => <div key={i} className="rounded-lg border border-ink-900/8 p-2"><Value value={v} /></div>)}</div>;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(([k]) => !HIDDEN_KEYS.has(k));
    if (!entries.length) return <span className="text-ink-900/35">-</span>;
    return (
      <dl className="space-y-1.5">
        {entries.map(([k, v]) => (
          <div key={k} className="flex gap-2 text-sm"><dt className="shrink-0 font-medium text-ink-900/50">{labelOf(k)}:</dt><dd className="break-words"><Value value={v} /></dd></div>
        ))}
      </dl>
    );
  }
  return <span className="whitespace-pre-wrap break-words">{String(value)}</span>;
}

export function RecordDetails({ record }) {
  const entries = Object.entries(record).filter(([k]) => !HIDDEN_KEYS.has(k));
  return (
    <dl className="divide-y divide-ink-900/6">
      {entries.map(([key, value]) => (
        <div key={key} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-900/45">{labelOf(key)}</dt>
          <dd className="text-sm text-ink-900/85"><Value value={value} /></dd>
        </div>
      ))}
    </dl>
  );
}

export function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${checked ? 'bg-accent-500' : 'bg-ink-900/15'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  );
}
