import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DashboardData } from "../typess/dashboard.types";
import { dashboardApi } from "../services/dashboard.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface DashboardState {
    loading:boolean;
    error:string|null;
    data:DashboardData|null;
}

const initialState:DashboardState={
    loading:false,
    error:null,
    data:null
}

export const getDashboard=createAsyncThunk<
DashboardData,
void,
{rejectValue:string}
>(
    "dashboard/getDashboard",
    async(_,{rejectWithValue})=>{
        try {
            const res=await dashboardApi.getSuperAdminDashboard();
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


const dashboardSlice=createSlice({
    name:"dashboard",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getDashboard.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(getDashboard.fulfilled,(state,action)=>{
            state.loading=false;
            state.data=action.payload
        })
        .addCase(getDashboard.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})

export default dashboardSlice.reducer;