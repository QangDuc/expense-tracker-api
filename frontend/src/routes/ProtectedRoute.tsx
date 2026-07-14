import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute — checks for a stored access token.
 * If present, renders the child route via <Outlet />.
 * If absent, redirects to /login.
 *
 * Note: token presence is a lightweight guard; the API itself
 * enforces authorization via JWT validation on every request.
 */
export default function ProtectedRoute() {
  const token = localStorage.getItem('accessToken');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
