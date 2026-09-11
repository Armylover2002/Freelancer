import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { PageSpinner } from '../components/ui/States.jsx';

export function ProtectedRoute({ children, roles }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageSpinner label="Checking your session..." />;

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(admin.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
