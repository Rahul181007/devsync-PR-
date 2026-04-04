import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DeveloperDashboardData } from "../types/dashboard.types";
import { developerDashboardApi } from "../services/dashboard.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface DeveloperDashboardState {
    loading:boolean;
    error:string|null;
    data:DeveloperDashboardData|null
}

const initialState:DeveloperDashboardState={
    loading:false,
    error:null,
    data:null
}

export const getDeveloperDashboard=createAsyncThunk<
DeveloperDashboardData,
void,
{rejectValue:string}
>(
    "DeveloperDashboard/getDashboard",
    async(_,{rejectWithValue})=>{
        try {
            const res=await developerDashboardApi.getDashboard();
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }


)


const developerDashboardSlice=createSlice({
    name:"DeveloperDashboard",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getDeveloperDashboard.pending,(state)=>{
            state.loading=true;
            state.error=null
        })

        .addCase(getDeveloperDashboard.fulfilled,(state,action)=>{
            state.loading=false;
            state.data=action.payload
        })
        .addCase(getDeveloperDashboard.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})

export default developerDashboardSlice.reducer;