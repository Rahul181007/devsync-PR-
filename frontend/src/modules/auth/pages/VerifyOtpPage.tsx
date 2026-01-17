import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  verifyForgotPasswordOtp,
  verifySignupOtp,
  sendForgotPasswordOtp,
  resetOtpState,
  clearAuthError,
} from "../auth.slice";
import { ROUTES } from "../../../shared/constants/routes";

interface LocationState {
  email?: string;
}

const VerifyOtpPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = (location.state || {}) as LocationState;

  const {
    loading,
    error,
    otpVerified,
    resetRole,
    user,
    otpSent,
  } = useAppSelector((state) => state.auth);

  // ✅ Email source:
  // - Forgot password → location.state.email
  // - Signup → auth.user.email
  const email = resetRole
    ? locationState.email
    : user?.email;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);


  useEffect(() => {
    if (!email || (!otpSent && !resetRole)) {
      navigate(ROUTES.ROOT, { replace: true });
    }
  }, [email, otpSent, resetRole, navigate]);


  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  
  const handleResendOtp = () => {
    if (!resetRole || !email) return;
    dispatch(resetOtpState());
    dispatch(sendForgotPasswordOtp(email));
    setTimer(30);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !email) return;

    if (resetRole) {
      // 🔐 Forgot password
      dispatch(verifyForgotPasswordOtp({ email, otp }));
    } else {
      // 🆕 Signup
      dispatch(verifySignupOtp({ email, otp }));
    }
  };

  // ✅ Success redirect
  useEffect(() => {
    if (!otpVerified) return;

    dispatch(resetOtpState());

    if (resetRole) {
      // Forgot password → Reset password page
      navigate(ROUTES.AUTH.RESET_PASSWORD, {
        state: { email, otp },
        replace: true,
      });
    } else {
      // Signup → Company login
      navigate(ROUTES.AUTH.COMPANY_LOGIN, { replace: true });
    }
  }, [otpVerified, resetRole, navigate, dispatch, email, otp]);

  const handleChangeEmail = () => {
    if (!resetRole) {
      navigate(ROUTES.AUTH.COMPANY_SIGNUP, { replace: true });
      return;
    }

    navigate(
      resetRole === "COMPANY_ADMIN"
        ? ROUTES.AUTH.COMPANY_FORGOT_PASSWORD
        : ROUTES.AUTH.DEVELOPER_FORGOT_PASSWORD,
      { replace: true }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Verify OTP
        </h2>

        <p className="text-gray-600 text-sm text-center mt-2">
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-2 border rounded-lg tracking-widest text-center"
            required
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {resetRole && (
            timer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in <b>{timer}s</b>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-sm text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            )
          )}

          <button
            onClick={handleChangeEmail}
            className="block mx-auto text-sm text-gray-600 hover:underline"
          >
            Change email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

