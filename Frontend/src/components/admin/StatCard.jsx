export function StatCard({ icon: Icon, label, value, hint, accent = 'accent' }) {
  const colors = {
    accent: 'bg-accent-500/10 text-accent-600',
    violet: 'bg-fuchsia-500/10 text-fuchsia-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    amber: 'bg-amber-500/10 text-amber-600',
    red: 'bg-red-500/10 text-red-600',
  };
  return (
    <div className="card p-5 transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-900/50">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[accent]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-900/40">{hint}</p>}
    </div>
  );
}
