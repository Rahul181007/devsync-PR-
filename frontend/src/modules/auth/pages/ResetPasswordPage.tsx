import { useEffect,useState } from "react";
import { useAppDispatch,useAppSelector } from "../../../store/hook";
import { useLocation,useNavigate } from "react-router-dom";
import { clearAuthError, resetPassword } from "../auth.slice";
import {ROUTES} from '../../../shared/constants/routes'

interface LocationState {
  email: string;
  otp: string;
}

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { email, otp } = (location.state || {}) as LocationState;

  const { loading, error, passwordResetSuccess,resetRole } = useAppSelector(
    (state) => state.auth
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

 useEffect(() => {
  dispatch(clearAuthError());
}, [dispatch]);

  useEffect(() => {
    if (!email || !otp || !resetRole) {
      navigate(ROUTES.ROOT, { replace: true });
    }
  }, [email, otp, navigate,resetRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setLocalError(null);

    dispatch(
      resetPassword({
        email,
        otp,
        newPassword: password,
      })
    );
  };


  useEffect(() => {
  if (!passwordResetSuccess || !resetRole) return;

  if (resetRole === "COMPANY_ADMIN") {
    navigate(ROUTES.AUTH.COMPANY_LOGIN, { replace: true });
  } else {
    navigate(ROUTES.AUTH.DEVELOPER_LOGIN, { replace: true });
  }
  }, [passwordResetSuccess, navigate,resetRole]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm text-center mt-2">
          Set a new password for <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {setPassword(e.target.value); setLocalError(null);}}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {setConfirmPassword(e.target.value);setLocalError(null);}}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {(localError || error) && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;