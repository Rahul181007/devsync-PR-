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
}

// intial state

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
     isAuthChecked: false
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
            .addCase(userLogin.rejected,(state)=>{
                state.loading=false;
                state.user=null;
                state.isAuthenticated=false
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null
            })

    }
})


export const { setUser, setLoading,clearAuth  } = authSlice.actions;
export default authSlice.reducer