import { useAppDispatch,useAppSelector } from "../../../store/hook";

import { clearAuthError, superAdminLogin } from "../auth.slice";
import AuthLayout from '../components/AuthLayout';
import AuthIntroPanel from "../components/AuthIntroPanel";
import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_ROUTES } from "../../../shared/constants/roleRoutes";
const SuperAdminLoginPage=()=>{
    const dispatch=useAppDispatch();
    const navigate=useNavigate();


    const {loading,error,isAuthenticated,user}=useAppSelector((state)=>state.auth);
    useEffect(() => {
  dispatch(clearAuthError());
}, [dispatch]);

 useEffect(() => {
  if (isAuthenticated && user?.role === 'SUPER_ADMIN') {
    navigate(ROLE_ROUTES[user.role].dashboard, { replace: true });
  }
}, [isAuthenticated, user, navigate]);

      return (
    <AuthLayout
      left={<AuthIntroPanel />}
      right={
        <LoginForm
          title="Welcome Back 👋"
          subtitle="Sign in to the Super Admin Portal"
          loading={loading}
          error={error}
          onSubmit={(data) => dispatch(superAdminLogin(data))}
        />
      }
    />
  );

}

export default SuperAdminLoginPage;