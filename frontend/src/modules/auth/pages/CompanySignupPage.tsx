import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { clearAuthError, companySignup } from "../auth.slice";
import { ROUTES } from "../../../shared/constants/routes";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import GoogleSignupButton from "../components/GoogleSignupButton";

const CompanySignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error, otpSent } = useAppSelector(
    (state) => state.auth
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (otpSent) {
      navigate(ROUTES.AUTH.VERIFY_OTP, { replace: true });
    }
  }, [otpSent, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ⛔ prevent page reload
    setLocalError(null);

    // custom validation
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    dispatch(
      companySignup({
        name,
        email,
        password,
      })
    );
  };

  return (
    <AuthLayout
      left={null}
      right={
        <form
          className="w-full max-w-sm p-8 shadow rounded"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center mb-1">
            Create Company Account
          </h2>

          <p className="text-sm text-gray-500 text-center mb-4">
            Start setting up your workspace
          </p>

          {/* Custom error only (password mismatch / backend) */}
          {(localError || error) && (
            <p className="text-red-500 text-sm mb-3">
              {localError || error}
            </p>
          )}

          <AuthInput
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="Company admin name"
          />

          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="company@email.com"
          />

          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Minimum 8 characters"
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded mt-4 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="mb-4 flex justify-center">
            <GoogleSignupButton />
          </div>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to={ROUTES.AUTH.COMPANY_LOGIN}
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      }
    />
  );
};

export default CompanySignupPage;

