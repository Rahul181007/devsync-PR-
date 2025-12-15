import React, { useState } from "react";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

interface LoginFormProps {
  title: string;
  subtitle?: string;
  loading: boolean;
  error?: string | null;
  onSubmit: (data: { email: string; password: string }) => void;
}

const LoginForm= ({
  title,
  subtitle,
  loading,
  error,
  onSubmit,
}:LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

      <AuthButton label="Login" loading={loading} />
    </form>
  );
};

export default LoginForm;
