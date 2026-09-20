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
