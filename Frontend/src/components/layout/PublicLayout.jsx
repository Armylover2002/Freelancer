import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { usePageViewTracking } from '../../hooks/useAnalytics.js';

export function PublicLayout() {
  const location = useLocation();
  usePageViewTracking();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window.scrollTo ? 'instant' : 'auto' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
