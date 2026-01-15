
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Developer } from "../types/developer.types";
import { developerApiForCompany, type FetchDevelopersParams, type FetchDevelopersResponse } from "../services/developer.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";



interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DeveloperState {
  items: Developer[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const initialState: DeveloperState = {
  items: [],
  pagination:{
    page:1,
    limit:10,
    total:0,
    totalPages:1
  },
  loading: false,
  error: null
};


export const fetchDevelopers=createAsyncThunk<FetchDevelopersResponse,FetchDevelopersParams,{rejectValue:string}>
(
    "companyAdmin/developers/fetch",
    async(params,{rejectWithValue} )=>{
        try {
            return await developerApiForCompany.getDevelopers(params)
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const inviteDeveloper=createAsyncThunk<
void,
{email:string},
{rejectValue:string}
>(
    "companyAdmin/developers/invite",
    async(data,{rejectWithValue})=>{
        try {
            await developerApiForCompany.inviteDeveloper(data);
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
);

export const blockDeveloper=createAsyncThunk<
void,
string,
{rejectValue:string}
>(
    "companyAdmin/developers/block",
    async(userId,{rejectWithValue,dispatch})=>{
        try {
            await developerApiForCompany.blockDeveloper(userId)
           dispatch(fetchDevelopers({ page: 1, limit: 10 }));
        } catch (error:unknown) {
         return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const unblockDeveloper=createAsyncThunk<
void,
string,
{rejectValue:string}
>(
  "companyAdmin/developers/unblock",
  async(userId,{rejectWithValue,dispatch})=>{
    try {
        await developerApiForCompany.unblockDeveloper(userId)
         dispatch(fetchDevelopers({ page: 1, limit: 10 }));
    } catch (error:unknown) {
       return rejectWithValue(getErrorMessage(error))   
    }
  }  
)

const developerSlice=createSlice({
    name:'companyAdminDevelopers',
    initialState,
    reducers:{
        clearDeveloperError(state){
            state.error=null;
        }
    },
    extraReducers:builder=>{
        builder

        .addCase(fetchDevelopers.pending,state=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchDevelopers.fulfilled,(state,action)=>{
            state.loading=false;
            state.items=action.payload.items;
            state.pagination=action.payload.pagination;

        })
        .addCase(fetchDevelopers.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })


        .addCase(inviteDeveloper.pending,state=>{
            state.loading=true;
            state.error=null;
        })

        .addCase(inviteDeveloper.fulfilled,state=>{
            state.loading=false
        })
        .addCase(inviteDeveloper.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(blockDeveloper.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(blockDeveloper.fulfilled,state=>{
            state.loading=false
        })
        .addCase(blockDeveloper.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(unblockDeveloper.pending,state=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(unblockDeveloper.fulfilled,state=>{
            state.loading=false
        })
        .addCase(unblockDeveloper.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})

export const {clearDeveloperError}=developerSlice.actions;
export default developerSlice.reducer