import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CreateMeetingPayload, GetMeetingsResponse, Meeting, UpdateMeetingPayload } from "../types/meeting.types";
import { meetingApi } from "../services/meeting.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface MeetingState {
    loading: boolean;
    error: string | null;
    meetings: Meeting[];
    todayMeetings: Meeting[];
    missedMeetings: Meeting[];
    completedMeetings: Meeting[];
    page: number;
    limit: number;
    total: number
}

const initialState: MeetingState = {
    loading: false,
    error: null,
    meetings: [],
    todayMeetings: [],
    missedMeetings: [],
    completedMeetings: [],
    page: 1,
    limit: 10,
    total: 0
}


export const getMeetings = createAsyncThunk<
    GetMeetingsResponse,
    { projectId: string, page?: number; limit?: number; sprintId?: string, type?: string; }, { rejectValue: string }
>(
    "meeting/getMeetings",
    async ({ projectId, page = 1, limit = 10, sprintId, type }, { rejectWithValue }) => {
        try {

            console.log("FILTER PARAMS:", { projectId, page, limit, sprintId });
            const res = await meetingApi.getMeetings(projectId, {
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

export const createMeeting = createAsyncThunk<
    void,
    { projectId: string; data: CreateMeetingPayload },
    { rejectValue: string }
>(
    "meeting/createMeeting",
    async ({ projectId, data }, { dispatch, rejectWithValue }) => {
        try {
            await meetingApi.createMeeting(projectId, data);
            dispatch(getMeetings({ projectId }))
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateMeeting = createAsyncThunk<
    void,
    { projectId: string; meetingId: string; data: Omit<UpdateMeetingPayload, "meetingId"> },
    { rejectValue: string }
>(
    "meeting/updateMeeting",
    async ({ projectId, meetingId, data }, { dispatch, rejectWithValue }) => {
        try {
            await meetingApi.updateMeeting(projectId, {
                meetingId,
                ...data
            })
            dispatch(getMeetings({ projectId }))
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
            const res = await meetingApi.getTodayMeetings(projectId);
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
            const res = await meetingApi.getMissedMeetings(projectId);
            return res.data.data.items;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const getCompletedMeetings = createAsyncThunk<
    Meeting[],
    { projectId: string },
    { rejectValue: string }
>(
    "meeting/CompletedMeetings",
    async ({ projectId }, { rejectWithValue }) => {
        try {
            const res = await meetingApi.getCompletedMeetings(projectId);
            return res.data.data.items;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);



const meetingSlice = createSlice({
    name: "meeting",
    initialState,
    reducers: {
        clearMeetingError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMeetings.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getMeetings.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = action.payload.items;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
                state.total = action.payload.total
            })
            .addCase(getMeetings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createMeeting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMeeting.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 🔹 UPDATE
            .addCase(updateMeeting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMeeting.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getTodayMeetings.fulfilled, (state, action) => {
                state.todayMeetings = action.payload;
            })

            .addCase(getMissedMeetings.fulfilled, (state, action) => {
                state.missedMeetings = action.payload;
            })
            .addCase(getCompletedMeetings.fulfilled,(state,action)=>{
                state.completedMeetings=action.payload
            })

    },
});

export const { clearMeetingError } = meetingSlice.actions;

export default meetingSlice.reducer;