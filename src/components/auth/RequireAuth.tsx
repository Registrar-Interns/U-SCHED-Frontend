import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to signin if no token is found
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}