import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Project, ProjectDetail } from "../types/project.types";
import { projectApi } from "../services/project.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface ProjectState {
    loading: boolean;
    error: string | null;

    projects: Project[];
    selectedProject: ProjectDetail | null;

    total: number;
    page: number;
    limit: number;
}

const initialState: ProjectState = {
    loading: false,
    error: null,

    projects: [],
    selectedProject: null,

    total: 0,
    page: 1,
    limit: 10
}


export const fetchProject = createAsyncThunk<
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
        status?: "ACTIVE" | "ARCHIVED" | "COMPLETED";
    },
    { rejectValue: string }
>(
    "developer/projects/fetch",
    async (params, { rejectWithValue }) => {
        try {
            const res = await projectApi.getProjects(params);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchProjectDetail = createAsyncThunk<
    ProjectDetail,
    string,
    { rejectValue: string }
>(
    "developer/projects/detail",
    async (projectId, { rejectWithValue }) => {
        try {
            const res = await projectApi.getProjectDetail(projectId);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

const projectSlice = createSlice({
    name: "developerProjects",
    initialState,
    reducers: {
        clearProjectError(state) {
            state.error = null;
        },
        clearSelectedProject(state) {
            state.selectedProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })

            .addCase(fetchProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })


            .addCase(fetchProjectDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedProject = null;
            })

            .addCase(fetchProjectDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProject = action.payload;
            })

            .addCase(fetchProjectDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
    }
})

export const { clearProjectError,
    clearSelectedProject, } = projectSlice.actions
export default projectSlice.reducer;