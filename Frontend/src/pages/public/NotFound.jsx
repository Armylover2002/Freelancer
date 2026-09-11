import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

export default function NotFound() {
  useDocumentHead({ title: 'Page Not Found', noIndex: true });

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface-muted px-4">
      <AnimatedReveal className="text-center">
        <p className="text-7xl font-black text-ink-900/10">404</p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-900/50">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <Link to="/portfolio" className="btn-outline">
            <ArrowLeft className="h-4 w-4" /> View Portfolio
          </Link>
        </div>
      </AnimatedReveal>
    </div>
  );
}
