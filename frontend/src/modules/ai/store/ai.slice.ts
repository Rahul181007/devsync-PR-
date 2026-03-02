import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ProjectAISummary } from "../types/ai.types";
import { aiApi } from "../services/ai.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface AIState{
    loading:boolean;
    error:string|null;
    summary:ProjectAISummary|null
}

const initialState:AIState={
    loading:false,
    error:null,
    summary:null,
}

export const getProjectAISummary=createAsyncThunk<
ProjectAISummary,
{projectId:string},
{rejectValue:string}
>(
    "ai/getProjectAISummary",
    async({projectId},{rejectWithValue})=>{
        try {
            const res=await aiApi.getProjectAISummary(projectId);
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


const aiSlice=createSlice({
    name:"ai",
    initialState,
    reducers:{
            clearAISummary(state) {
      state.summary = null;
    },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getProjectAISummary.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })

        .addCase(getProjectAISummary.fulfilled,(state,action)=>{
            state.loading=false;
            state.summary=action.payload;

        })

        .addCase(getProjectAISummary.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})

export const { clearAISummary } = aiSlice.actions;

export default aiSlice.reducer;