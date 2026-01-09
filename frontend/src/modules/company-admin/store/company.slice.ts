import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { companyApi } from "../services/company.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";
import { bootstrapAuth } from "../../auth/auth.slice";

export interface CompanyState{
    loading:boolean;
    error:string|null;
    company:Company|null
}
export type CompanyStatus='PENDING'|'APPROVED'|'SUSPENDED'
export interface Company{
    id:string;
    name:string;
    status:CompanyStatus;
    loginUrl?:string|null;
    themeColor?:string|null
}

const initialState:CompanyState={
    loading:false,
    error:null,
    company:null
}

export const createWorkspace=createAsyncThunk<{companyId:string},{name:string;domain?:string}>(
    'company/createWorkspace',
    async(data,{rejectWithValue,dispatch})=>{
        try {
            const res=await companyApi.createWorkspace(data)
            dispatch(bootstrapAuth())
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getMyCompany=createAsyncThunk<CompanyState['company'],void,{rejectValue:string}>(
    "company/getMyCompany",
    async(_,{rejectWithValue})=>{
        try {
            const res=await companyApi.getMyCompany();
            
            return res.data.data;
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateBranding=createAsyncThunk<void,{logo?:File;themeColor:string},{rejectValue:string}>(
    "company/updateBranding",
    async(data,{rejectWithValue,dispatch})=>{
        try {
            const formData=new FormData();
            if(data.logo){
                formData.append('logo',data.logo)
            }
            if(data.themeColor){
                formData.append('themeColor',data.themeColor)
            }
            await companyApi.updateBranding(formData)
            dispatch(bootstrapAuth())
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

const companySlice=createSlice({
    name:'Company',
    initialState,
    reducers:{
        clearCompanyError(state){
            state.error=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(createWorkspace.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createWorkspace.fulfilled,(state,action)=>{
            state.loading=false
            if(state.company){
                state.company.id=action.payload.companyId
            }
            
        })
        .addCase(createWorkspace.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })


        .addCase(getMyCompany.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getMyCompany.fulfilled,(state,action)=>{
            state.loading=false;
            state.company=action.payload;
        })
        .addCase(getMyCompany.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(updateBranding.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateBranding.fulfilled,(state)=>{
            state.loading=false
        })
        .addCase(updateBranding.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})


export const {clearCompanyError}=companySlice.actions;
export default companySlice.reducer