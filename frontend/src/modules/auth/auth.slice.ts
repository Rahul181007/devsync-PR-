import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, type MeResponse } from "./services/auth.api";
import { getErrorMessage } from "../../shared/utiils/getErrorMessage";
import type { LoginResponse } from "./types/auth-response.type";


export type AuthRole = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | "DEVELOPER";
export type OnboardingStep = 'WORKSPACE' | 'BRANDING' | 'PROJECT' | 'DONE';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: AuthRole;
    companyId?: string;
    companySlug?: string | null
}

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isAuthChecked: boolean;

    requiresOnboarding: boolean;
    waitingForApproval: boolean;
    onboardingStep: OnboardingStep | null;

    otpSent: boolean;
    otpVerified: boolean;
    passwordResetSuccess: boolean;
    resetRole: "COMPANY_ADMIN" | "DEVELOPER" | null;

}

// intial state

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    isAuthChecked: false,
    requiresOnboarding: false,
    waitingForApproval: false,
    onboardingStep: null,
    otpSent: false,
    otpVerified: false,
    passwordResetSuccess: false,
    resetRole: null,
}

// async thunks

export const superAdminLogin = createAsyncThunk(
    'auth/superAdminLogin',
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await authApi.superAdminLogin(data);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))

        }
    }
)

// company admin & developer Login

export const userLogin = createAsyncThunk<LoginResponse, { email: string; password: string }, { rejectValue: string }>(
    'auth/userLogin',
    async (
        data: { email: string; password: string }, { rejectWithValue }
    ) => {
        try {
            const res = await authApi.userLogin(data);
            return res.data.data;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const companySignup = createAsyncThunk<void, { name: string, email: string, password: string }, { rejectValue: string }>(
    "auth/companySignup",
    async (data, { rejectWithValue }) => {
        try {
            await authApi.signup(data)
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const sendForgotPasswordOtp = createAsyncThunk(
    'auth/sendForgotPasswordOtp',
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await authApi.forgotPassword(email);
            return res.data.message;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const verifyForgotPasswordOtp = createAsyncThunk(
    "auth/verifyForgotPasswordOtp",
    async (
        data: { email: string; otp: string }, { rejectWithValue }
    ) => {
        try {
            const res = await authApi.verifyOtp(data);
            return res.data.message
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (
        data: { email: string; otp: string; newPassword: string }, { rejectWithValue }
    ) => {
        try {
            const res = await authApi.resetPassword(data);
            return res.data.message
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        await authApi.logout();
    }
);

export const bootstrapAuth = createAsyncThunk<MeResponse, void, { rejectValue: string }>(
    "auth/bootstrap",
    async (_, { rejectWithValue }) => {
        try {

            await authApi.refresh();
            const res = await authApi.getMe();

            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)
// slice

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isAuthChecked = true;
        },
        clearAuth(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.isAuthChecked = true;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },

        setResetRole(state, action) {
            state.resetRole = action.payload;
        },

        clearResetFlow(state) {
            state.resetRole = null;
            state.otpSent = false;
            state.otpVerified = false;
            state.passwordResetSuccess = false;
        },
        resetOtpState(state) {
            state.otpSent = false;
            state.otpVerified = false;
            state.error = null;
        },
        clearAuthError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            //superAdmin 
            .addCase(superAdminLogin.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(superAdminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true
                state.isAuthChecked = true;
            })
            .addCase(superAdminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            // user (company/developer)
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;


            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthChecked = true;

                state.requiresOnboarding = false;
                state.waitingForApproval = false;
                state.onboardingStep = null;
                const payload = action.payload;

                const user = {
                    id: payload.id,
                    name: payload.name ?? '',
                    email: payload.email,
                    role: payload.role,
                    companyId: payload.companyId,
                    companySlug: payload.companySlug ?? null
                }

                if (payload.requiresOnboarding) {
                    state.user = user;
                    state.isAuthenticated = true;
                    state.requiresOnboarding = true;
                    state.waitingForApproval = false;

                    state.onboardingStep = payload.onboardingStep ?? null;
                    return
                }

                if (payload.waitingForApproval) {
                    state.user = user;
                    state.isAuthenticated = true;
                    state.requiresOnboarding = false;
                    state.waitingForApproval = true;

                    state.onboardingStep = payload.onboardingStep ?? null;
                    return
                }




                state.user = user;
                state.isAuthenticated = true;
                state.requiresOnboarding = false;
                state.waitingForApproval = false;
                state.onboardingStep = null;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false
                state.error = action.payload as string
            })

            .addCase(logout.fulfilled, () => {
                return initialState
            })

            // forgot password
            .addCase(sendForgotPasswordOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false
            })
            .addCase(sendForgotPasswordOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true
            })
            .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            //verify otp
            .addCase(verifyForgotPasswordOtp.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(verifyForgotPasswordOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpVerified = true;
            })
            .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Reset password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = false;
                state.otpVerified = false
                state.passwordResetSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(companySignup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(companySignup.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(companySignup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(bootstrapAuth.pending, (state) => {
                state.loading = true;
            })

            .addCase(bootstrapAuth.fulfilled, (state, action) => {
                const { user, requiresOnboarding, waitingForApproval, onboardingStep } = action.payload;

                state.user = user;
                state.requiresOnboarding = requiresOnboarding;
                state.waitingForApproval = waitingForApproval;
                state.onboardingStep = onboardingStep ?? null;

                state.isAuthenticated = true;
                state.isAuthChecked = true;
                state.loading = false;
            })

            .addCase(bootstrapAuth.rejected, (state) => {
                state.isAuthChecked = true;
                state.loading = false;
            })



    }
})


export const { setUser, setLoading, clearAuth, setResetRole,
    clearResetFlow, resetOtpState, clearAuthError } = authSlice.actions;
export default authSlice.reducer