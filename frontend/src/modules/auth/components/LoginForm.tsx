import React, { useState } from "react";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import { loginSchema } from "../validators/login.schema";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginFormProps {
    title: string; 
    subtitle?: string;
    loading: boolean;
    error?: string | null;
    onSubmit: (data: { email: string; password: string }) => void;
    showForgotPassword?: boolean;
    onForgotPassword?: () => void;
    showSignup?: boolean;
    showGoogleLogin?: boolean;
}

const LoginForm = ({
    title,
    subtitle,
    loading,
    error,
    onSubmit,
    showForgotPassword,
    onForgotPassword,
    showSignup,
    showGoogleLogin
}: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        const result = loginSchema.safeParse({ email, password })

        if (!result.success) {
            setFormError(result.error.issues[0].message);
            return
        }
        onSubmit({ email, password });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-8 rounded-2xl bg-white shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl"
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-blue-500 to-blue-600 text-white mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12m-12 0a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v5a2 2 0 01-2 2m-12 0h12" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-gray-500">
                        {subtitle}
                    </p>
                )}
            </div>

            {(formError || error) && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 animate-shake">
                    <p className="text-red-600 text-sm text-center">
                        {formError || error}
                    </p>
                </div>
            )}

            <div className="space-y-5">
                <AuthInput
                    label="Email"
                    type="email"
                    value={email}
                    placeholder="you@company.com"
                    onChange={setEmail}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={setPassword}
                />
                
                {showForgotPassword && (
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>
                )}

                <AuthButton label="Sign In" loading={loading} />
                
                {showGoogleLogin && (
                    <>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLoginButton />
                        </div>
                    </>
                )}
                
                {showSignup && (
                    <p className="text-center text-sm text-gray-600 mt-6 pt-4 border-t border-gray-100">
                        Don't have an account?{" "}
                        <Link
                            to={ROUTES.AUTH.COMPANY_SIGNUP}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                )}
            </div>
        </form>
    );
};

export default LoginForm;
