import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";

interface AppRouteProps {
  allowedRoles: ("SUPER_ADMIN" | "COMPANY_ADMIN" | "DEVELOPER")[];
  loginPath: string;
}

const AppRoute = ({
  allowedRoles,
  loginPath
}: AppRouteProps) => {
  const { isAuthenticated,
     user, 
     isAuthChecked,
     requiresOnboarding,
     waitingForApproval 

  } = useAppSelector(
    (state) => state.auth
  );


  if (!isAuthChecked) {
    return <div>Loading...</div>; // spinner / skeleton
  }
  if (!isAuthenticated || !user) {
    return <Navigate to={loginPath} replace />;
  }
  if(requiresOnboarding){
    return <Navigate to='/company/onboarding/workspace' replace/>;
  }

  if(waitingForApproval){
    return <Navigate to='/company/pending-approval' replace />
  }

  

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={loginPath} replace />;
  }


  return <Outlet />;
};

export default AppRoute;
