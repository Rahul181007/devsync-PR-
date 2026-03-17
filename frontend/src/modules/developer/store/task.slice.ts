import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DeveloperTaskBoard, DeveloperTaskDetail, TaskComment } from "../types/task.type";
import { devTaskApi } from "../services/task.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface DeveloperTaskState {
    loading: boolean;
    error: string | null;
    selectedTask: DeveloperTaskDetail | null;
    board: DeveloperTaskBoard | null;
    comments: TaskComment[];
    commentsLoading: boolean;
}
const initialState: DeveloperTaskState = {
    loading: false,
    error: null,
    selectedTask: null,
    board: null,
    comments: [],
    commentsLoading: false,
};

export const getDeveloperTasks = createAsyncThunk<
    DeveloperTaskBoard,
    string,
    { rejectValue: string }
>(
    "developerTask/getTask",
    async (projectId, { rejectWithValue }) => {
        try {
            const res = await devTaskApi.getProjectTask(projectId);
            return res.data.data;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const getDeveloperTaskDetails = createAsyncThunk<
    DeveloperTaskDetail,
    { projectId: string, taskId: string },
    { rejectValue: string }
>(
    "developer/taskDetail",
    async ({ projectId, taskId }, { rejectWithValue }) => {
        try {
            const res = await devTaskApi.getProjectTaskDetail(projectId, taskId);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateDeveloperTaskStatus = createAsyncThunk<
    void,
    {
        projectId: string;
        taskId: string;
        status: "TODO" | "IN_PROGRESS"
    }, { rejectValue: string }
>(
    "developer/updateTask",
    async ({ projectId, taskId, status }, { dispatch, rejectWithValue }) => {
        try {
            await devTaskApi.updateTaskStatus(projectId, taskId, status);
            dispatch(getDeveloperTasks(projectId))
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const submitDeveloperTask = createAsyncThunk<
    void,
    {
        projectId: string;
        taskId: string;
        data: {
            summary: string;
            workDone: string;
            blockers?: string

        }
    }, { rejectValue: string }
>(
    "developer/submitTask",
    async ({ projectId, taskId, data }, { dispatch, rejectWithValue }) => {
        try {
            await devTaskApi.submitTask(projectId, taskId, data);
            dispatch(getDeveloperTasks(projectId))
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getDeveloperTaskComments = createAsyncThunk<
    TaskComment[],
    { projectId: string; taskId: string },
    { rejectValue: string }
>(
    "developerTask/getComments",
    async ({ projectId, taskId }, { rejectWithValue }) => {
        try {
            const res = await devTaskApi.getTaskComments(projectId, taskId);
            return res.data.data;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


export const addDeveloperTaskComment = createAsyncThunk<
    void,
    { projectId: string; taskId: string; message: string },
    { rejectValue: string }
>(
    "developerTask/addComment",
    async ({ projectId, taskId, message }, { dispatch, rejectWithValue }) => {
        try {
            await devTaskApi.addTaskComment(projectId, taskId, message);

            dispatch(getDeveloperTaskComments({ projectId, taskId }));
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


const developerTaskSlice = createSlice({
    name: 'developerTask',
    initialState,
    reducers: {
        clearSelectedTask(state) {
            state.selectedTask = null;
        },
        clearDeveloperTaskError(state) {
            state.error = null;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getDeveloperTasks.pending, (state) => {
                state.loading = true;
                state.error = null
            })

            .addCase(getDeveloperTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.board = action.payload
            })
            .addCase(getDeveloperTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(getDeveloperTaskDetails.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getDeveloperTaskDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTask = action.payload
            })

            .addCase(getDeveloperTaskDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(getDeveloperTaskComments.pending, (state) => {
                state.commentsLoading = true;
            })
            .addCase(getDeveloperTaskComments.fulfilled, (state, action) => {
                state.commentsLoading = false;
                state.comments = action.payload;
            })
            .addCase(getDeveloperTaskComments.rejected, (state) => {
                state.commentsLoading = false;
            })
    }
})

export const {
    clearDeveloperTaskError,
    clearSelectedTask
} = developerTaskSlice.actions;

export default developerTaskSlice.reducer;