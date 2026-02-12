import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TaskDetail, TaskListItem, TaskPriority } from "../types/task.types";
import { taskApi } from "../services/task.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface TaskState{
    loading:boolean;
    error:string|null;
    tasks:TaskListItem[];
    selectedTask:TaskDetail|null
}

const initialState:TaskState={
    loading:false,
    error:null,
    tasks:[],
    selectedTask:null
}

export const getProjectTasks=createAsyncThunk<
TaskListItem[],
string,
{rejectValue:string}
>(
    "task/getProjectTasks",
    async(projectId,{rejectWithValue})=>{
        try {
            const res=await taskApi.getProjectTask(projectId);
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getTaskDetail=createAsyncThunk<
TaskDetail,
{projectId:string;taskId:string},
{rejectValue:string}
>(
    "task/getTaskDetail",
    async({projectId,taskId},{rejectWithValue})=>{
        try {
            const res= await taskApi.getTaskDetail(projectId,taskId);
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
)

export const updateTaskStatus=createAsyncThunk<
void,
{
    projectId:string;
    taskId:string;
    status:"IN_PROGRESS" | "COMPLETED";
},
{rejectValue:string}
>(
    "task/updateTaskStatus",
    async({projectId,taskId,status},{dispatch,rejectWithValue})=>{
        try {
            await taskApi.updateTaskStatus(projectId,taskId,status)
            dispatch(getProjectTasks(projectId))
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createTask=createAsyncThunk<
void,
{
    projectId:string;
    data:{
        title:string;
        description:string;
        priority:TaskPriority;
        assigneeId?:string|null;
        dueDate?:string|null
    }
},
{rejectValue:string}
>(
    "task/createTask",
    async({projectId,data},{rejectWithValue})=>{
        try {
            await taskApi.createTask(projectId,data)
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


const taskSlice=createSlice({
    name:"task",
    initialState,
    reducers:{
        clearTaskError(state){
            state.error=null
        },
        clearSelectedTask(state){
            state.selectedTask=null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getProjectTasks.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(getProjectTasks.fulfilled,(state,action)=>{
            state.loading=false;
            state.tasks=action.payload
        })
        .addCase(getProjectTasks.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        .addCase(getTaskDetail.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(getTaskDetail.fulfilled,(state,action)=>{
            state.loading=false;
            state.selectedTask=action.payload
        })
        .addCase(getTaskDetail.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})


export const {clearTaskError,clearSelectedTask}=taskSlice.actions;
export default taskSlice.reducer