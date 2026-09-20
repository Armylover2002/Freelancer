import { Plus, Search } from 'lucide-react';

export function AdminToolbar({ title, subtitle, search, onSearchChange, onCreate, createLabel = 'Add New' }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-900/55">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {onSearchChange && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/35" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="input-field pl-10"
            />
          </div>
        )}
        {onCreate && (
          <button onClick={onCreate} className="btn-accent w-full shrink-0 sm:w-auto">
            <Plus className="h-4 w-4" /> {createLabel}
          </button>
        )}
      </div>
    </div>
  );
}
