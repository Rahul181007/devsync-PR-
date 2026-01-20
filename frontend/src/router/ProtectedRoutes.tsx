import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";
import LoadingSpinner from "../shared/components/LoadingSpinner";


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
     waitingForApproval,
     rejectedCompany,
     suspendedCompany,
     onboardingStep

  } = useAppSelector(
    (state) => state.auth
  );

if (!isAuthChecked) {
  return <LoadingSpinner />; 
}
  if (!isAuthenticated || !user) {
    return <Navigate to={loginPath} replace />;
  }
if (requiresOnboarding) {

  
  if (!onboardingStep) {
     return <LoadingSpinner />;
  }

  switch (onboardingStep) {
    case 'WORKSPACE':
      return <Navigate to="/company/onboarding/workspace" replace />;

    case 'BRANDING':
      return <Navigate to="/company/onboarding/branding" replace />;

    case 'PROJECT':
      return <Navigate to="/company/onboarding/project" replace />;

    default:
      return <div>Invalid onboarding state</div>;
  }
}


  if(waitingForApproval && onboardingStep==='DONE'){
    return <Navigate to='/company/pending-approval' replace />
  }

  if(rejectedCompany){
     return <Navigate to="/company/rejected" replace />;
  }
  if (suspendedCompany) {
    return <Navigate to="/company/suspended" replace />;
  }
  

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={loginPath} replace />;
  }


  return <Outlet />;
};

export default AppRoute;
