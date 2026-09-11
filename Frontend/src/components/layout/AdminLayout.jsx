import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Layers,
  Tag,
  Users,
  Star,
  HelpCircle,
  Image,
  Settings,
  ShieldCheck,
  ScrollText,
  LogOut,
  Menu,
  UserCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import toast from 'react-hot-toast';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Sales',
    items: [
      { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
      { to: '/admin/clients', label: 'Clients', icon: UserCircle2 },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/projects', label: 'Projects', icon: Briefcase },
      { to: '/admin/services', label: 'Services', icon: Layers },
      { to: '/admin/pricing', label: 'Pricing', icon: Tag },
      { to: '/admin/team', label: 'Team', icon: Users },
      { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
      { to: '/admin/media', label: 'Media', icon: Image },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/admin/users', label: 'Admin Users', icon: ShieldCheck, ownerOnly: true },
      { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
    ],
  },
];

function SidebarContent({ admin, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aurora-gradient text-sm font-black text-white shadow-glow">
          A
        </span>
        <div>
          <p className="text-base font-extrabold leading-tight text-white">Agency Admin</p>
          <p className="text-xs text-white/40">Content & lead management</p>
        </div>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items
                .filter((item) => !item.ownerOnly || admin?.role === 'owner')
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                          : 'text-white/55 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-aurora-gradient" />
                        )}
                        <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-accent-300' : ''}`} />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function AdminLayout() {
  useDocumentHead({ title: 'Admin Panel', noIndex: true });
  const { admin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="hidden w-64 shrink-0 bg-gradient-to-b from-ink-950 to-ink-900 lg:block">
        <SidebarContent admin={admin} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-ink-950 to-ink-900">
            <SidebarContent admin={admin} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="relative flex h-16 items-center justify-between border-b border-ink-900/8 bg-white px-4 sm:px-6">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-aurora-gradient" />
          <button className="rounded-lg p-2 text-ink-900 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-ink-900">{admin?.name}</p>
              <p className="text-xs capitalize text-ink-900/45">{admin?.role}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-aurora-gradient text-sm font-bold text-white">
              {admin?.name?.charAt(0) || 'A'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-ink-900/10 px-3 py-2 text-sm font-medium text-ink-900/70 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
