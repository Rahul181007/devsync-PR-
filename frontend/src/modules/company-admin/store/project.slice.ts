import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectApi } from "../services/project.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";
import { bootstrapAuth } from "../../auth/auth.slice";
import type { Project,ProjectDetail } from "../types/project.types";

interface ProjectState {
    loading: boolean;
    error: string | null;

    projects: Project[];

    selectedProject:ProjectDetail|null
    total: number;
    page: number;
    limit: number;

}

const initialState: ProjectState = {
    loading: false,
    error: null,

    projects: [],
    selectedProject:null,
    total: 0,
    page: 1,
    limit: 10
}

export const createFirstProject = createAsyncThunk<void, { 
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string
}, { rejectValue: string }>(
    "project/createFirstProject",
    async (data, { rejectWithValue, dispatch }) => {
        try {
            await projectApi.createFirstProject(data)
            dispatch(bootstrapAuth())
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


export const listProjects = createAsyncThunk<
    {
        data: Project[];
        total: number;
        page: number;
        limit: number;
    },
    {
        page?: number;
        limit?: number;
        search?: string;
        status?: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED'
    },
    { rejectValue: string }
>(
    'project/listProjects',
    async (params, { rejectWithValue }) => {
        try {
            const response = await projectApi.getProjects(params);
            return response.data.data;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createProject = createAsyncThunk<
    Project,
    {
        name: string;
        description?: string;
        startDate?: string;
        endDate?: string;
        members?: {
            userId: string
        }[]
    },
    { rejectValue: string }
>(
    'project/createProject',
    async (data, { rejectWithValue }) => {
        try {
            const response = await projectApi.createProject(data);
            return response.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const deleteProject=createAsyncThunk<
string,
{projectId:string},
{rejectValue:string}
>(
    'project/deleteProject',
    async({projectId},{rejectWithValue})=>{
        try {
            await projectApi.deleteProject(projectId);
            return projectId;
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


export const getProjectDetail=createAsyncThunk<
ProjectDetail,
string,
{rejectValue:string}
>(
    'project/getProjectDetail',
    async(projectId,{rejectWithValue})=>{
        try {
            const response=await projectApi.getProjectDetail(projectId);
            return response.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


export const removeMemberFromProject = createAsyncThunk<
  void,
  { projectId: string; memberId: string },
  { rejectValue: string }
>(
  'project/removeMember',
  async ({ projectId, memberId }, { dispatch, rejectWithValue }) => {
    try {
      await projectApi.removeProjectMember(projectId, memberId);
      dispatch(getProjectDetail(projectId));
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addMembersToProject=createAsyncThunk<
void,
{projectId:string; userId:string},
{rejectValue:string}
>(
    'project/addMembers',
    async({projectId,userId},{dispatch,rejectWithValue})=>{
        try {
            await projectApi.addProjectMembers(projectId,userId);
            dispatch(getProjectDetail(projectId))
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateProject = createAsyncThunk<
  void,
  {
    projectId: string;
    data: {
      name?: string;
      description?: string;
      startDate?: string | null;
      endDate?: string | null;
      status?: "ACTIVE" | "ARCHIVED" | "COMPLETED";
    };
  },
  { rejectValue: string }
>(
  "project/updateProject",
  async ({ projectId, data }, { dispatch, rejectWithValue }) => {
    try {
      await projectApi.updateProject(projectId, data);
      // ✅ ALWAYS refresh full project (with members)
      dispatch(getProjectDetail(projectId));
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);



const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        clearProjectError(state) {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createFirstProject.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createFirstProject.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(createFirstProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })


            .addCase(listProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit
            })
            .addCase(listProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(deleteProject.pending,(state)=>{
                state.loading=false;
            })
            .addCase(deleteProject.fulfilled,(state,action)=>{
                state.loading=false;
                state.projects=state.projects.filter((p)=>p.id!==action.payload)
                state.total-=1;
            })
            .addCase(deleteProject.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload as string
            })

            .addCase(getProjectDetail.pending,(state)=>{
                state.loading=true;
                state.error=null;
                state.selectedProject=null
            })

            .addCase(getProjectDetail.fulfilled,(state,action)=>{
                state.loading=false;
                state.selectedProject=action.payload
            })
            .addCase(getProjectDetail.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload as string
            })

            .addCase(updateProject.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(updateProject.fulfilled,(state)=>{
                state.loading=false;

            })
            .addCase(updateProject.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload as string
            })
    }
})

export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;