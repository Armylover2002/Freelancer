# Backend — Agency Platform API

Node.js + Express + MongoDB (Mongoose) REST API powering both the public website
and the admin CMS. JWT-based admin auth (httpOnly cookie), Zod validation on every
mutating route, Cloudinary media storage, rate limiting, Helmet, CORS allowlist,
audit logging.

## Setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm run seed            # creates the owner admin account + starter content
npm run dev             # nodemon, http://localhost:5000
```

### Environment Variables

See `.env.example` for the full list. Key ones:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `CLIENT_URL` | Comma-separated list of allowed frontend origins (CORS) |
| `JWT_SECRET` | Secret used to sign admin session tokens — use a long random value |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used **only** by `npm run seed` to create the first owner account |
| `CLOUDINARY_*` | Media storage credentials |
| `EMAIL_*` | Optional — enquiry notification emails are skipped gracefully if unset |

### Database Setup

No manual schema setup needed — Mongoose creates collections and indexes on first
write. Run `npm run seed` once to create:
- one `owner` admin account (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- default site settings
- 4 starter services + 4 starter pricing plans (your own offerings — edit freely)
- a handful of generic process/pricing/support FAQs

It deliberately does **not** seed projects, team members or testimonials with
placeholder data — add genuine ones through the admin panel.

### Admin Authentication (Clerk substitute)

The spec recommends Clerk; since no Clerk keys were supplied this build uses a
self-contained JWT + bcrypt system instead:
- `POST /api/admin/auth/login` verifies email/password, signs a JWT, sets it as an
  httpOnly cookie (`agency_admin_token`) and also returns the token in the response
  body (useful for non-browser tooling / Postman).
- Every `/api/admin/*` route runs through `requireAdmin` (verifies the token,
  loads the admin from MongoDB, checks `active`) and, where relevant, `requireRole`
  (`owner` / `admin` / `staff`).
- Roles are **never** trusted from the client — always re-derived from the DB record.

To migrate to Clerk later: replace `middleware/auth.js`'s token verification with
Clerk's server-side session verification, map the Clerk user ID to an `AdminUser`
document, and swap the frontend `Login` page for Clerk's hosted/embedded UI.

## API Documentation

See `openapi.yaml` in this folder (OpenAPI 3.0) — open it in Swagger Editor / any
OpenAPI viewer, or import into Postman.

## Testing

```bash
npm test
```

Uses Jest + Supertest against an isolated `<db>_test` MongoDB database (derived
from `MONGODB_URI`), dropped automatically when the suite finishes. Covers:
- health check
- enquiry validation + creation (`tests/enquiry.test.js`)
- admin login / session / logout / route protection (`tests/auth.test.js`)
- admin project CRUD + public visibility rules (`tests/projects.test.js`)

## Folder Structure

```
src/
  config/       env, MongoDB connection, Cloudinary client
  middleware/   auth, validation, rate limiting, uploads, error handling
  models/       Mongoose schemas (one per collection)
  validators/   Zod schemas per module
  controllers/
    public/     projects, content (services/pricing/team/testimonials/faqs/settings), enquiries, analytics
    admin/      auth, dashboard, enquiries, clients, projects, services, pricing,
                team, testimonials, faqs, media, settings, admin users, audit logs
  routes/       public.routes.js, auth.routes.js, admin.routes.js
  utils/        ApiError/ApiResponse, asyncHandler, crudFactory, audit, slug, pagination, email, tokens
  seed/         seed.js
  app.js        Express app wiring (security middleware, routes, error handler)
  server.js     entrypoint (connects DB, starts HTTP server)
```

## Build Order Implemented

Foundation → public content API → enquiry pipeline → admin auth → admin CMS
(projects/services/pricing/team/testimonials/faqs/media/settings/users/audit) →
first-party analytics → security hardening → automated tests.

## Troubleshooting

- **Port already in use**: if `PORT=5000` conflicts with something else already
  running on your machine, set a different `PORT` in `.env` (and update the
  frontend's `VITE_API_BASE_URL` to match).
- **CORS errors in the browser**: make sure `CLIENT_URL` in `.env` exactly matches
  the frontend's origin (protocol + host + port), comma-separated if you need more
  than one.
- **Cloudinary upload fails**: verify `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`
  are set — uploads are disabled (with a clear 500 error) if they're missing.
- **Login fails after seeding**: confirm `ADMIN_EMAIL`/`ADMIN_PASSWORD` were set in
  `.env` *before* running `npm run seed` — the script only creates the account if
  those variables are present.
