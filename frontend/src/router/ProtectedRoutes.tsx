import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";

interface ProtectedRouteProps {
  allowedRoles: ("SUPER_ADMIN" | "COMPANY_ADMIN" | "DEVELOPER")[];
  loginPath: string;
}

const ProtectedRoute = ({
  allowedRoles,
  loginPath
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isAuthChecked } = useAppSelector(
    (state) => state.auth
  );


  if (!isAuthChecked) {
    return <div>Loading...</div>; // spinner / skeleton
  }


  if (!isAuthenticated || !user) {
    return <Navigate to={loginPath} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={loginPath} replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;
