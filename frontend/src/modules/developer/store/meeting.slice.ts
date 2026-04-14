import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { GetMeetingsResponse, Meeting } from "../types/meeting.types";

import { developerMeetingApi } from "../services/meeting.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface MeetingState {
    loading: boolean;
    error: string | null;
    meetings: Meeting[];
    todayMeetings: Meeting[];
    missedMeetings: Meeting[];

    total: number;
    page: number;
    limit: number
}

const initialState: MeetingState = {
    loading: false,
    error: null,
    meetings: [],
    todayMeetings: [],
    missedMeetings: [],

    total: 0,
    page: 1,
    limit: 10,
}

export const getMeetings = createAsyncThunk<
    GetMeetingsResponse,
    { projectId: string, page?: number; limit?: number, sprintId?: string, type?: string; },
    { rejectValue: string }
>(
    "developerMeeting/getMeetings",
    async ({ projectId, page = 1, limit = 10, sprintId, type }, { rejectWithValue }) => {
        try {
            const res = await developerMeetingApi.getMeetings(projectId, {
                page,
                limit,
                sprintId,
                type

            })
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


export const getTodayMeetings = createAsyncThunk<
    Meeting[],
    { projectId: string },
    { rejectValue: string }
>(
    "meeting/getTodayMeetings",
    async ({ projectId }, { rejectWithValue }) => {
        try {
            const res = await developerMeetingApi.getTodayMeetings(projectId);
            return res.data.data.items;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


export const getMissedMeetings = createAsyncThunk<
    Meeting[],
    { projectId: string },
    { rejectValue: string }
>(
    "meeting/getMissedMeetings",
    async ({ projectId }, { rejectWithValue }) => {
        try {
            const res = await developerMeetingApi.getMissedMeetings(projectId);
            return res.data.data.items;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);



const devMeetingSLice = createSlice({
    name: "developerMeeting",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMeetings.pending, (state) => {
                state.loading = true
            })
            .addCase(getMeetings.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = action.payload.items;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit
            })

            .addCase(getMeetings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(getTodayMeetings.fulfilled, (state, action) => {
                state.todayMeetings = action.payload;
            })

            .addCase(getMissedMeetings.fulfilled, (state, action) => {
                state.missedMeetings = action.payload;
            })

    }
})

export default devMeetingSLice.reducer;