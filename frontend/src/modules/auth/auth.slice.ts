import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./services/auth.api";

export type AuthRole='SUPER_ADMIN'|'COMPANY_ADMIN'|"DEVELOPER";

export interface AuthUser {
    id:string;
    name:string;
    email:string;
    role:AuthRole;
    companyId?:string
}

interface AuthState{
    user:AuthUser|null;
    loading:boolean;
    error:string|null;
    isAuthenticated:boolean
}

// intial state

const initialState:AuthState={
    user:null,
    loading:false,
    error:null,
    isAuthenticated:false
}

// async thunks

export const superAdminLogin=createAsyncThunk(
    'auth/superAdminLogin',
    async(data:{email:string; password:string},{rejectWithValue})=>{
        try {
            const res=await authApi.superAdminLogin(data);
            return res.data.data
        } catch (error:any) {
            return rejectWithValue(
                error?.response?.data?.message || 'Login failed'
            )
            
        }
    }
)

// company admin & developer Login

export const userLogib=createAsyncThunk(
    'auth/userLogin',
    async(
        data:{email:string;password:string},{rejectWithValue}
    )=>{
        try {
            const res=await authApi.userLogin(data);
            return res.data;
        } catch (error:any) {
            return rejectWithValue(
                error?.response?.data?.message || 'Login failed'
            )            
        }
    }
)

//refresh token of super admin

export const superAdminRefresh=createAsyncThunk<AuthUser,void>(
    'auth/superAdminRefresh',
    async(_,{rejectWithValue})=>{
        try{
            const res=await authApi.superAdminRefresh();
            return res.data.user
        }catch (error: any) {
      return rejectWithValue("Session expired");
    }
    }
)


// slice

const authSlice=createSlice({
    name:'auth',
    initialState,

    reducers:{
        logout(state){
            state.user=null;
            state.isAuthenticated=false;
            state.error=null
        }
    },
    extraReducers:(builder)=>{
        builder
        
        .addCase(superAdminLogin.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(superAdminLogin.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
            state.isAuthenticated=true
        })
        .addCase(superAdminLogin.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(superAdminRefresh.pending, (state) => {
  state.loading = true;
})

.addCase(superAdminRefresh.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload;
  state.isAuthenticated = true;
})

.addCase(superAdminRefresh.rejected, (state) => {
  state.loading = false;
  state.user = null;
  state.isAuthenticated = false;
})

    }
})


export const {logout}=authSlice.actions;
export default authSlice.reducer