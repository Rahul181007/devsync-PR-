import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DeveloperStandupResponse, StandupMood } from "../types/standup.type";
import { devStandupApi } from "../services/standup.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface DeveloperStandupState{
    loading:boolean;
    error:string|null;
    data:DeveloperStandupResponse|null;
}

const initialState:DeveloperStandupState={
    loading:false,
    error:null,
    data:null
}

export const fetchDeveloperStandups=createAsyncThunk<
DeveloperStandupResponse,
string,
{rejectValue:string}
>(
    "developerStandup/getMyStandups",
    async (projectId,{rejectWithValue})=>{
        try {
            const res=await devStandupApi.getmyStandup(projectId);
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createDeveloperStandup = createAsyncThunk<
  void,
  {
    projectId: string;
    data: {
      yesterday: string;
      today: string;
      blockers?: string | null;
      mood: StandupMood;
    };
  },
  { rejectValue: string }
>(
  "developerStandup/create",
  async ({ projectId, data }, { dispatch, rejectWithValue }) => {
    try {
      await devStandupApi.createStandup(projectId, data);
      dispatch(fetchDeveloperStandups(projectId));
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateDeveloperStandup = createAsyncThunk<
  void,
  {
    projectId: string;
    data: {
      yesterday: string;
      today: string;
      blockers?: string | null;
      mood: StandupMood;
    };
  },
  { rejectValue: string }
>(
  "developerStandup/update",
  async ({ projectId, data }, { dispatch, rejectWithValue }) => {
    try {
      await devStandupApi.updateStandup(projectId, data);
      dispatch(fetchDeveloperStandups(projectId));
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


const developerStandupSlice=createSlice({
    name:"developerStandup",
    initialState,
    reducers:{
            clearDeveloperStandupError(state) {
      state.error = null;
    },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchDeveloperStandups.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(fetchDeveloperStandups.fulfilled,(state,action)=>{
            state.loading=false;
            state.data=action.payload
        })
        .addCase(fetchDeveloperStandups.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(createDeveloperStandup.rejected, (state, action) => {
  state.error = action.payload as string;
})

.addCase(updateDeveloperStandup.rejected, (state, action) => {
  state.error = action.payload as string;
})

    }
})


export const { clearDeveloperStandupError } =
  developerStandupSlice.actions;

export default developerStandupSlice.reducer;