import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { clearAuthError, sendForgotPasswordOtp } from "../auth.slice";
import { ROUTES } from "../../../shared/constants/routes";

const ForgotPasswordPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading, error, otpSent, resetRole } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState("");

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);




    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        dispatch(sendForgotPasswordOtp(email));
    };
    const handleBackToLogin = () => {
        if (resetRole === "COMPANY_ADMIN") {
            navigate(ROUTES.AUTH.COMPANY_LOGIN, { replace: true });
            return;
        }

        if (resetRole === "DEVELOPER") {
            navigate(ROUTES.AUTH.DEVELOPER_LOGIN, { replace: true });
            return;
        }


        navigate(ROUTES.ROOT, { replace: true });
    };


    useEffect(() => {
        if (otpSent) {
            navigate(ROUTES.AUTH.VERIFY_OTP, {
                state: { email },
                replace: true
            });
        }
    }, [otpSent, navigate, email]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 text-center">
                    Forgot Password
                </h2>
                <p className="text-gray-600 text-sm text-center mt-2">
                    Enter your email to receive an OTP
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={handleBackToLogin }
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;