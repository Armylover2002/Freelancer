export function StatCard({ icon: Icon, label, value, hint, accent = 'accent' }) {
  const colors = {
    accent: { tile: 'bg-accent-500/10 text-accent-600', bar: 'from-accent-500 to-fuchsia-500' },
    violet: { tile: 'bg-fuchsia-500/10 text-fuchsia-600', bar: 'from-fuchsia-500 to-pink-500' },
    emerald: { tile: 'bg-emerald-500/10 text-emerald-600', bar: 'from-emerald-500 to-teal-400' },
    amber: { tile: 'bg-amber-500/10 text-amber-600', bar: 'from-amber-500 to-orange-400' },
    red: { tile: 'bg-red-500/10 text-red-600', bar: 'from-red-500 to-rose-400' },
  };
  const c = colors[accent] || colors.accent;
  return (
    <div className="card relative overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-900/55">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">{value}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${c.tile}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {hint && <p className="mt-3 text-xs text-ink-900/45">{hint}</p>}
    </div>
  );
}
