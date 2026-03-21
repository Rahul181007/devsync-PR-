import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UpdateWorklogPayload, WorklogItem } from "../types/worklog.types";
import { worklogApi } from "../services/worklog.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface WorklogState{
    loading:boolean;
    error:string|null;
    worklogs:WorklogItem[]
}

const initialState:WorklogState={
    loading:false,
    error:null,
    worklogs:[]
}

export const getWorklogsByTask=createAsyncThunk<
WorklogItem[],
{projectId:string;taskId:string},
{rejectValue:string}
>(
    "worklog/getByTask",
    async ({projectId,taskId},{rejectWithValue})=>{
        try {
            const res=await worklogApi.getWorklogsByTask(projectId,taskId);
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createWorklog=createAsyncThunk<
void,
  {
    projectId: string;
    taskId: string;
    data: {
      timeSpent: number;
      description?: string;
      date?: string;
    };
  },
  { rejectValue: string }
>(
   "worklog/create",
   async({projectId,taskId,data},{dispatch,rejectWithValue})=>{
    try {
        await worklogApi.createWorklog(projectId,taskId,data)
        dispatch(getWorklogsByTask({projectId,taskId}))
    } catch (error:unknown) {
        return rejectWithValue(getErrorMessage(error))
    }
   } 
)

export const updateWorklog = createAsyncThunk<
  void,
  UpdateWorklogPayload,
  { rejectValue: string }
>(
  "worklog/update",
  async ({ projectId, worklogId,taskId, data }, { dispatch, rejectWithValue }) => {
    try {
      await worklogApi.updateWorklog(projectId, worklogId, data);

      dispatch(getWorklogsByTask({ projectId, taskId }));
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteWorklog = createAsyncThunk<
  void,
  { projectId: string; taskId: string; worklogId: string },
  { rejectValue: string }
>(
  "worklog/delete",
  async ({ projectId, taskId, worklogId }, { dispatch, rejectWithValue }) => {
    try {
      await worklogApi.deleteWorklog(projectId, worklogId);

      dispatch(getWorklogsByTask({ projectId, taskId }));
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const worklogSlice=createSlice({
    name:'worklog',
    initialState,
  reducers: {
    clearWorklogError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

     
      .addCase(getWorklogsByTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorklogsByTask.fulfilled, (state, action) => {
        state.loading = false;
        state.worklogs = action.payload;
      })
      .addCase(getWorklogsByTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
})

export const { clearWorklogError } = worklogSlice.actions;

export default worklogSlice.reducer;