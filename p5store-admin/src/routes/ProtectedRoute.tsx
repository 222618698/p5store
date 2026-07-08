import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 px-6 text-center">
        <div>
          <h1 className="font-display text-2xl text-navy-800">Access restricted</h1>
          <p className="mt-2 text-navy-700">
            This console is for Pillar 5 Group admins only. Your account doesn't
            have admin access.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
