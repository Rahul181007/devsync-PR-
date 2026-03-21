import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  AdminWorklogItem,
  ProjectWorklogItem,
} from "../types/wroklog.types";
import { adminWorklogApi } from "../services/worklog.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface AdminWorklogState {
  worklogs: AdminWorklogItem[];
  projectWorklogs: ProjectWorklogItem[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminWorklogState = {
  worklogs: [],
  projectWorklogs: [],
  loading: false,
  error: null,
};

export const getAdminTaskWorklogs = createAsyncThunk<
  AdminWorklogItem[],
  { projectId: string; taskId: string },
  { rejectValue: string }
>(
  "adminWorklog/getTaskWorklogs",
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      const res = await adminWorklogApi.getTaskWorklogs(projectId, taskId);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getProjectWorklogs = createAsyncThunk<
  ProjectWorklogItem[],
  string,
  { rejectValue: string }
>("adminWorklog/getProjectWorklogs", async (projectId, { rejectWithValue }) => {
  try {
    const res = await adminWorklogApi.getProjectWorklogs(projectId);
    return res.data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const adminWorklogSlice = createSlice({
  name: "adminWorklog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminTaskWorklogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminTaskWorklogs.fulfilled, (state, action) => {
        state.loading = false;
        state.worklogs = action.payload;
      })
      .addCase(getAdminTaskWorklogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getProjectWorklogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjectWorklogs.fulfilled, (state, action) => {
        state.loading = false;
        state.projectWorklogs = action.payload;
      })
      .addCase(getProjectWorklogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminWorklogSlice.reducer;
