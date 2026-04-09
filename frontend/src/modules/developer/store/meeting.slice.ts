import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Meeting } from "../types/meeting.types";
import type { GetMeetingsResponse } from "../../company-admin/types/meeting.types";
import { developerMeetingApi } from "../services/meeting.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface MeetingState {
    loading: boolean;
    error: string | null;
    meetings: Meeting[];
    total: number;
    page: number;
    limit: number
}

const initialState: MeetingState = {
    loading: false,
    error: null,
    meetings: [],
    total: 0,
    page: 1,
    limit: 10,
}

export const getMeetings=createAsyncThunk<
GetMeetingsResponse,
{projectId:string,page?:number;limit?:number},
{rejectValue:string}
>(
     "developerMeeting/getMeetings",
     async({projectId,page=1,limit=10},{rejectWithValue})=>{
        try {
            const res=await developerMeetingApi.getMeetings(projectId,{
                page,
                limit,

            })
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
     }
)

const devMeetingSLice=createSlice({
    name:"developerMeeting",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getMeetings.pending,(state)=>{
            state.loading=true
        })
        .addCase(getMeetings.fulfilled,(state,action)=>{
            state.loading=false;
            state.meetings=action.payload.items;
            state.total=action.payload.total;
            state.page=action.payload.page;
            state.limit=action.payload.limit
        })

        .addCase(getMeetings.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})

export default devMeetingSLice.reducer;