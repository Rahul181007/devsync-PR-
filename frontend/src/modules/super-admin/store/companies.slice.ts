import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Company } from "../typess/company.type";
import { companyService } from "../services/company.service";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface CompaniesState{
    items:Company[];
    loading:boolean;
    error:string|null;

    page:number;
    limit:number;
    total:number;

    search:string;
    status: "ALL" | "PENDING" | "APPROVED" | "SUSPENDED";
}

const initialState:CompaniesState={
    items:[],
    loading:false,
    error:null,

    page:1,
    limit:10,
    total:0,

    search:'',
    status:'ALL'
}

interface FetchCompaniesQuery {
  page: number;
  limit: number;
  search?: string;
  status?: "PENDING" | "APPROVED" | "SUSPENDED";
}



export const fetchCompanies=createAsyncThunk(
    'companies/fetch',
    async(
        params:{page:number;limit:number;search?:string;status?:"ALL" | "PENDING" | "APPROVED" | "SUSPENDED";},{rejectWithValue}
    )=>{
        try {
            const queryParams:FetchCompaniesQuery={
                page:params.page,
                limit:params.limit,
            }

            if(params.search?.trim()){
                queryParams.search=params.search.trim();
            }

            if(params.status && params.status!=='ALL'){
                queryParams.status=params.status
            }
            const res=await companyService.getCompanies(queryParams);
            return res.data.data;
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const approveCompany=createAsyncThunk(
    'companies/Approve',
    async({
        companyId,
        page,
        limit,
        search
    }:{companyId:string;page:number;limit:number;search?:string},{dispatch})=>{
        await companyService.approveCompany(companyId);

        dispatch(fetchCompanies({page,limit,search}))
    }
)

export const suspendCompany=createAsyncThunk<Company,string,{rejectValue:string}>(
    'companies/suspend',
    async(companyId,{rejectWithValue})=>{
        try {
            const res= await companyService.suspendCompany(companyId);
            return res.data.data 
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


const companiesSlice=createSlice({
    name:'companies',
    initialState,
    reducers:{
      setPage(state,action){
        state.page=action.payload
      },
      setSearch(state,action){
        state.search=action.payload;
        state.page=1
      },
      setStatus(state,action:PayloadAction<CompaniesState['status']>){
        state.status=action.payload;
        state.page=1;
      }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCompanies.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchCompanies.fulfilled,(state,action)=>{
            state.loading=false;
            state.items=action.payload.items;
            state.total=action.payload.total;
            state.limit=action.payload.limit
        })
        .addCase(fetchCompanies.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(suspendCompany.pending,(state)=>{
            state.loading=true;
        })
        .addCase(suspendCompany.fulfilled,(state,action)=>{
            state.loading=false;

            const index=state.items.findIndex(c=>c.id===action.payload.id)
            if(index!==-1){
                state.items[index]=action.payload
            }
        })

        .addCase(suspendCompany.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload??'Failed to suspend company'
        })
    }
});

export const {setPage,setSearch,setStatus}=companiesSlice.actions
export default companiesSlice.reducer