import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (allowedRoles && user?.role) {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    if (!userRoles.some((r) => allowedRoles.includes(r))) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
