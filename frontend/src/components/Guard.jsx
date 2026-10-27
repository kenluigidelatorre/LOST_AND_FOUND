import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth.jsx";

// Hides pages from the wrong role. Real security is enforced by the API (requireRole).
export default function Guard({ role }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user)
    return (
      <Navigate
        to="/login"
        state={{ from: loc.pathname + loc.search }}
        replace
      />
    );
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
