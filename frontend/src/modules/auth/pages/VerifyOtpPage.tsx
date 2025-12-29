import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { verifyForgotPasswordOtp, sendForgotPasswordOtp, resetOtpState } from "../auth.slice";

interface LocationState {
    email: string
}



const VerifyOtpPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { email } = (location.state || {}) as LocationState;

    const { loading, error, otpVerified } = useAppSelector((state) => state.auth)

    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password', { replace: true })
        }
    }, [email, navigate])

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);


    const handleResendOtp = () => {
        dispatch(resetOtpState());
        dispatch(sendForgotPasswordOtp(email));
        setTimer(30);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return;

        dispatch(verifyForgotPasswordOtp({ email, otp }))
    }

    useEffect(() => {
        if (otpVerified) {
            navigate('/reset-password', {
                state: { email, otp }
            })
        }
    }, [otpVerified, navigate, email, otp])
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            OTP
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-2 border rounded-lg tracking-widest text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="mt-4 text-center space-y-2">
                    {timer > 0 ? (
                        <p className="text-sm text-gray-500">
                            Resend OTP in <span className="font-medium">{timer}s</span>
                        </p>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Resend OTP
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="block mx-auto text-sm text-gray-600 hover:underline"
                    >
                        Change email
                    </button>
                </div>

            </div>
        </div>

    )
}

export default VerifyOtpPage
