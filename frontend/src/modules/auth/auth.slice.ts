import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./services/auth.api";
import { getErrorMessage } from "../../shared/utiils/getErrorMessage";


export type AuthRole = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | "DEVELOPER";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: AuthRole;
    companyId?: string
}

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isAuthChecked: boolean;

    otpSent:boolean;
    otpVerified:boolean;
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
     otpSent:false,
     otpVerified:false,
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

export const userLogin = createAsyncThunk(
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

export const sendForgotPasswordOtp=createAsyncThunk(
    'auth/sendForgotPasswordOtp',
    async(email:string,{rejectWithValue})=>{
        try {
            const res=await authApi.forgotPassword(email);
            return res.data.message;
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const verifyForgotPasswordOtp=createAsyncThunk(
     "auth/verifyForgotPasswordOtp",
     async(
        data:{email:string;otp:string},{rejectWithValue}
     )=>{
        try {
            const res=await authApi.verifyOtp(data);
            return res.data.message
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
     }
)

export const resetPassword=createAsyncThunk(
    "auth/resetPassword",
    async(
        data:{email:string;otp:string;newPassword:string},{rejectWithValue}
    )=>{
        try {
            const res=await authApi.resetPassword(data);
            return res.data.message
        } catch (error:unknown) {
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
                state.error = null
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload
                state.isAuthChecked = true;
            })
            .addCase(userLogin.rejected,(state,action)=>{
                state.loading=false;
                state.user=null;
                state.isAuthenticated=false
                state.error = action.payload as string
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null
            })

            // forgot password
            .addCase(sendForgotPasswordOtp.pending,(state)=>{
                state.loading=true;
                state.error=null;
                state.otpSent=false
            })
            .addCase(sendForgotPasswordOtp.fulfilled,(state)=>{
                state.loading=false;
                state.otpSent=true
            })
            .addCase(sendForgotPasswordOtp.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload as string
            })

            //verify otp
            .addCase(verifyForgotPasswordOtp.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(verifyForgotPasswordOtp.fulfilled,(state)=>{
                state.loading=false;
                state.otpVerified=true;
            })
            .addCase(verifyForgotPasswordOtp.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload as string;
            })
           // Reset password
            .addCase(resetPassword.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(resetPassword.fulfilled,(state)=>{
                state.loading=false;
                state.otpSent=false;
                state.otpVerified=false
                state.passwordResetSuccess = true;
            })
            .addCase(resetPassword.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload as string
            })

    }
})


export const { setUser, setLoading,clearAuth,  setResetRole,
  clearResetFlow, resetOtpState,clearAuthError } = authSlice.actions;
export default authSlice.reducer