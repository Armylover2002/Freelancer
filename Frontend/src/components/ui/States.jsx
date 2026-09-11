import { AlertTriangle, Inbox, Loader2, SearchX } from 'lucide-react';

export function Spinner({ className = 'h-6 w-6' }) {
  return <Loader2 className={`animate-spin text-accent-500 ${className}`} />;
}

export function PageSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-900/50">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-900/15 bg-white/50 px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-ink-900/25" />
      <p className="text-base font-semibold text-ink-900/70">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-900/45">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-red-400" />
      <p className="text-base font-semibold text-red-700">{title}</p>
      {description && <p className="max-w-sm text-sm text-red-600/80">{description}</p>}
      {action}
    </div>
  );
}

export function NoResultsState({ description = 'Try adjusting your filters or search terms.' }) {
  return <EmptyState icon={SearchX} title="No results found" description={description} />;
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-ink-900/8 ${className}`} />;
}
