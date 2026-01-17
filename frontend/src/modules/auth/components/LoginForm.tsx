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
            className="w-full max-w-sm p-8 shadow rounded"
        >
            <h2 className="text-2xl font-semibold text-center mb-1">
                {title}
            </h2>
            {subtitle && (
                <p className="text-sm text-gray-500 text-center mb-4">
                    {subtitle}
                </p>
            )}

            {formError && (
                <p className="text-red-500 text-sm mb-3 text-center">{formError}</p>
            )}

            {error && (
                <p className="text-red-500 text-sm mb-3 text-center">
                    {error}
                </p>
            )}

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
                <div className="text-right mb-4">
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>
            )}


            <AuthButton label="Login" loading={loading} />
            {showGoogleLogin && (
  <>
    <div className="flex items-center gap-2 my-4">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="text-xs text-gray-400">OR</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>

    <div className="flex justify-center">
      <GoogleLoginButton />
    </div>
  </>
)}
            {showSignup && (
                <p className="text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <Link
                        to={ROUTES.AUTH.COMPANY_SIGNUP}
                        className="text-blue-600 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            )}

        </form>
    );
};

export default LoginForm;
