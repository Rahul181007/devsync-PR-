import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PlanSprintRequest, SprintDetail, SprintListItems } from "../types/sprint.types";
import type { TaskListItem } from "../types/task.types";
import { sprintApi } from "../services/sprint.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface SprintState {
    loading: boolean;
    error: string | null;
    sprints: SprintListItems[];
    selectedSprint: SprintDetail | null;
    sprintTasks: TaskListItem[]
}

const initialState: SprintState = {
    loading: false,
    error: null,
    sprints: [],
    selectedSprint: null,
    sprintTasks: []
}

export const getProjectSprints = createAsyncThunk<
    SprintListItems[],
    string,
    { rejectValue: string }
>(
    "sprint/getProjectSprints",
    async (projectId, { rejectWithValue }) => {
        try {
            const res = await sprintApi.getProjectSprints(projectId);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


export const getSprintDetail = createAsyncThunk<
    { sprint: SprintDetail; tasks: TaskListItem[] },
    { projectId: string; sprintId: string },
    { rejectValue: string }
>(
    "sprint/getSprintDetail",
    async ({ projectId, sprintId }, { rejectWithValue }) => {
        try {
            const res = await sprintApi.getSprintDetail(projectId, sprintId);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createSprint=createAsyncThunk<
void,
{
    projectId:string;
    data:{
        name:string;
        goal?:string|null;
        startDate:string;
        endDate:string
    }
},
{rejectValue:string}
>(
    "sprint/createSprint",
    async({projectId,data},{dispatch,rejectWithValue})=>{
        try {
            await sprintApi.createSprint(projectId,data);
            dispatch(getProjectSprints(projectId));
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const activateSprint=createAsyncThunk<
void,
{projectId:string;sprintId:string},
{rejectValue:string}
>(
    "sprint/activateSprint",
    async({projectId,sprintId},{dispatch,rejectWithValue})=>{
        try {
            await sprintApi.activateSprint(projectId,sprintId);
            dispatch(getProjectSprints(projectId));
            dispatch(getSprintDetail({projectId,sprintId}))
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const completeSprint=createAsyncThunk<
void,
{projectId:string;sprintId:string},
{rejectValue:string}
>(
    "sprint/completeSprint",
    async({projectId,sprintId},{dispatch,rejectWithValue})=>{
        try {
            await sprintApi.completeSprint(projectId,sprintId);
             dispatch(getSprintDetail({projectId,sprintId}))
            dispatch(getProjectSprints(projectId));
           
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const planSprintTasks=createAsyncThunk<
void,
{projectId:string;data:PlanSprintRequest},
{rejectValue:string}
>(
    "sprint/planSprintTasks",
    async({projectId,data},{dispatch,rejectWithValue})=>{
        try {
            await sprintApi.planSprintTasks(projectId,data);
            dispatch(getSprintDetail({
                projectId,sprintId:data.sprintId
            }))
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

const sprintSlice = createSlice({
    name: "sprint",
    initialState,
    reducers: {
        clearSprintError(state) {
            state.error = null;
        },
        clearSelectedSprint(state) {
            state.selectedSprint = null;
            state.sprintTasks = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectSprints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectSprints.fulfilled, (state, action) => {
                state.loading = false;
                state.sprints = action.payload
            })
            .addCase(getProjectSprints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(getSprintDetail.pending,(state)=>{
                state.loading=true;
                state.error=null
            })

            .addCase(getSprintDetail.fulfilled,(state,action)=>{
                state.loading=false;
                state.selectedSprint=action.payload.sprint;
                state.sprintTasks=action.payload.tasks
            })
            .addCase(getSprintDetail.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload as string
            })
        }
})




export const { clearSprintError, clearSelectedSprint } =
    sprintSlice.actions;

export default sprintSlice.reducer;