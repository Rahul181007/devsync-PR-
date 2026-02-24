import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { SprintHistoryItem, StandupDetail, TodayStandupSummary } from "../types/standup.type";
import { companyStandupApi } from "../services/standup.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface CompanyStandupState {
    loading: boolean;
    error: string | null;
    today: TodayStandupSummary | null;
    history: SprintHistoryItem[];
    selectedStandup: StandupDetail | null
}

const initialState: CompanyStandupState = {
    loading: false,
    error: null,
    today: null,
    history: [],
    selectedStandup: null
}

export const fetchCompanyTodayStandup = createAsyncThunk<
    TodayStandupSummary,
    string,
    { rejectValue: string }
>(
    "companyStandup/fetchToday",
    async (projectId, { rejectWithValue }) => {
        try {
            const res = await companyStandupApi.getToday(projectId);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchCompanyStandupHistory = createAsyncThunk<
    SprintHistoryItem[],
    string,
    { rejectValue: string }
>(
    "companyStandup/fetchHistory",
    async (projectId, { rejectWithValue }) => {
        try {
            const res = await companyStandupApi.getHistory(projectId);
            return res.data.data.sprints
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchCompanyStandupDetail = createAsyncThunk<
    StandupDetail,
    { projectId: string, standupId: string },
    { rejectValue: string }
>(
    "companyStandup/fetchDetail",
    async ({ projectId, standupId }, { rejectWithValue }) => {
        try {
            const res = await companyStandupApi.getStandupDetail(
                projectId,
                standupId
            );
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

const companyStandupSlice = createSlice({
    name: "companyStandup",
    initialState,
    reducers: {
        clearCompanyStandupError(state) {
            state.error = null;
        },
        clearSelectedStandup(state) {
            state.selectedStandup = null;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchCompanyTodayStandup.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchCompanyTodayStandup.fulfilled, (state, action) => {
                state.loading = false;
                state.today = action.payload
            })
            .addCase(fetchCompanyTodayStandup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchCompanyStandupHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyStandupHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchCompanyStandupHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchCompanyStandupDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyStandupDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedStandup = action.payload;
            })
            .addCase(fetchCompanyStandupDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
})


export const { clearCompanyStandupError,clearSelectedStandup } =
    companyStandupSlice.actions;

export default companyStandupSlice.reducer;