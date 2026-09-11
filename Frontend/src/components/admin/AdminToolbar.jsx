import { Plus, Search } from 'lucide-react';

export function AdminToolbar({ title, subtitle, search, onSearchChange, onCreate, createLabel = 'Add New' }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-900/50">{subtitle}</p>}
      </div>
      <div className="flex gap-3">
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/35" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="input-field w-48 pl-9 sm:w-64"
            />
          </div>
        )}
        {onCreate && (
          <button onClick={onCreate} className="btn-accent shrink-0">
            <Plus className="h-4 w-4" /> {createLabel}
          </button>
        )}
      </div>
    </div>
  );
}
