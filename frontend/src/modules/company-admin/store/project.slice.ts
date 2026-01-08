import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectApi } from "../services/project.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface ProjectState {
    loading:boolean;
    error:string|null;
    
}

const initialState:ProjectState={
    loading:false,
    error:null
}

export const createFirstProject=createAsyncThunk<void,{
    name:string;
    description?:string;
    startDate?:string;
    endDate?:string
},{rejectValue:string}>(
    "project/createFirstProject",
    async(data,{rejectWithValue})=>{
        try {
            await projectApi.createProject(data)
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

const projectSlice=createSlice({
    name:'project',
    initialState,
    reducers:{
        clearProjectError(state){
            state.error=null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(createFirstProject.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(createFirstProject.fulfilled,(state)=>{
            state.loading=false
        })
        .addCase(createFirstProject.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})

export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;