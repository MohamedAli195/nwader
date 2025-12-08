import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface ProtectedRouteProps {
  children: ReactNode;
  redirect?: string; // optional with default
}

function ProtectedRoute({
  children,
  redirect = "/signin",
}: ProtectedRouteProps) {
  const token = useSelector((state: RootState) => state.auth.access_token);

  // const token = Boolean(Cookies.get(' useToken'));
  if (!token) return <Navigate to={redirect} />;
  return <>{children}</>;
}

export default ProtectedRoute;
