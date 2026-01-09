import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { clearAuthError, companySignup } from "../auth.slice";
import { ROUTES } from "../../../shared/constants/routes";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";



const CompanySignupPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    const { loading, error } = useAppSelector((state) => state.auth)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(clearAuthError())
    }, [dispatch])

    const handleSubmit = async (data: { name: string; email: string; password: string }) => {
        setLocalError(null);
        if (password !== confirmPassword) {
            setLocalError('Password do not match');
            return
        }

        const res = await dispatch(
            companySignup(data)
        )

        if (companySignup.fulfilled.match(res)) {
            navigate(ROUTES.AUTH.COMPANY_LOGIN, { replace: true })
        }
    }


    return (
        <AuthLayout
            left={null}
            right={
                <form className="w-full max-w-sm p-8 shadow rounded">
                    <h2 className="text-2xl font-semibold text-center mb-1">
                        Create Company Account
                    </h2>
                    <p className="text-sm text-gray-500 text-center mb-4">
                        Start setting up your workspace
                    </p>

                    {(localError || error) && (
                        <p className="text-red-500 text-sm mb-3">
                            {localError || error}
                        </p>
                    )}

                    <AuthInput
                        label="Full Name"
                        value={name}
                        onChange={setName}
                    />

                    <AuthInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}

                    />

                    <AuthInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}

                    />

                    <AuthInput
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />

                    <button
                        type="button"
                        onClick={() => handleSubmit({ name, email, password })}
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded mt-4"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
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

    )
}

export default CompanySignupPage
