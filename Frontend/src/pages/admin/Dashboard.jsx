import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Users, Inbox, TrendingUp, MousePointerClick, AlertCircle, Briefcase } from 'lucide-react';
import { dashboardApi } from '../../api/adminApi.js';
import { StatCard } from '../../components/admin/StatCard.jsx';
import { PageSpinner, ErrorState, EmptyState } from '../../components/ui/States.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { STATUS_LABELS } from '../../utils/enquiryStatus.js';
import { format } from 'date-fns';

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: dashboardApi.get,
    refetchInterval: 60_000,
  });

  if (isLoading) return <PageSpinner label="Loading dashboard..." />;
  if (isError) return <ErrorState title="Couldn't load dashboard" />;

  const { kpis, statusBreakdown, enquiryTrend, topProjectsByClicks, recentEnquiries } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-900/50">Overview of leads, traffic and content performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Total Enquiries" value={kpis.totalEnquiries} hint={`${kpis.enquiries30d} in last 30 days`} />
        <StatCard icon={TrendingUp} label="Conversion Rate" value={`${kpis.conversionRate}%`} hint="Submits / page views (30d)" accent="emerald" />
        <StatCard icon={MousePointerClick} label="CTA Clicks (30d)" value={kpis.ctaClicks30d} accent="amber" />
        <StatCard icon={AlertCircle} label="Overdue Follow-ups" value={kpis.overdueFollowUps} accent="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-bold text-ink-900">Enquiry Trend (30 days)</h2>
          <div className="mt-4 h-64">
            {enquiryTrend?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enquiryTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5b8cff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#5b8cff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0b122010" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => format(new Date(d), 'MMM d')} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip labelFormatter={(d) => format(new Date(d), 'PP')} />
                  <Area type="monotone" dataKey="count" stroke="#5b8cff" fill="url(#colorCount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No enquiry data yet" description="Enquiries submitted from the website will appear here." />
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-ink-900">Pipeline Breakdown</h2>
          <div className="mt-4 space-y-3">
            {Object.keys(STATUS_LABELS).map((status) => {
              const count = statusBreakdown[status] || 0;
              const max = Math.max(...Object.values(statusBreakdown), 1);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs">
                    <StatusBadge status={status} />
                    <span className="font-semibold text-ink-900/60">{count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-ink-900/8">
                    <div className="h-full rounded-full bg-accent-500" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink-900">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-sm font-medium text-accent-600">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-ink-900/6">
            {!recentEnquiries?.length ? (
              <EmptyState title="No enquiries yet" />
            ) : (
              recentEnquiries.map((e) => (
                <Link key={e._id} to={`/admin/enquiries/${e._id}`} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{e.contact?.name}</p>
                    <p className="text-xs text-ink-900/45">{e.projectType} · {format(new Date(e.createdAt), 'PP')}</p>
                  </div>
                  <StatusBadge status={e.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink-900">Top Projects by Clicks</h2>
            <Briefcase className="h-4 w-4 text-ink-900/30" />
          </div>
          <div className="mt-4 space-y-3">
            {!topProjectsByClicks?.length ? (
              <EmptyState title="No click data yet" />
            ) : (
              topProjectsByClicks.map((p) => (
                <div key={p.path} className="flex items-center justify-between text-sm">
                  <span className="truncate text-ink-900/70">{p.path}</span>
                  <span className="flex items-center gap-1 font-semibold text-ink-900">
                    <Users className="h-3.5 w-3.5 text-ink-900/30" /> {p.clicks}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
