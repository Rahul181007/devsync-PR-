import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { userLogin } from "../auth.slice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { setResetRole } from "../auth.slice";

const UserLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, user } =
    useAppSelector((state) => state.auth);

  const handleSubmit = (data: { email: string; password: string }) => {
    dispatch(userLogin(data));
  };

  const handleForgotPassword = () => {

    if (location.pathname.startsWith("/company")) {
      dispatch(setResetRole("COMPANY_ADMIN"));
      navigate("/company/forgot-password");
    }

    if (location.pathname.startsWith("/developer")) {
      dispatch(setResetRole("DEVELOPER"));
      navigate("/developer/forgot-password");
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role === "COMPANY_ADMIN") {
      navigate("/company/dashboard");
    } else if (user.role === "DEVELOPER") {
      navigate("/developer/dashboard");
    }
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
        />
      }
    />
  );
};

export default UserLoginPage;
