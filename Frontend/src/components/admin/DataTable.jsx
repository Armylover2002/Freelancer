import { useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { RecordDetails } from './RecordDetails.jsx';

export { RecordDetails };
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
      {/* Mobile: one card per row */}
      <div className="divide-y divide-ink-900/6 md:hidden">
        {rows.map((row) => (
          <div key={row[rowKey]} className="space-y-3 p-4">
            {columns.map((col, i) => (
              <div key={col.key} className={i === 0 ? '' : 'flex items-center justify-between gap-3 text-sm'}>
                {i !== 0 && <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-900/40">{col.header}</span>}
                <div className={i === 0 ? '' : 'min-w-0 text-right'}>{col.render ? col.render(row) : row[col.key]}</div>
              </div>
            ))}
            <div className="flex justify-end gap-1.5 border-t border-ink-900/6 pt-3">
              <button onClick={() => setViewRow(row)} className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900/5 px-3 py-2 text-xs font-semibold text-ink-900/70"><Eye className="h-4 w-4" /> View</button>
              {onEdit && <button onClick={() => onEdit(row)} className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500/10 px-3 py-2 text-xs font-semibold text-accent-600"><Pencil className="h-4 w-4" /> Edit</button>}
              {onDelete && <button onClick={() => onDelete(row)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"><Trash2 className="h-4 w-4" /> Delete</button>}
            </div>
          </div>
        ))}
      </div>
      {/* Desktop: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-900/8 bg-ink-900/[0.03] text-left text-xs font-semibold uppercase tracking-wide text-ink-900/45">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-5 py-3.5">{col.header}</th>
              ))}
              {showActions && <th className="px-5 py-3.5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/6">
            {rows.map((row) => (
              <tr key={row[rowKey]} className="transition hover:bg-accent-500/[0.04]">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 align-middle text-ink-900/80">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="px-5 py-3.5 text-right">
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
      <div className="border-t border-ink-900/8 bg-ink-900/[0.02] px-5 py-2.5 text-xs text-ink-900/45">
        {rows.length} {rows.length === 1 ? 'record' : 'records'}{meta?.total ? ` of ${meta.total}` : ''}
      </div>
      <Modal open={Boolean(viewRow)} onClose={() => setViewRow(null)} title={viewTitle} maxWidth="max-w-2xl">
        {viewRow && <RecordDetails record={viewRow} />}
      </Modal>
    </div>
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
