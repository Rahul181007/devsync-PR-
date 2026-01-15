import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { clearAuthError, userLogin } from "../auth.slice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { setResetRole } from "../auth.slice";
import { ROUTES } from "../../../shared/constants/routes";
import { USER_ROLE_ROUTES } from "../../../shared/constants/userRoleRoutes";

const UserLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCompanyAdminLogin=location.pathname.startsWith(ROUTES.COMPANY_ADMIN.BASE)
  const { loading, error, isAuthenticated, user } =
    useAppSelector((state) => state.auth);

  const handleSubmit = (data: { email: string; password: string }) => {
    dispatch(userLogin(data));
  };

  const handleForgotPassword = () => {
     dispatch(clearAuthError());
    if (location.pathname.startsWith(ROUTES.COMPANY_ADMIN.BASE)) {
      dispatch(setResetRole("COMPANY_ADMIN"));
      navigate(ROUTES.AUTH.COMPANY_FORGOT_PASSWORD);
    }

    if (location.pathname.startsWith(ROUTES.DEVELOPER.BASE)) {
      dispatch(setResetRole("DEVELOPER"));
      navigate(ROUTES.AUTH.DEVELOPER_FORGOT_PASSWORD);
    }
  };

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
useEffect(() => {
  if (!isAuthenticated || !user) return;
  if (user.role === "SUPER_ADMIN") return;
  const role = user.role; 

  navigate(
    USER_ROLE_ROUTES[role].dashboard(user.companySlug!),
    { replace: true }
  );
}, [isAuthenticated, user, navigate]);


  return (
    <AuthLayout
      left={null}
      right={
        <LoginForm
          title="Welcome Back"
          subtitle="Login to workspace"
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          showForgotPassword
          onForgotPassword={handleForgotPassword}
          showSignup={isCompanyAdminLogin}
        />
      }
    />
  );
};

export default UserLoginPage;
