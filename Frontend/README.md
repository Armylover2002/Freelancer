# Frontend — Agency Website & Admin Panel

React 19 + Vite SPA: the public marketing site (Home, About, Services, Portfolio,
Pricing, Start Your Project, Contact, FAQ, Privacy, Terms) plus a code-split admin
panel (dashboard, enquiries/leads, projects, services, pricing, team, testimonials,
FAQs, media, settings, admin users, audit logs).

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev             # http://localhost:5173
```

Requires the backend running (see `../Backend/README.md`) at the URL configured in
`VITE_API_BASE_URL`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |
| `VITE_APP_ENV` | `development` / `production` (informational) |

`.env` is git-ignored; only `.env.example` (no real values) is committed.

## Stack

- **Routing**: React Router, with public routes under a shared `Header`/`Footer`
  layout and admin routes behind `ProtectedRoute` (redirects to `/admin/login`).
- **Data fetching**: TanStack Query for caching, pagination and mutation state
  (loading/error/empty states are handled consistently via `useAdminCrud`).
- **Forms**: React Hook Form + Zod (`@hookform/resolvers/zod`) — the "Start Your
  Project" multi-step form validates per-step and persists a draft to
  `localStorage` so a refresh doesn't lose progress.
- **Styling**: Tailwind CSS (custom design tokens in `tailwind.config.js`) +
  Framer Motion for scroll reveals, page/step transitions and micro-interactions
  (`prefers-reduced-motion` is respected globally).
- **Auth**: `AuthContext` calls `GET /api/admin/auth/me` on load to restore the
  session from the httpOnly cookie; `ProtectedRoute` gates admin pages (and
  optionally specific roles, e.g. Admin Users is owner-only).

## Folder Structure

```
src/
  api/            axios clients + typed API functions (public, admin, auth)
  components/
    layout/       Header, Footer, PublicLayout, AdminLayout
    ui/           Button, Field, Modal, States, Pagination, StatusBadge, SocialIcons...
    sections/     ProjectCard, ServiceCard, TeamCard, TestimonialCard, PricingCard
    admin/        AdminToolbar, DataTable, ImageUploader, TagInput, StatCard
  context/        AuthContext
  hooks/          useAuth, useAdminCrud, usePublicData, useSiteSettings, useAnalytics, useDebouncedValue
  pages/
    public/       Home, About, Services, Portfolio, ProjectDetail, Pricing,
                   StartProject, Contact, Faq, Privacy, Terms, NotFound
    admin/        Login, Dashboard, Enquiries, EnquiryDetail, Clients, Projects,
                   Services, Pricing, Team, Testimonials, Faqs, Media, Settings,
                   AdminUsers, AuditLogs
  routes/         ProtectedRoute
  utils/          enquirySchema/enquiryOptions (Start Project form), iconMap, enquiryStatus
```

Admin pages are lazy-loaded (`React.lazy`) so the public site's bundle stays small;
the admin chunk (including Recharts for the dashboard) only loads when someone
visits `/admin/*`.

## Build & Preview

```bash
npm run build     # production build to dist/
npm run preview    # serve the production build locally
```

## Notes

- All public-facing dynamic content (services, pricing, team, testimonials, FAQs,
  projects, site settings) comes from the backend API — nothing is hard-coded.
- First-party analytics events (`page_view`, `project_cta_click`, `enquiry_start`,
  `enquiry_submit`, `contact_click`) are fired via `hooks/useAnalytics.js` and
  stored by the backend for the admin dashboard's funnel metrics.
