import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hook";

const OnboardingRoute = () => {
  const location = useLocation();

  const {
    isAuthenticated,
    requiresOnboarding,
    onboardingStep,
    isAuthChecked
  } = useAppSelector((state) => state.auth);

  if (!isAuthChecked) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/company/login" replace />;
  }

  if (!requiresOnboarding) {
    return <Navigate to="/company/dashboard" replace />;
  }

  const stepToPathMap: Record<string, string> = {
    WORKSPACE: "/company/onboarding/workspace",
    BRANDING: "/company/onboarding/branding",
    PROJECT: "/company/onboarding/project"
  };

  const expectedPath = onboardingStep
    ? stepToPathMap[onboardingStep]
    : null;


    

if (onboardingStep && expectedPath && location.pathname !== expectedPath) {
  return <Navigate to={expectedPath} replace />;
}

  return <Outlet />;
};

export default OnboardingRoute;
