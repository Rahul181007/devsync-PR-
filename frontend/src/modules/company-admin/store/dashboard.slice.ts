import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CompanyDashboardData } from "../types/dashboard.types";
import { companyDashboardApi } from "../services/dashboard.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface DashboardState {
    loading:boolean;
    error:string|null;
    data:CompanyDashboardData|null
}

const initialState :DashboardState={
    loading:false,
    error:null,
    data:null
}

export const getCompanyDashboard=createAsyncThunk<
CompanyDashboardData,
void,
{rejectValue:string}
>(
    "CompanyDashboard/getDashboard",
    async(_,{rejectWithValue})=>{
        try {
            const res=await companyDashboardApi.getDashboard();
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)



const companyDashboardSlice=createSlice({
    name:"CompanyDashboard",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getCompanyDashboard.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })

        .addCase(getCompanyDashboard.fulfilled,(state,action)=>{
            state.loading=false;
            state.data=action.payload
        })

        .addCase(getCompanyDashboard.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }

})

export default companyDashboardSlice.reducer;