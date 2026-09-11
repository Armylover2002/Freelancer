import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
