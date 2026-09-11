import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout.jsx';
import { AdminLayout } from './components/layout/AdminLayout.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { PageSpinner } from './components/ui/States.jsx';

// Public pages
import Home from './pages/public/Home.jsx';
const About = lazy(() => import('./pages/public/About.jsx'));
const Services = lazy(() => import('./pages/public/Services.jsx'));
const Portfolio = lazy(() => import('./pages/public/Portfolio.jsx'));
const ProjectDetail = lazy(() => import('./pages/public/ProjectDetail.jsx'));
const Pricing = lazy(() => import('./pages/public/Pricing.jsx'));
const StartProject = lazy(() => import('./pages/public/StartProject.jsx'));
const TrackEnquiry = lazy(() => import('./pages/public/TrackEnquiry.jsx'));
const Contact = lazy(() => import('./pages/public/Contact.jsx'));
const Faq = lazy(() => import('./pages/public/Faq.jsx'));
const Privacy = lazy(() => import('./pages/public/Privacy.jsx'));
const Terms = lazy(() => import('./pages/public/Terms.jsx'));
const NotFound = lazy(() => import('./pages/public/NotFound.jsx'));

// Admin pages (code-split into a separate chunk group)
const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Enquiries = lazy(() => import('./pages/admin/Enquiries.jsx'));
const EnquiryDetail = lazy(() => import('./pages/admin/EnquiryDetail.jsx'));
const Clients = lazy(() => import('./pages/admin/Clients.jsx'));
const Projects = lazy(() => import('./pages/admin/Projects.jsx'));
const Services_Admin = lazy(() => import('./pages/admin/Services.jsx'));
const PricingAdmin = lazy(() => import('./pages/admin/Pricing.jsx'));
const Team = lazy(() => import('./pages/admin/Team.jsx'));
const Testimonials = lazy(() => import('./pages/admin/Testimonials.jsx'));
const Faqs = lazy(() => import('./pages/admin/Faqs.jsx'));
const Media = lazy(() => import('./pages/admin/Media.jsx'));
const Settings = lazy(() => import('./pages/admin/Settings.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs.jsx'));

function Fallback() {
  return <PageSpinner />;
}

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectDetail />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="start-project" element={<StartProject />} />
          <Route path="track-request" element={<TrackEnquiry />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<Faq />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="enquiries/:id" element={<EnquiryDetail />} />
          <Route path="clients" element={<Clients />} />
          <Route path="projects" element={<Projects />} />
          <Route path="services" element={<Services_Admin />} />
          <Route path="pricing" element={<PricingAdmin />} />
          <Route path="team" element={<Team />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="media" element={<Media />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="users"
            element={
              <ProtectedRoute roles={['owner']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
