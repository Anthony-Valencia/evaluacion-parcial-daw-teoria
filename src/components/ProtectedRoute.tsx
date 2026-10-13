import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({ soloAdmin = false }: { soloAdmin?: boolean }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (soloAdmin && !isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
